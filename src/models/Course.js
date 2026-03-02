const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Course = sequelize.define("Course", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
});

module.exports = Course;