const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/authMiddleware");
const { authorizeRoles } = require("../../middlewares/roleMiddleware");

const {
  adminSignin,
  adminSignup,
  getAllEmployer,
  getAllSeeker,
  approveEmployerById,
  deleteEmployerById,
  deleteSeekerById,
} = require("../../controllers/adminControllers/admin");


router.post('/signup',adminSignup);
router.post('/login',adminSignin);
router.get('/seeker-list',auth,authorizeRoles(["admin"]),getAllSeeker);
router.get('/employer-list',auth,authorizeRoles(["admin"]),getAllEmployer);
router.put('/approve-employer/:id',auth,authorizeRoles(["admin"]),approveEmployerById);
router.delete('/delete-employer/:id',auth,authorizeRoles(["admin"]),deleteEmployerById);
router.delete('/delete-seeker/:id',auth,authorizeRoles(["admin"]),deleteSeekerById);

module.exports=router