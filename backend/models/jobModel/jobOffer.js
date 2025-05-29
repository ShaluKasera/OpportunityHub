const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql/sequelize");

const JobOffer = sequelize.define("jobOffer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM("sent", "accepted", "rejected"),
    defaultValue: "sent",
  },
  employerId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: "employer", 
    key: "id",
  },
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

  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});


module.exports = JobOffer;
