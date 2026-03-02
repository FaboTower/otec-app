const EnrollmentRepository = require("../repositories/enrollment.repository");
const StudentRepository = require("../repositories/student.repository");
const CourseRepository = require("../repositories/course.repository");
const AppError = require("../utils/AppError");

const validStatuses = ["PENDIENTE", "APROBADA", "RECHAZADA"];

const EnrollmentService = {
  list: async ({ studentId, courseId }) => {
    if (studentId) return EnrollmentRepository.findByStudentId(studentId);
    if (courseId) return EnrollmentRepository.findByCourseId(courseId);
    return EnrollmentRepository.findAll();
  },

  create: async ({ studentId, courseId }) => {
    if (!studentId || !courseId) {
      throw new AppError("studentId y courseId son obligatorios", 400);
    }

    // Validar que existan
    await StudentRepository.getById?.(studentId); // si no tienes este método, no lo uses (ver abajo)
    const student = await StudentRepository.findById(studentId);
    if (!student) throw new AppError("Estudiante no existe", 404);

    const course = await CourseRepository.findById(courseId);
    if (!course) throw new AppError("Curso no existe", 404);

    // Evitar duplicados
    const existing = await EnrollmentRepository.findByStudentCourse(
      studentId,
      courseId
    );
    if (existing) {
      throw new AppError("Ya existe una inscripción para este curso", 409);
    }

    return EnrollmentRepository.create({ studentId, courseId });
  },

  updateStatus: async (id, { status }) => {
    if (!status || !validStatuses.includes(status)) {
      throw new AppError(
        "status inválido. Usa: PENDIENTE, APROBADA o RECHAZADA",
        400
      );
    }

    const enrollment = await EnrollmentRepository.findById(id);
    if (!enrollment) throw new AppError("Inscripción no encontrada", 404);

    // Regla: si apruebo, validar cupo
    if (status === "APROBADA") {
      const courseId = enrollment.CourseId;
      const course = await CourseRepository.findById(courseId);

      const approvedCount =
        await EnrollmentRepository.countApprovedByCourseId(courseId);

      if (approvedCount >= course.capacity) {
        throw new AppError("No se puede aprobar: curso sin cupos", 409);
      }
    }

    const updated = await EnrollmentRepository.updateStatus(id, status);
    if (!updated) throw new AppError("Inscripción no encontrada", 404);
    return updated;
  },
};

module.exports = EnrollmentService;