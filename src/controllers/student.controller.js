const path = require("path");

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

  uploadImage: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          ok: false,
          error: "ID no válido",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({
          ok: false,
          error: "No se envió ningún archivo.",
        });
      }

      await StudentService.getById(id);

      const archivo = req.files.image;
      const extPermitidas = [".png", ".jpg", ".jpeg"];
      const extension = path.extname(archivo.name).toLocaleLowerCase();

      if (!extPermitidas.includes(extension)) {
        return res.status(400).json({
          ok: false,
          error: "Extensión no permitida.",
        });
      }

      const nombreArchivo = `profile_picture_${id}_${Date.now()}${extension}`;
      const ruta = path.join(__dirname, "../../files", nombreArchivo);

      await archivo.mv(ruta);
      const updated = await StudentService.update(id, { image: nombreArchivo });

      return res.status(200).json({
        ok: true,
        mensaje: "Imagen subida correctamente",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = StudentController;
