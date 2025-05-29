const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql/sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM(
      "user",
      "job_seeker",
      "employer",
      "admin",
      "superadmin"
    ),
    defaultValue: "user",
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
   isApprovedForAdminRole: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
