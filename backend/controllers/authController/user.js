const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Employer, JobSeeker, Job } = require("../../models");
const {
  sendOtpEmail,
  sendResetPasswordOtp,
} = require("../../services/emailService/emailVerification");
const { Op } = require("sequelize");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = new Map();

const storeOtp = (email, otp) => {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const existing = otpStore.get(email) || [];
  otpStore.set(email, [...existing, { otp, expires }]);
};

const isValidOtp = (email, otp) => {
  const storedOtps = otpStore.get(email) || [];

  const latestValid = storedOtps
    .filter((entry) => entry.expires > Date.now())
    .pop();

  return latestValid && latestValid.otp === otp;
};

const clearOtps = (email) => otpStore.delete(email);

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Email not verified. Please verify your email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    let roleData = null;

    if (user.role === "employer") {
      const employer = await Employer.findOne({ where: { userId: user.id } });
      if (!employer)
        return res.status(404).json({ message: "Employer profile not found" });

      if (!employer.isVerified) {
        return res
          .status(403)
          .json({ message: "Employer account not verified by admin." });
      }

      roleData = { employer };
    } else if (user.role === "job_seeker") {
      const jobSeeker = await JobSeeker.findOne({ where: { userId: user.id } });
      if (!jobSeeker)
        return res
          .status(404)
          .json({ message: "Job seeker profile not found" });

      roleData = { jobSeeker };
    } else {
      return res.status(403).json({ message: "Role not supported" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
      ...roleData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const valid = isValidOtp(email, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    await user.save();

    clearOtps(email);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const otp = generateOTP();
    storeOtp(email, otp);

    await sendOtpEmail(email, otp, user.name);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    storeOtp(email, otp);
    await sendResetPasswordOtp(email, otp, name);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!isValidOtp(email, otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.status(200).json({ message: "OTP verified successfully" });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!isValidOtp(email, otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { email } });
  clearOtps(email);

  res.status(200).json({ message: "Password reset successfully" });
};

const getAllJobs = async (req, res) => {
  try {
    const {
      title,
      jobType,
      minSalary,
      maxSalary,
      deadline,
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    if (jobType && jobType !== "") {
      whereClause.jobType = jobType;
    }

    if (minSalary || maxSalary) {
      whereClause.salary = {};
      if (minSalary) {
        whereClause.salary[Op.gte] = Number(minSalary);
      }
      if (maxSalary) {
        whereClause.salary[Op.lte] = Number(maxSalary);
      }
    }

    if (deadline) {
      whereClause.deadline = { [Op.lte]: new Date(deadline) };
    }

    const offset = (page - 1) * limit;

    const jobs = await Job.findAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
    });
  }
};

const getJodById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  loginUser,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  getAllJobs,
  getJodById,
  verifyOtp,
};
