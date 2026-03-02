const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Grade = sequelize.define("Grade", {
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  feedback: DataTypes.TEXT,
});

module.exports = Grade;