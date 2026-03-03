const express = require("express");
const ViewController = require("../controllers/view.controller");

const router = express.Router();

router.get("/", (req, res) => res.redirect("/courses"));

router.get("/courses", ViewController.coursesPage);
router.get("/enrollments", ViewController.enrollmentsPage);
router.get("/admin/enrollments", ViewController.adminEnrollmentsPage);
router.get("/admin/grades", ViewController.adminGradesPage);

module.exports = router;


//http:localhost:3000/courses