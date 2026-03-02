const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    status: {
      type: DataTypes.ENUM("PENDIENTE", "APROBADA", "RECHAZADA"),
      defaultValue: "PENDIENTE",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["StudentId", "CourseId"],
      },
    ],
  }
);

module.exports = Enrollment;