const express = require("express");
const CourseController = require("../controllers/course.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");

const router = express.Router();

// públicas
router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getById);

// admin
router.post("/", adminAuth, CourseController.create);
router.put("/:id", adminAuth, CourseController.update);
router.delete("/:id", adminAuth, CourseController.remove);

module.exports = router;


//http:localhost:3000/api/courses/