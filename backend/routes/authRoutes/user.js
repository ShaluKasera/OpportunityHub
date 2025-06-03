const express = require("express");
const router = express.Router();
const {
  loginUser,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  getAllJobs,
  getJodById,
  verifyOtp,
} = require("../../controllers/authController/user");


router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
router.get("/all-jobs", getAllJobs);
router.get("/job/:id", getJodById);
router.post("/verify-otp", verifyOtp);

module.exports = router;
