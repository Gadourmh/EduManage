// src/routes/examRoutes.js
import express from "express";
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

const router = express.Router();

router.post("/", createExam);        // Ajouter un examen
router.get("/", getExams);           // Récupérer tous les examens
router.get("/:id", getExamById);     // Récupérer un examen par ID
router.put("/:id", updateExam);      // Mettre à jour un examen
router.delete("/:id", deleteExam);   // Supprimer un examen

export default router;
