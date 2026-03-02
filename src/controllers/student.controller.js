const StudentService = require("../services/student.service");

const StudentController = {
  getAll: async (req, res, next) => {
    try {
      const students = await StudentService.getAll();
      res.json({ ok: true, data: students });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const student = await StudentService.getById(req.params.id);
      res.json({ ok: true, data: student });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await StudentService.create(req.body);
      res.status(201).json({ ok: true, data: created });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await StudentService.update(req.params.id, req.body);
      res.json({ ok: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await StudentService.remove(req.params.id);
      res.json({ ok: true, message: "Estudiante eliminado" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = StudentController;