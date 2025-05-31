const express = require("express");
const router = express.Router();
const {
  loginUser,
 verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} = require("../../controllers/authController/user");

router.post("/login", loginUser);
router.post("/verify-email", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;
