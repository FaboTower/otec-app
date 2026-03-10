const express = require("express");
const StudentController = require("../controllers/student.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");

const router = express.Router();

// públicas
router.get("/", StudentController.getAll);
router.get("/:id", StudentController.getById);

// admin (para fines del proyecto, creamos/actualizamos/borramos como admin)
router.post("/", adminAuth, StudentController.create);
router.put("/:id", adminAuth, StudentController.update);
router.delete("/:id", adminAuth, StudentController.remove);

router.post("/:id/image", StudentController.uploadImage);

module.exports = router;