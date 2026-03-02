const express = require("express");
const EnrollmentController = require("../controllers/enrollment.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");

const router = express.Router();

// Estudiante: crea inscripción
router.post("/", EnrollmentController.create);

// Listados (puede ser público o admin; lo dejo público para demo)
router.get("/", EnrollmentController.list);

// Admin: cambiar estado
router.patch("/:id/status", adminAuth, EnrollmentController.updateStatus);

module.exports = router;