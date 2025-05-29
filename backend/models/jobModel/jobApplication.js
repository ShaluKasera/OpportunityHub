const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql/sequelize");


const JobApplication = sequelize.define(
  "job_application",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "job",
        key: "id",
      },
    },
    jobSeekerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "job_seeker",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "applied",
        "reviewed",
        "accepted",
        "interview",
        "offered",
        "rejected"
      ),
      defaultValue: "applied",
      allowNull: false,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  
);


module.exports = JobApplication;
