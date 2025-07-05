const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User, Employer, JobSeeker, Job } = require("../../models");
const setTokenCookie = require("../../authServices/setCookie");
const clearTokenCookie = require("../../authServices/clearCookie");
const { createToken } = require("../../authServices/create&validateToken");
const { sequelize } = require("../../config/mysql/sequelize");

const {
  sendOtpEmail,
  sendResetPasswordLink,
} = require("../../services/emailService/emailVerification");
const { Op } = require("sequelize");
const {
  generateOTP,
  storeOtp,
  clearOtps,
  isValidOtp,
} = require("../../utils/otpHelper");

//login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ sucess: false, message: "User not found" });

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    let profileData = null;

    if (user.role === "employer") {
      const employer = await Employer.findOne({ where: { userId: user.id } });
      if (!employer)
        return res
          .status(404)
          .json({ success: false, message: "Employer profile not found" });

      if (!employer.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Employer account not verified by admin.",
        });
      }

      profileData = { profile: employer, profileType: "employer" };
    } else if (user.role === "job_seeker") {
      const jobSeeker = await JobSeeker.findOne({ where: { userId: user.id } });
      if (!jobSeeker)
        return res
          .status(404)
          .json({ success: false, message: "Job seeker profile not found" });

      profileData = { profile: jobSeeker, profileType: "job_seeker" };
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Role not supported" });
    }

    const token = createToken(user);

    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...profileData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: `Login Error: ${error}` });
  }
};

//logOut
const handleLogout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(`Logout error: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: `Logout error: ${error}` });
  }
};

//verify email
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    const valid = isValidOtp(email, otp);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    await user.save();

    clearOtps(email);

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: `verifyEmail error: ${error}`});
  }
};

//resend otp for email verification
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    const otp = generateOTP();
    storeOtp(email, otp);

    await sendOtpEmail(email, otp, user.name);

    return res
      .status(200)
      .json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ success: false, message: `ResendOtp error: ${error}` });
  }
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    setTokenCookie(res, token);

    const resetLink = `${process.env.CLIENT_URL}/reset-password`;
    await sendResetPasswordLink(email, resetLink, user.name);
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ success: false, message:`Forgot Password Error:${error}` });
  }
};

//reset password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const token = req.cookies.resetToken;

  const t = await sequelize.transaction();

  try {
    // Validate inputs
    if (!email || !newPassword || !token) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, password, and token are required",
        });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updated] = await User.update(
      { password: hashedPassword },
      { where: { email }, transaction: t }
    );

    if (updated === 0) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User not found or update failed" });
    }

    clearTokenCookie(res);

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ success: false, message: `Reset error: ${error}`});
  }
};

//get all jobs
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
      message:`Error fetching jobs ${error} ` ,
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
  } catch (error) {
    res.status(500).json({ success: false,  message:`Error fetching jobs by id: ${error} `});
  }
};

module.exports = {
  loginUser,
  handleLogout,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  getAllJobs,
  getJodById,
  // verifyOtp,
};
