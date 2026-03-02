const CourseRepository = require("../repositories/course.repository");
const AppError = require("../utils/AppError");

const CourseService = {
  getAll: async () => CourseRepository.findAll(),

  getById: async (id) => {
    const course = await CourseRepository.findById(id);
    if (!course) throw new AppError("Curso no encontrado", 404);
    return course;
  },

  create: async ({ title, description, capacity }) => {
    if (!title || title.trim().length < 3) {
      throw new AppError("El título es obligatorio (mín 3 caracteres)", 400);
    }
    if (capacity !== undefined && Number(capacity) <= 0) {
      throw new AppError("La capacidad debe ser mayor a 0", 400);
    }

    return CourseRepository.create({
      title: title.trim(),
      description: description || null,
      capacity: capacity ?? 20,
    });
  },

  update: async (id, data) => {
    if (data.title && data.title.trim().length < 3) {
      throw new AppError("El título debe tener mínimo 3 caracteres", 400);
    }
    if (data.capacity !== undefined && Number(data.capacity) <= 0) {
      throw new AppError("La capacidad debe ser mayor a 0", 400);
    }

    const updated = await CourseRepository.update(id, {
      ...data,
      title: data.title ? data.title.trim() : undefined,
    });

    if (!updated) throw new AppError("Curso no encontrado", 404);
    return updated;
  },

  remove: async (id) => {
    const removed = await CourseRepository.remove(id);
    if (!removed) throw new AppError("Curso no encontrado", 404);
    return removed;
  },
};

module.exports = CourseService;