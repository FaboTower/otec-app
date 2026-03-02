const Student = require("./Student");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const Grade = require("./Grade");

// Relaciones
Student.hasMany(Enrollment);
Enrollment.belongsTo(Student);

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);

Enrollment.hasMany(Grade);
Grade.belongsTo(Enrollment);

module.exports = {
  Student,
  Course,
  Enrollment,
  Grade,
};