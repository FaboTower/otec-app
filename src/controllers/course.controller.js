const CourseService = require("../services/course.service");

const CourseController = {
  getAll: async (req, res, next) => {
    try {
      const courses = await CourseService.getAll();
      res.json({ ok: true, data: courses });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const course = await CourseService.getById(req.params.id);
      res.json({ ok: true, data: course });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await CourseService.create(req.body);
      res.status(201).json({ ok: true, data: created });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await CourseService.update(req.params.id, req.body);
      res.json({ ok: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await CourseService.remove(req.params.id);
      res.json({ ok: true, message: "Curso eliminado" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = CourseController;