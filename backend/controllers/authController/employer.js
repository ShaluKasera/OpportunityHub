const {
  User,
  Employer,
  Job,
  JobApplication,
  JobOffer,
  JobSeeker,
} = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../config/mysql/sequelize");
const jwt = require("jsonwebtoken");
const {
  sendOtpEmail,
  sendJobOfferEmail,
} = require("../../services/emailService/emailVerification");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const EmployerSignup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      email,
      password,
      phone,
      companyName,
      companySize,
      industry,
      location,
      description,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !companyName ||
      !location ||
      !companySize ||
      !industry ||
      !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        role: "employer",
      },
      { transaction: t }
    );

    const employer = await Employer.create(
      {
        userId: user.id,
        phone,
        companyName,
        companySize,
        industry,
        location,
        description,
        isVerified: false,
      },
      { transaction: t }
    );

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    await sendOtpEmail(email, otp, name);
    await t.commit();

    return res.status(201).json({
      message:
        "Signup successful,verify your email and wait until accept your profile.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      employer,
    });
  } catch (error) {
    await t.rollback();
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", err: error });
  }
};

// const employerSignin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.isEmailVerified) {
//       return res
//         .status(403)
//         .json({ message: "Email not verified. Please verify your email." });
//     }

//     if (user.role !== "employer") {
//       return res.status(403).json({ message: "Not authorized as an employer" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const employer = await Employer.findOne({ where: { userId: user.id } });
//     if (!employer) {
//       return res.status(404).json({ message: "Employer profile not found" });
//     }

//     if (!employer.isVerified) {
//       return res
//         .status(403)
//         .json({ message: "Employer account not verified by admin." });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//       employer,
//     });
//   } catch (error) {
//     console.error("Employer Signin Error:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

const updateEmployerProfile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      companyName,
      companySize,
      industry,
      location,
      description,
    } = req.body;

    if (name) {
      await User.update({ name }, { where: { id: userId }, transaction: t });
    }

    const employer = await Employer.findOne({
      where: { userId },
      transaction: t,
    });
    if (!employer) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (companyName) updateData.companyName = companyName;
    if (companySize) updateData.companySize = companySize;
    if (industry) updateData.industry = industry;
    if (location) updateData.location = location;
    if (description) updateData.description = description;

    if (Object.keys(updateData).length > 0) {
      await Employer.update(updateData, { where: { userId }, transaction: t });
    }
    await t.commit();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", err: error });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Employer.findOne({
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
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postJob = async (req, res) => {
  const userId = req.user.id;
  const jobData = req.body;
  if (jobData.salary && !jobData.salary.trim().startsWith("$")) {
    return res.status(400).json({ message: "Salary must start with $" });
  }

  const t = await sequelize.transaction();

  try {
    const employer = await Employer.findOne({
      where: { userId },
      transaction: t,
    });
    if (!employer)
      return res.status(404).json({ message: "Employer profile not found" });

    const job = await Job.create(
      { employerId: employer.id, ...jobData },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  const updateData = req.body;

  // Fix here: use updateData.salary, not jobData.salary
  if (updateData.salary && !updateData.salary.trim().startsWith("$")) {
    return res.status(400).json({ message: "Salary must start with $" });
  }

  const t = await sequelize.transaction();

  try {
    const employer = await Employer.findOne({
      where: { userId },
      transaction: t,
    });
    if (!employer) {
      await t.rollback();
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const job = await Job.findOne({
      where: { id: jobId, employerId: employer.id },
      transaction: t,
    });
    if (!job) {
      await t.rollback();
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    await Job.update(updateData, { where: { id: jobId }, transaction: t });
    const updatedJob = await Job.findByPk(jobId, { transaction: t });

    await t.commit();

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  const t = await sequelize.transaction();

  try {
    const employer = await Employer.findOne({
      where: { userId },
      transaction: t,
    });
    if (!employer) {
      await t.rollback();
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const job = await Job.findOne({
      where: { id: jobId, employerId: employer.id },
      transaction: t,
    });
    if (!job) {
      await t.rollback();
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    await Job.destroy({ where: { id: jobId }, transaction: t });
    await t.commit();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  const userId = req.user.id;

  try {
    const employer = await Employer.findOne({ where: { userId } });
    if (!employer)
      return res.status(404).json({ message: "Employer profile not found" });

    const { title, jobType, salaryRange, deadline } = req.query;

    // Build dynamic filters
    const whereClause = { employerId: employer.id };

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive LIKE
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (salaryRange) {
      const [min, max] = salaryRange.split(",").map(Number);
      whereClause.salary = { [Op.between]: [min, max] };
    }

    if (deadline) {
      whereClause.deadline = { [Op.lte]: new Date(deadline) };
    }

    const jobs = await Job.findAll({ where: whereClause });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPostedJobById = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    const employer = await Employer.findOne({ where: { userId } });
    if (!employer) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const job = await Job.findOne({
      where: {
        id: jobId,
        employerId: employer.id,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendJobOffersToRelevantSeekers = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;
  const t = await sequelize.transaction();
  if (!jobId || isNaN(Number(jobId))) {
    return res.status(400).json({ message: "Invalid or missing jobId." });
  }

  try {
    const employer = await Employer.findOne({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
      transaction: t,
    });

    if (!employer) {
      await t.rollback();
      return res.status(404).json({ message: "Employer not found." });
    }

    const job = await Job.findOne({
      where: { id: jobId, employerId: employer.id },
      transaction: t,
    });

    if (!job) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized." });
    }

    const requiredSkills = job.skills || [];
    const jobDomain = job.domain;

    const acceptedCount = await JobOffer.count({
      where: {
        jobId: job.id,
        status: "accepted",
      },
      transaction: t,
    });

    if (acceptedCount >= job.openings) {
      await t.rollback();
      return res.status(400).json({ message: "Job openings already filled." });
    }

    const matchingJobSeekers = await JobSeeker.findAll({
      where: {
        availabilityStatus: "available",
        domain: jobDomain,
      },
      include: [{ model: User, as: "user", attributes: ["email", "name"] }],
      transaction: t,
    });

    let offersSent = 0;

    for (const jobSeeker of matchingJobSeekers) {
      const seekerSkills = jobSeeker.skills || [];

      const hasMatchingSkill = requiredSkills.some((skill) =>
        seekerSkills.includes(skill)
      );

      if (!hasMatchingSkill) continue;

      const alreadyOffered = await JobOffer.findOne({
        where: {
          jobId: job.id,
          jobSeekerId: jobSeeker.id,
          employerId: employer.id,
        },
        transaction: t,
      });

      if (alreadyOffered) continue;
      if (!jobSeeker.user?.email) continue;
      if (acceptedCount + offersSent >= job.openings) continue;

      const acceptLink = `${process.env.CLIENT_URL}/accept-offer/${job.id}?seekerId=${jobSeeker.id}`;

      // Sending email can be outside transaction (doesn't affect DB transaction)
      await sendJobOfferEmail(
        jobSeeker.user.email,
        jobSeeker.user.name,
        job.title,
        acceptLink,
        employer.companyName,
        employer.user.name,
        employer.user.email,
        job.domain
      );

      await JobOffer.create(
        {
          jobId: job.id,
          jobSeekerId: jobSeeker.id,
          employerId: employer.id,
          status: "sent",
          sentAt: new Date(),
        },
        { transaction: t }
      );
      offersSent++;
    }

    if (offersSent === 0) {
      await t.commit();
      return res
        .status(200)
        .json({ message: "No matching or eligible job seekers found." });
    }

    await t.commit();
    res
      .status(200)
      .json({ message: `Job offers sent to ${offersSent} job seekers.` });
  } catch (error) {
    await t.rollback();
    console.error("Error sending job offers:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllJobSeekersOffered = async (req, res) => {
  const userId = req.user.id;

  try {
    const employer = await Employer.findOne({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    });
    if (!employer)
      return res.status(404).json({ message: "Employer not found" });

    const offers = await JobOffer.findAll({
      where: { employerId: employer.id },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
        {
          model: Job,
          as: "job",
          attributes: ["title"],
        },
      ],
      order: [["sentAt", "DESC"]],
    });

    const formattedOffers = offers.map((offer) => ({
      jobTitle: offer.job?.title || "N/A",
      status: offer.status,
      sentAt: offer.sentAt,
      respondedAt: offer.respondedAt,
      jobSeeker:
        offer.jobSeeker && offer.jobSeeker.user
          ? {
              id: offer.jobSeeker.id,
              name: offer.jobSeeker.user.name,
              email: offer.jobSeeker.user.email,
              domain: offer.jobSeeker.domain,
              skills: offer.jobSeeker.skills,
              availabilityStatus: offer.jobSeeker.availabilityStatus,
            }
          : {},
    }));

    res.status(200).json({ offers: formattedOffers });
  } catch (error) {
    console.error("Error fetching job offers:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllAcceptedJobSeekers = async (req, res) => {
  const userId = req.user.id;

  try {
    const employer = await Employer.findOne({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    });
    if (!employer)
      return res.status(404).json({ message: "Employer not found" });
    const acceptedOffers = await JobOffer.findAll({
      where: {
        employerId: employer.id,
        status: "accepted",
      },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          attributes: ["id", "domain", "skills"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
        {
          model: Job,
          as: "job",
          attributes: ["title"],
        },
      ],
      order: [["respondedAt", "DESC"]],
    });

    const formattedData = acceptedOffers.map((offer) => ({
      jobTitle: offer.job?.title,
      acceptedAt: offer.respondedAt,
      jobSeeker: {
        id: offer.jobSeeker?.id,
        name: offer.jobSeeker?.user?.name,
        email: offer.jobSeeker?.user?.email,
        domain: offer.jobSeeker?.domain,
        skills: offer.jobSeeker?.skills,
      },
    }));

    res.status(200).json({ acceptedJobSeekers: formattedData });
  } catch (error) {
    console.error("Error fetching accepted job seekers:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAcceptedJobSeekerDetails = async (req, res) => {
  const userId = req.user.id;
  const { jobSeekerId, jobId } = req.body;
  console.log(jobSeekerId, jobId);

  try {
    const employer = await Employer.findOne({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    });
    if (!employer)
      return res.status(404).json({ message: "Employer not found" });

    const jobOffer = await JobOffer.findOne({
      where: {
        employerId: employer.id,
        jobSeekerId,
        jobId,
        status: "accepted",
      },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
        {
          model: Job,
          as: "job",
          attributes: ["title", "description"],
        },
      ],
    });

    if (!jobOffer)
      return res
        .status(404)
        .json({ message: "No accepted offer found for this job seeker." });

    const data = {
      job: {
        title: jobOffer.job?.title,
        description: jobOffer.job?.description,
      },
      jobSeeker: {
        id: jobOffer.jobSeeker.id,
        name: jobOffer.jobSeeker.user.name,
        email: jobOffer.jobSeeker.user.email,
        domain: jobOffer.jobSeeker.domain,
        skills: jobOffer.jobSeeker.skills,
        resumeLink: jobOffer.jobSeeker.resumeLink || null,
      },
      acceptedAt: jobOffer.respondedAt,
    };

    res.status(200).json({ jobSeekerDetails: data });
  } catch (error) {
    console.error("Error fetching job seeker details:", error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationsByJobId = async (req, res) => {
  const { jobId } = req.body;

  const userId = req.user.id;
  const employer = await Employer.findOne({
    where: { userId: userId },
  });

  if (!employer) {
    return res.status(404).json({
      success: false,
      message: "Employer profile not found",
    });
  }
  const employerId = employer.id;

  try {
    const job = await Job.findOne({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId !== employerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to job applications" });
    }
    const applications = await JobApplication.findAll({
      where: { jobId },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  const employer = await Employer.findOne({
    where: { userId: userId },
  });

  if (!employer) {
    return res.status(404).json({
      success: false,
      message: "Employer profile not found",
    });
  }
  const employerId = employer.id;
  const t = await sequelize.transaction();

  try {
    const application = await JobApplication.findByPk(id, { transaction: t });

    if (!application) {
      await t.rollback();
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findByPk(application.jobId, { transaction: t });

    if (!job || job.employerId !== employerId) {
      await t.rollback();
      return res
        .status(403)
        .json({ message: "Unauthorized to update this application" });
    }

    application.status = status;
    await application.save({ transaction: t });

    await t.commit();

    res
      .status(200)
      .json({ message: "Application status updated", application });
  } catch (error) {
    await t.rollback();
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getallappliedjobSeeker = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { status: "applied" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getallreviewedjobSeeker = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { status: "reviewed" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getallacceptedjobSeeker = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { status: "accepted" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getallinterviewjobSeeker = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { status: "interview" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getallrejectedjobSeeker = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { status: "rejected" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: Job,
          as: "job",
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  // employerSignin,
  EmployerSignup,
  getMyProfile,
  updateEmployerProfile,
  postJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getPostedJobById,
  sendJobOffersToRelevantSeekers,
  getAllJobSeekersOffered,
  getAllAcceptedJobSeekers,
  getAcceptedJobSeekerDetails,
  getApplicationsByJobId,
  updateApplicationStatus,
  getAllApplications,
  getallappliedjobSeeker,
  getallreviewedjobSeeker,
  getallacceptedjobSeeker,
  getallinterviewjobSeeker,
  getallrejectedjobSeeker,
};
