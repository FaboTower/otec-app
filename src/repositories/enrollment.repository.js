const { Enrollment, Student, Course } = require("../models");

const EnrollmentRepository = {
  findAll: async () =>
    Enrollment.findAll({
      include: [{ model: Student }, { model: Course }],
      order: [["id", "ASC"]],
    }),

  findById: async (id) =>
    Enrollment.findByPk(id, {
      include: [{ model: Student }, { model: Course }],
    }),

  findByStudentCourse: async (studentId, courseId) =>
    Enrollment.findOne({
      where: { StudentId: studentId, CourseId: courseId },
    }),

  findByStudentId: async (studentId) =>
    Enrollment.findAll({
      where: { StudentId: studentId },
      include: [{ model: Course }],
      order: [["id", "DESC"]],
    }),

  findByCourseId: async (courseId) =>
    Enrollment.findAll({
      where: { CourseId: courseId },
      include: [{ model: Student }],
      order: [["id", "DESC"]],
    }),

  create: async ({ studentId, courseId }) =>
    Enrollment.create({
      StudentId: studentId,
      CourseId: courseId,
      status: "PENDIENTE",
    }),

  updateStatus: async (id, status) => {
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) return null;
    return enrollment.update({ status });
  },

  countApprovedByCourseId: async (courseId) =>
    Enrollment.count({
      where: { CourseId: courseId, status: "APROBADA" },
    }),
};

module.exports = EnrollmentRepository;