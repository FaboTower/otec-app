const GradeService = require("../services/grade.service");

const GradeController = {
  list: async (req, res, next) => {
    try {
      const { studentId, courseId, enrollmentId } = req.query;

      const grades = await GradeService.list({
        studentId,
        courseId,
        enrollmentId,
      });

      res.json({ ok: true, data: grades });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await GradeService.create(req.body);
      res.status(201).json({ ok: true, data: created });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = GradeController;