const GradeRepository = require("../repositories/grade.repository");
const EnrollmentRepository = require("../repositories/enrollment.repository");
const AppError = require("../utils/AppError");

const GradeService = {
  list: async ({ studentId, courseId, enrollmentId }) => {
    if (enrollmentId) return GradeRepository.findByEnrollmentId(enrollmentId);
    if (studentId) return GradeRepository.findByStudentId(studentId);
    if (courseId) return GradeRepository.findByCourseId(courseId);

    throw new AppError(
      "Debes enviar studentId o courseId o enrollmentId como query",
      400
    );
  },

  create: async ({ enrollmentId, score, feedback }) => {
    if (!enrollmentId) throw new AppError("enrollmentId es obligatorio", 400);

    const numericScore = Number(score);
    if (!Number.isFinite(numericScore)) {
      throw new AppError("score debe ser un número", 400);
    }

    // ✅ define tu escala acá (para Chile podrías usar 1.0 a 7.0)
    // por defecto usaré 0 a 100
    if (numericScore < 0 || numericScore > 100) {
      throw new AppError("score debe estar entre 0 y 100", 400);
    }

    // Regla: solo si la inscripción está aprobada
    const enrollment = await EnrollmentRepository.findById(enrollmentId);
    if (!enrollment) throw new AppError("Inscripción no encontrada", 404);

    if (enrollment.status !== "APROBADA") {
      throw new AppError(
        "No se puede registrar nota: la inscripción no está APROBADA",
        409
      );
    }

    return GradeRepository.create({
      enrollmentId,
      score: numericScore,
      feedback,
    });
  },
};

module.exports = GradeService;