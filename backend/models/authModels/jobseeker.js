const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql/sequelize");
const User = require("./user");

const JobSeeker = sequelize.define("job_seeker", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Job seeker’s professional domain or industry",
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Preferred work location or current location",
  },
  experienceYears: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: "Years of professional experience",
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Link to uploaded resume or portfolio",
  },
  availabilityStatus: {
    type: DataTypes.ENUM("available", "not_available", "employed"),
    defaultValue: "available",
    allowNull: false,
  },
});

module.exports = JobSeeker;
