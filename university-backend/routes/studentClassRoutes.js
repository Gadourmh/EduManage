// routes/studentClassRoutes.js
import express from "express";
import { assignStudentToClass,
         removeStudentFromClass, 
         getStudentsByClass,
       } from "../controllers/studentClassController.js";

const router = express.Router();

router.post("/assign", assignStudentToClass);
router.delete("/remove", removeStudentFromClass); // Retirer étudiant
router.get("/:classId/students", getStudentsByClass); // Liste des étudiants d’une classe

export default router;
