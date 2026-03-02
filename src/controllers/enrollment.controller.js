const EnrollmentService = require("../services/enrollment.service");

const EnrollmentController = {
  list: async (req, res, next) => {
    try {
      const { studentId, courseId } = req.query;
      const enrollments = await EnrollmentService.list({ studentId, courseId });
      res.json({ ok: true, data: enrollments });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await EnrollmentService.create(req.body);
      res.status(201).json({ ok: true, data: created });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const updated = await EnrollmentService.updateStatus(
        req.params.id,
        req.body
      );
      res.json({ ok: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = EnrollmentController;