const express = require("express");
const router = express.Router();

const {
  employerSignin,
  EmployerSignup,
  getMyProfile,
  updateEmployerProfile,
  postJob,
  updateJob,
  deleteJob,
  getAllJobs,
  sendJobOffersToRelevantSeekers,
  getAllJobSeekersOffered,
  getAllAcceptedJobSeekers,
  getAcceptedJobSeekerDetails,
  getApplicationsByJobId,
  updateApplicationStatus,
} = require("../../controllers/authController/employer");

const auth = require("../../middlewares/authMiddleware");
const { authorizeRoles } = require("../../middlewares/roleMiddleware");

router.post("/signup", EmployerSignup);
// router.post("/login", employerSignin);

router.get("/profile", auth, authorizeRoles(["employer"]), getMyProfile);
router.put('/profile',auth,authorizeRoles(["employer"]),updateEmployerProfile)

router.post("/post-job", auth, authorizeRoles(["employer"]), postJob);
router.post("/update-job/:jobId", auth, authorizeRoles(["employer"]), updateJob);
router.delete("/delete-job/:jobId", auth, authorizeRoles(["employer"]), deleteJob);
router.get("/posted-joblist", auth, authorizeRoles(["employer"]), getAllJobs);

router.post(
  "/send-jobOffer",
  auth,
  authorizeRoles(["employer"]),
  sendJobOffersToRelevantSeekers
);

router.get(
  "/list-offered-seeker",
  auth,
  authorizeRoles(["employer"]),
  getAllJobSeekersOffered
);

router.get(
  "/accepted-seekers",
  auth,
  authorizeRoles(["employer"]),
  getAllAcceptedJobSeekers
);

router.get(
  "/accepted-seeker/profile",
  auth,
  authorizeRoles(["employer"]),
  getAcceptedJobSeekerDetails
);

router.get(
  "/get-applications",
  auth,
  authorizeRoles(["employer"]),
  getApplicationsByJobId
);

router.post(
  "/update-application-status/:id",
  auth,
  authorizeRoles(["employer"]),
  updateApplicationStatus
);
module.exports = router;
