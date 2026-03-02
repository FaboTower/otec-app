const { Grade, Enrollment, Course, Student } = require("../models");

const GradeRepository = {
  create: async ({ enrollmentId, score, feedback }) =>
    Grade.create({
      EnrollmentId: enrollmentId,
      score,
      feedback: feedback ?? null,
    }),

  findById: async (id) =>
    Grade.findByPk(id, {
      include: [
        {
          model: Enrollment,
          include: [{ model: Student }, { model: Course }],
        },
      ],
    }),

  findByEnrollmentId: async (enrollmentId) =>
    Grade.findAll({
      where: { EnrollmentId: enrollmentId },
      order: [["id", "ASC"]],
    }),

  findByStudentId: async (studentId) =>
    Grade.findAll({
      include: [
        {
          model: Enrollment,
          where: { StudentId: studentId },
          include: [{ model: Course }],
        },
      ],
      order: [["id", "DESC"]],
    }),

  findByCourseId: async (courseId) =>
    Grade.findAll({
      include: [
        {
          model: Enrollment,
          where: { CourseId: courseId },
          include: [{ model: Student }],
        },
      ],
      order: [["id", "DESC"]],
    }),
};

module.exports = GradeRepository;