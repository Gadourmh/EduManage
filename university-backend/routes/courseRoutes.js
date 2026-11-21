// src/routes/courseRoutes.js
import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", createCourse);        // Ajouter un cours
router.get("/", getAllCourses);        // Lister tous les cours
router.get("/:id", getCourseById);     // Obtenir un cours par ID
router.put("/:id", updateCourse);      // Modifier un cours
router.delete("/:id", deleteCourse);  // Supprimer un cours

export default router;
