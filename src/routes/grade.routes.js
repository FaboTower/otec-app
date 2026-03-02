const express = require("express");
const GradeController = require("../controllers/grade.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");

const router = express.Router();

// Consultas (para demo, lo dejo público; puedes exigir admin si quieres)
router.get("/", GradeController.list);

// Crear nota (admin)
router.post("/", adminAuth, GradeController.create);

module.exports = router;