const { User, JobSeeker,Job,JobApplication } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendOtpEmail,
} = require("../../services/emailService/emailVerification");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const jobSeekerSignup = async (req, res) => {
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

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !domain ||
      !location ||
      !experienceYears ||
      !skills ||
      !resumeUrl
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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      role: "job_seeker",
    });

    const jobSeeker = await JobSeeker.create({
      userId: user.id,
      phone,
      domain,
      location,
      experienceYears,
      skills,
      resumeUrl,
    });

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

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      jobSeeker,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", err: error });
  }
};

const jobSeekerSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isEmailVerified) {
      return res
        .status(404)
        .json({ message: "Email is not verified. Please verify the email" });
    }
    if (user.role !== "job_seeker") {
      return res
        .status(403)
        .json({ message: "Not authorized as a job seeker" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jobSeeker = await JobSeeker.findOne({ where: { userId: user.id } });

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job seeker profile not found" });
    }

    const token = jwt.sign(
      {
        id:user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jobSeeker,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyProfile = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)

  try {
    const profile = await JobSeeker.findOne({
      where: {
        userId,
      },
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateSeekerProfile = async (req, res) => {
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
    } = req.body;

    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    const jobSeeker = await JobSeeker.findOne({ where: { userId } });
    if (!jobSeeker) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (domain) updateData.domain = domain;
    if (experienceYears) updateData.experienceYears = experienceYears;
    if (skills) updateData.skills = skills;
    if (location) updateData.location = location;
    if (resumeUrl) updateData.resumeUrl = resumeUrl;

    if (Object.keys(updateData).length > 0) {
      await JobSeeker.update(updateData, { where: { userId } });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", err: error });
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
      message: "Server error while fetching jobs",
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
      message: "Server error while fetching job details",
    });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const jobSeekerId = req.user.id;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existingApplication = await JobApplication.findOne({
      where: { jobId, jobSeekerId },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const application = await JobApplication.create({
      jobId,
      jobSeekerId,
      coverLetter,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({
      success: false,
      message: "Server error while applying to job",
    });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const jobSeekerId = req.user.id;

    const applications = await JobApplication.findAll({
      where: { jobSeekerId },
      include: [
        {
          model: Job,
          as:"job",
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
      message: "Server error while fetching applied jobs",
    });
  }
};

const getAppliedJobById = async (req, res) => {
  try {
    const jobSeekerId = req.user.id;
    const { jobId } = req.body;

    const application = await JobApplication.findOne({
      where: {
        jobId,
        jobSeekerId,
      },
      include: [
        {
          model: Job,
          as:"job",
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
      message: "Server error while fetching job application",
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
          as:"job",
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
      message: "Server error while fetching accepted jobs",
    });
  }
};

module.exports = {
  jobSeekerSignup,
  jobSeekerSignin,
  getMyProfile,
  updateSeekerProfile,
  getAllJobs,
  getJobById,
  applyToJob,
  getAppliedJobs,
  getAppliedJobById,
  getAcceptedJobs,
};
