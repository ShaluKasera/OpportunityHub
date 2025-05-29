const express = require("express");
const router = express.Router();
const {
 verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} = require("../../controllers/authController/user");


router.post("/verify-email", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;
