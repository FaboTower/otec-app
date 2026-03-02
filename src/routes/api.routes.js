const express = require("express");
const courseRoutes = require("./course.routes");
const studentRoutes = require("./student.routes");
const enrollmentRoutes = require("./enrollment.routes");
const gradeRoutes = require("./grade.routes");

const router = express.Router();

router.use("/courses", courseRoutes);
router.use("/students", studentRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/grades", gradeRoutes);

module.exports = router;