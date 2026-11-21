// src/routes/gradeRoutes.js
import express from "express";
import {
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
  getStudentGradesDetailed,
  getClassAverageForCourse,
  getStudentAverage,
   addGrade, 
   getStudentGradesForCourse
} from "../controllers/gradeController.js";

const router = express.Router();

router.post("/add", addGrade); // Ajouter une note
router.get("/", getGrades);               // Récupérer toutes les notes
router.get("/:id", getGradeById);         // Récupérer une note par ID
router.put("/:id", updateGrade);          // Modifier une note
router.delete("/:id", deleteGrade);       // Supprimer une note
router.get("/student/:studentId", getGradesByStudent); // Notes d'un étudiant
router.get("/student/:studentId/details", getStudentGradesDetailed);
router.get("/class/:classId/course/:courseId/average", getClassAverageForCourse);//calculler la moyenne de classe
router.get("/student/:id/average", getStudentAverage) //calculer la moyenne d'un etudiant
router.get("/student/:studentId/course/:courseId", getStudentGradesForCourse); // Voir notes étudiant dans un cours



export default router;
