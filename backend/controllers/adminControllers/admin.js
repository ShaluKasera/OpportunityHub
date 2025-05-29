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
const jwt = require("jsonwebtoken");
const {
  sendOtpEmail,
} = require("../../services/emailService/emailVerification");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const adminSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
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
      role: "admin",
      isApprovedForAdminRole: false,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
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
      message:
        "Signup successful,verify your email and wait until accept your profile.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", err: error });
  }
};

const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Email not verified. Please verify your email." });
    }

    if (!user.isApprovedForAdminRole) {
      return res
        .status(403)
        .json({
          message:
            "Not approved by Super admin , wait for approved by super admin.",
        });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user.id,
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
      user,
    });
  } catch (error) {
    console.error("Admin Signin Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllSeeker = async (req, res) => {
  try {
    const seekers = await User.findAll({
      where: { role: "job_seeker" },
      include: [
        {
          model: JobSeeker,
          as: "jobSeeker", 
        },
      ],
      attributes: { exclude: ["password"] }, 
    });

    return res.status(200).json({ seekers });
  } catch (error) {
    console.error("Error fetching seekers:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllEmployer = async (req, res) => {
  try {
    const employer = await User.findAll({
      where: { role: "employer" },
      include: [
        {
          model: Employer,
          as: "employer", 
        },
      ],
      attributes: { exclude: ["password"] }, 
    });

    return res.status(200).json({ employer });
  } catch (error) {
    console.error("Error fetching seekers:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const approveEmployerById = async (req, res) => {
  try {
    const { id } = req.params;

    const employer = await Employer.findOne({
      where: {
        id,
        isVerified: false,
      },
    });

    if (!employer) {
      return res.status(404).json({ message: "Employer not found or already approved." });
    }

    employer.isVerified = true;
    await employer.save();

    return res.status(200).json({ message: "Employer approved successfully.", employer });
  } catch (error) {
    console.error("Error approving employer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteEmployerById = async (req, res) => {
  try {
    const { id } = req.params;

    const employer = await Employer.findOne({ where: { id } });

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    const userId = employer.userId;

    await employer.destroy();

    await User.destroy({ where: { id: userId } });

    return res.status(200).json({ message: "Employer (and associated user) deleted successfully" });
  } catch (error) {
    console.error("Delete Employer Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSeekerById = async (req, res) => {
  try {
    const { id } = req.params;

    const jobSeeker = await JobSeeker.findOne({ where: { id } });

    if (!jobSeeker) {
      return res.status(404).json({ message: "JobSeeker not found" });
    }
    const userId = jobSeeker.userId;

    await jobSeeker.destroy();

    await User.destroy({ where: { id: userId } });

    return res.status(200).json({ message: "JobSeeker (and associated user) deleted successfully" });
  } catch (error) {
    console.error("Delete JobSeeker Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  adminSignup,
  adminSignin,
  getAllSeeker,
  getAllEmployer,
  approveEmployerById,
  deleteEmployerById,
  deleteSeekerById,
};
