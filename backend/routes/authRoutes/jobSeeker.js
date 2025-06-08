const express = require("express");
const router = express.Router();
const {
  jobSeekerSignup,
 
  getMyProfile,
  updateSeekerProfile,
  getJobById,
  applyToJob,
  getAppliedJobs,
  getAppliedJobById,
  getAcceptedJobs,
  getJobOffersForSeeker,
  getJobOfferById,
  updateJobOfferStatus,
} = require("../../controllers/authController/jobSeeker");
const auth = require("../../middlewares/authMiddleware");
const { authorizeRoles } = require("../../middlewares/roleMiddleware");

router.post("/signup", jobSeekerSignup);
router.get("/profile", auth, authorizeRoles(["job_seeker"]), getMyProfile);
router.put(
  "/profile",
  auth,
  authorizeRoles(["job_seeker"]),
  updateSeekerProfile
);

router.get("/job/:id", auth, authorizeRoles(["job_seeker"]), getJobById);
router.post("/apply-job", auth, authorizeRoles(["job_seeker"]), applyToJob);
router.get(
  "/all-applied-job",
  auth,
  authorizeRoles(["job_seeker"]),
  getAppliedJobs
);
router.get(
  "/applied-jobs/:jobId",
  auth,
  authorizeRoles(["job_seeker"]),
  getAppliedJobById
);
router.get(
  "/accepted-job",
  auth,
  authorizeRoles(["job_seeker"]),
  getAcceptedJobs
);
router.get(
  "/job-offers",
  auth,
  authorizeRoles(["job_seeker"]),
  getJobOffersForSeeker
);
router.get(
  "/job-offers/:id",
  auth,
  authorizeRoles(["job_seeker"]),
  getJobOfferById
);
router.put("/job-offers/:id", auth,
  authorizeRoles(["job_seeker"]), updateJobOfferStatus);


module.exports = router;
