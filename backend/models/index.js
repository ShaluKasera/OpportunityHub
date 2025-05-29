const User = require("./authModels/user");
const Employer = require("./authModels/employer");
const JobSeeker = require("./authModels/jobseeker");
const Job = require("./jobModel/job");
const JobApplication = require("./jobModel/jobApplication");
const JobOffer = require("./jobModel/jobOffer");

// ========== USER → EMPLOYER & JOBSEEKER ==========
User.hasOne(Employer, {
  foreignKey: "userId",
  as: "employer",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
Employer.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

User.hasOne(JobSeeker, {
  foreignKey: "userId",
  as: "jobSeeker",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
JobSeeker.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== EMPLOYER → JOB ==========
Employer.hasMany(Job, {
  foreignKey: "employerId",
  as: "jobs",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
Job.belongsTo(Employer, {
  foreignKey: "employerId",
  as: "employer",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== JOB → JOB APPLICATION ==========
Job.hasMany(JobApplication, {
  foreignKey: "jobId",
  as: "applications",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
JobApplication.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== JOB → JOB OFFERS ==========
Job.hasMany(JobOffer, {
  foreignKey: "jobId",
  as: "offers",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
JobOffer.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== JOBSEEKER → JOB APPLICATION ==========
JobSeeker.hasMany(JobApplication, {
  foreignKey: "jobSeekerId",
  as: "applications",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
JobApplication.belongsTo(JobSeeker, {
  foreignKey: "jobSeekerId",
  as: "jobSeeker",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== JOBSEEKER → HIRED JOB ==========
JobSeeker.hasMany(Job, {
  foreignKey: "hiredJobSeekerId",
  as: "hiredJobs",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
Job.belongsTo(JobSeeker, {
  foreignKey: "hiredJobSeekerId",
  as: "hiredSeeker",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

// ========== JOBSEEKER → JOB OFFERS ==========
JobSeeker.hasMany(JobOffer, {
  foreignKey: "jobSeekerId",
  as: "jobOffers",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
JobOffer.belongsTo(JobSeeker, {
  foreignKey: "jobSeekerId",
  as: "jobSeeker",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

module.exports = {
  User,
  Employer,
  JobSeeker,
  Job,
  JobApplication,
  JobOffer,
};
