const StudentRepository = require("../repositories/student.repository");
const AppError = require("../utils/AppError");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const StudentService = {
  getAll: async () => StudentRepository.findAll(),

  getById: async (id) => {
    const student = await StudentRepository.findById(id);
    if (!student) throw new AppError("Estudiante no encontrado", 404);
    return student;
  },

  create: async ({ fullName, email }) => {
    if (!fullName || fullName.trim().length < 3) {
      throw new AppError("fullName es obligatorio (mín 3 caracteres)", 400);
    }
    if (!email || !isValidEmail(email)) {
      throw new AppError("email inválido", 400);
    }

    const normalizedEmail = email.toLowerCase();
    const exists = await StudentRepository.findByEmail(normalizedEmail);
    if (exists) throw new AppError("El email ya está registrado", 409);

    return StudentRepository.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
    });
  },

  update: async (id, data) => {
    if (data.fullName && data.fullName.trim().length < 3) {
      throw new AppError("fullName debe tener mínimo 3 caracteres", 400);
    }
    if (data.email && !isValidEmail(data.email)) {
      throw new AppError("email inválido", 400);
    }

    // Si intenta cambiar el email, validar unicidad
    if (data.email) {
      const normalizedEmail = data.email.toLowerCase();
      const existing = await StudentRepository.findByEmail(normalizedEmail);

      if (existing && String(existing.id) !== String(id)) {
        throw new AppError("El email ya está registrado", 409);
      }

      data.email = normalizedEmail;
    }

    const updated = await StudentRepository.update(id, {
      ...data,
      fullName: data.fullName ? data.fullName.trim() : undefined,
    });

    if (!updated) throw new AppError("Estudiante no encontrado", 404);
    return updated;
  },

  remove: async (id) => {
    const removed = await StudentRepository.remove(id);
    if (!removed) throw new AppError("Estudiante no encontrado", 404);
    return removed;
  },
};

module.exports = StudentService;