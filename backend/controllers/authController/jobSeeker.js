const {
  User,
  JobSeeker,
  Job,
  JobApplication,
  JobOffer,
  Employer,
} = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../config/mysql/sequelize");
const {
  sendOtpEmail,
} = require("../../services/emailService/emailVerification");

const { storeOtp, generateOTP } = require("../../utils/otpHelper");

const jobSeekerSignup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      email,
      password,
      phone,
      domain,
      location,
      experienceYears,
      skills,
      resumeUrl,
    } = req.body;

    const profilePic = req.file?.path || null;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !domain ||
      !location ||
      !experienceYears ||
      !skills
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    const existingPhone = await JobSeeker.findOne({ where: { phone } });
    if (existingPhone || existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    storeOtp(email, otp);

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        role: "job_seeker",
      },
      { transaction: t }
    );

    const jobSeeker = await JobSeeker.create(
      {
        userId: user.id,
        phone,
        domain,
        location,
        experienceYears,
        skills,
        resumeUrl,
        profilePicUrl: profilePic || null,
      },
      { transaction: t }
    );

    await sendOtpEmail(email, otp, name);
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      jobSeeker,
    });
  } catch (error) {
    console.log("Signup Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Signup error", err: error });
  }
};

const getMyProfile = async (req, res) => {
  const userId = req.user?.id;

  try {
    const profile = await JobSeeker.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
      ],
    });

    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });

    res.status(200).json(profile);
  } catch (error) {
    console.log("getMyProfile error", error);
    return res
      .status(500)
      .json({ success: false, message: `getMyProfile error: ${error}` });
  }
};

const updateSeekerProfile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      domain,
      location,
      experienceYears,
      skills,
      resumeUrl,
    } = req.body||{};
    const profilePicUrl = req.file?.path;
    if (name) {
      await User.update({ name }, { where: { id: userId }, transaction: t });
    }

    const jobSeeker = await JobSeeker.findOne({
      where: { userId },
      transaction: t,
    });
    if (!jobSeeker) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (domain) updateData.domain = domain;
    if (experienceYears) updateData.experienceYears = experienceYears;
    if (skills) updateData.skills = skills;
    if (location) updateData.location = location;
    if (resumeUrl) updateData.resumeUrl = resumeUrl;
    if (profilePicUrl) updateData.profilePicUrl = profilePicUrl;

    if (Object.keys(updateData).length > 0) {
      await JobSeeker.update(updateData, { where: { userId }, transaction: t });
    }
    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Update Seeker Profile Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: `Update Seeker Profile error: ${error}`,
      });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      domain,
      jobType,
      keyword,
    } = req.query;
    const offset = (page - 1) * limit;

    const filter = {};

    if (location) {
      filter.location = { [Op.like]: `%${location}%` };
    }

    if (domain) {
      filter.domain = { [Op.like]: `%${domain}%` };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (keyword) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const jobs = await Job.findAndCountAll({
      where: filter,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      totalJobs: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page),
      jobs: jobs.rows,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({
      success: false,
      message: `Server error while fetching jobs: ${err}`,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job details fetched successfully",
      job,
    });
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    return res.status(500).json({
      success: false,
      message: `Server error while fetching job details ${getJobById}`,
    });
  }
};

const applyToJob = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { jobId, coverLetter } = req.body;
    const jobSeekerId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({
      where: { userId: jobSeekerId },
      transaction: t,
    });
    if (!jobSeeker) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Job seeker profile not found" });
    }

    const job = await Job.findByPk(jobId, { transaction: t });
    if (!job) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existingApplication = await JobApplication.findOne({
      where: { jobId, jobSeekerId: jobSeeker.id },
      transaction: t,
    });

    if (existingApplication) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const application = await JobApplication.create(
      {
        jobId,
        jobSeekerId: jobSeeker.id,
        coverLetter,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error applying to job:", error);
    res.status(500).json({
      success: false,
      message: `Server error while applying to job ${error}`,
    });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobSeeker = await JobSeeker.findOne({
      where: { userId: userId },
    });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found",
      });
    }

    const jobSeekerId = jobSeeker.id;

    const applications = await JobApplication.findAll({
      where: { jobSeekerId },
      include: [
        {
          model: Job,
          as: "job",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "salary",
            "jobType",
            "domain",
            "experienceRequired",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Applied jobs fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({
      success: false,
      message: `Server error while fetching applied jobs: ${error}`,
    });
  }
};

const getAppliedJobById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const jobSeeker = await JobSeeker.findOne({
      where: { userId: userId },
    });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found",
      });
    }

    const jobSeekerId = jobSeeker.id;

    const application = await JobApplication.findOne({
      where: {
        jobId: jobId,
        jobSeekerId: jobSeekerId,
      },
      include: [
        {
          model: Job,
          as: "job",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "salary",
            "jobType",
            "domain",
            "experienceRequired",
          ],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this job",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applied job fetched successfully",
      application,
    });
  } catch (error) {
    console.error("Error fetching specific applied job:", error);
    return res.status(500).json({
      success: false,
      message: `Server error while fetching job application ${error}`,
    });
  }
};

const getAcceptedJobs = async (req, res) => {
  try {
    const jobSeekerId = req.user.id;

    const acceptedApplications = await JobApplication.findAll({
      where: {
        jobSeekerId,
        status: "accepted",
      },
      include: [
        {
          model: Job,
          as: "job",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "salary",
            "jobType",
            "domain",
            "experienceRequired",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Accepted jobs fetched successfully",
      acceptedJobs: acceptedApplications,
    });
  } catch (error) {
    console.error("Error fetching accepted jobs:", error);
    return res.status(500).json({
      success: false,
      message: `Server error while fetching accepted jobs: ${error}`,
    });
  }
};

const getJobOffersForSeeker = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({
      where: { userId },
    });

    if (!jobSeeker) {
      return res
        .status(404)
        .json({ success: false, message: "Job seeker not found" });
    }

    const offers = await JobOffer.findAll({
      where: { jobSeekerId: jobSeeker.id },
      include: [
        {
          model: Job,
          as: "job",
        },
        {
          model: Employer,
          as: "employer",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
      order: [["sentAt", "DESC"]],
    });

    res.status(200).json({ success: true, jobOffers: offers });
  } catch (error) {
    console.error("Error fetching job offers for seeker:", error);
    res
      .status(500)
      .json({
        success: false,
        message: `Error fetching job offers for seeker: ${error}`,
      });
  }
};

const getJobOfferById = async (req, res) => {
  try {
    const { id: jobOfferId } = req.params;
    const userId = req.user.id;
    const jobSeeker = await JobSeeker.findOne({
      where: { userId: userId },
    });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found",
      });
    }
    const jobSeekerId = jobSeeker.id;

    const jobOffer = await JobOffer.findOne({
      where: {
        id: jobOfferId,
        jobSeekerId: jobSeekerId,
      },
      include: [
        {
          model: Job,
          as: "job",
        },
        {
          model: Employer,
          as: "employer",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    if (!jobOffer) {
      return res.status(404).json({
        success: false,
        message: "Job offer not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      jobOffer,
    });
  } catch (err) {
    console.error("Error fetching job offer:", err);
    res.status(500).json({
      success: false,
      message: `Server error while retrieving job offer: ${err}`,
    });
  }
};

const updateJobOfferStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const offerId = req.params.id;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const jobOffer = await JobOffer.findByPk(offerId);

    if (!jobOffer) {
      return res
        .status(404)
        .json({ success: false, message: "Job offer not found" });
    }

    jobOffer.status = status;
    jobOffer.respondedAt = new Date();
    await jobOffer.save();

    res
      .status(200)
      .json({ success: true, message: "Job offer updated", jobOffer });
  } catch (error) {
    console.error("Update job offer error:", error);
    res
      .status(500)
      .json({ success: false, message: `Update job offer error: ${error}` });
  }
};

module.exports = {
  jobSeekerSignup,
  // jobSeekerSignin,
  getMyProfile,
  updateSeekerProfile,
  getAllJobs,
  getJobById,
  applyToJob,
  getAppliedJobs,
  getAppliedJobById,
  getAcceptedJobs,
  getJobOffersForSeeker,
  getJobOfferById,
  updateJobOfferStatus,
};
