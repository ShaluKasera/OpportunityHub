const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql/sequelize");

const Job = sequelize.define("job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },

  acceptedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  experienceRequired: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  jobType: {
    type: DataTypes.ENUM("full-time", "part-time", "contract", "internship"),
    allowNull: false,
    defaultValue: "full-time",
  },

  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  isOfferSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  offeredJobSeekerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  isAcceptedByJobSeeker: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "employer",
      key: "id",
    },
  },

  skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  hiredJobSeekerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "job_seeker",
      key: "id",
    },
  },
});

module.exports = Job;
