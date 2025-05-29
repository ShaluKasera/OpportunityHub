const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const {
  sendOtpEmail,
  sendResetPasswordOtp,
} = require("../../services/emailService/emailVerification");


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = new Map(); 

const storeOtp = (email, otp) => {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const existing = otpStore.get(email) || [];
  otpStore.set(email, [...existing, { otp, expires }]);
};

const isValidOtp = (email, otp) => {
  const storedOtps = otpStore.get(email) || [];
  const latestValid = storedOtps.filter(entry => entry.expires > Date.now()).pop();
  return latestValid && latestValid.otp === otp;
};

const clearOtps = (email) => otpStore.delete(email);


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

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

module.exports = {
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
};
