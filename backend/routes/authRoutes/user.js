const express = require("express");
const router = express.Router();
const {
  loginUser,
  handleLogout,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  getAllJobs,
  getJodById,
} = require("../../controllers/authController/user");
const auth = require("../../middlewares/authMiddleware");

router.post("/login", loginUser);
router.post("/logout", handleLogout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
router.get("/all-jobs", getAllJobs);
router.get("/job/:id", getJodById);

// for get user info
router.get("/me", auth, (req, res) => {
  const { name, role, email } = req.user;
  return res.json({
    user: {
      name,
      email,
    },
    role,
  });
});

module.exports = router;
