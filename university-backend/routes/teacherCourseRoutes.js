// src/routes/teacherCourseRoutes.js
import express from "express";
import {
  getAllTeachers,
  assignTeacherToCourse,
  getTeachersByCourse,
  getCoursesByTeacher,
  deleteTeacherCourse,
} from "../controllers/teacherCourseController.js";

const router = express.Router();

router.get("/", getAllTeachers);                    // Obtenir tous les enseignants
router.post("/", assignTeacherToCourse);              // Associer enseignant à cours
router.get("/course/:courseId", getTeachersByCourse); // Enseignants d’un cours
router.get("/teacher/:teacherId", getCoursesByTeacher); // Cours d’un enseignant
router.delete("/:id", deleteTeacherCourse);


export default router;
