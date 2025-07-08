const express = require("express");
const router = express.Router();

const {
  EmployerSignup,
  getMyProfile,
  updateEmployerProfile,
  postJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getPostedJobById,
  sendJobOffersToRelevantSeekers,
  getAllJobSeekersOffered,
  getAllAcceptedJobSeekers,
  getallAcceptedapplications,
  getAcceptedJobSeekerDetails,
  getApplicationsByJobId,
  updateApplicationStatus,
  getAllApplications,
  getallappliedjobSeeker,
  getallinterviewjobSeeker,
  getallrejectedjobSeeker,
  getallreviewedjobSeeker,
} = require("../../controllers/authController/employer");

const auth = require("../../middlewares/authMiddleware");
const { authorizeRoles } = require("../../middlewares/roleMiddleware");
const getUploader = require("../../middlewares/cloudinaryUpload");
const upload = getUploader("CompanyLogo_OpportunityHub");


router.post("/signup", upload.single("companyLogoUrl"), EmployerSignup);

router.get("/profile", auth, authorizeRoles(["employer"]), getMyProfile);

router.put(
  "/profile",
  upload.single("companyLogoUrl"),
  auth,
  authorizeRoles(["employer"]),
  updateEmployerProfile
);

router.post("/post-job", auth, authorizeRoles(["employer"]), postJob);
router.put("/update-job/:jobId", auth, authorizeRoles(["employer"]), updateJob);
router.delete(
  "/delete-job/:jobId",
  auth,
  authorizeRoles(["employer"]),
  deleteJob
);
router.get("/posted-joblist", auth, authorizeRoles(["employer"]), getAllJobs);
router.get(
  "/posted-joblist/:jobId",
  auth,
  authorizeRoles(["employer"]),
  getPostedJobById
);

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

router.put(
  "/update-application-status/:id",
  auth,
  authorizeRoles(["employer"]),
  updateApplicationStatus
);
router.get(
  "/applications",
  auth,
  authorizeRoles(["employer"]),
  getAllApplications
);

router.get(
  "/review-applications",
  auth,
  authorizeRoles(["employer"]),
  getallreviewedjobSeeker
);
router.get(
  "/accepted-applications",
  auth,
  authorizeRoles(["employer"]),
  getallAcceptedapplications
);
router.get(
  "/interview-applications",
  auth,
  authorizeRoles(["employer"]),
  getallinterviewjobSeeker
);
router.get(
  "/rejected-applications",
  auth,
  authorizeRoles(["employer"]),
  getallrejectedjobSeeker
);
router.get(
  "/applied-applications",
  auth,
  authorizeRoles(["employer"]),
  getallappliedjobSeeker
);
module.exports = router;
