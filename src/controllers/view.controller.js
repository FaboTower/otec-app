const ViewController = {
  coursesPage: (req, res) => res.render("courses", { title: "Cursos" }),
  enrollmentsPage: (req, res) => res.render("enrollments", { title: "Mis inscripciones" }),

  adminEnrollmentsPage: (req, res) => res.render("admin-enrollments", { title: "Admin - Inscripciones" }),
  adminGradesPage: (req, res) => res.render("admin-grades", { title: "Admin - Calificaciones" }),
};

module.exports = ViewController;