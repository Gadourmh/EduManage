// src/controllers/gradeController.js
import prisma from "../config/prismaClient.js"
import * as GradeModel from "../models/gradeModel.js";
import { calculateAverage } from "../utils/helper.js";

// Ajouter une note pour un étudiant dans un examen précis
export const addGrade = async (req, res) => {
  try {
    const { studentId, examId, grade } = req.body;

    // Vérifier si l'examen existe
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(examId) },
      include: { course: true }
    });

    if (!exam) {
      return res.status(404).json({ message: "Examen introuvable." });
    }

    // Créer la note
    const newGrade = await prisma.grade.create({
      data: {
        studentId: parseInt(studentId),
        examId: parseInt(examId),
        grade: parseFloat(grade)
      },
      include: {
        exam: true
      }
    });

    res.status(201).json({
      message: "Note ajoutée avec succès",
      grade: newGrade
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer toutes les notes
export const getGrades = async (req, res) => {
  try {
    const grades = await GradeModel.getAllGradesModel();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getStudentGradesDetailed = async (req, res) => {
  try {
    const { studentId } = req.params;

    const grades = await GradeModel.getStudentGradesDetailedModel(studentId);

    if (!grades || grades.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant" });
    }

    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une note par ID
export const getGradeById = async (req, res) => {
  try {
    const grade = await GradeModel.getGradeByIdModel(req.params.id);
    if (!grade) return res.status(404).json({ message: "Note introuvable" });
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une note
export const updateGrade = async (req, res) => {
  try {
    const grade = await GradeModel.updateGradeModel(req.params.id, req.body);
    res.json(grade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une note
export const deleteGrade = async (req, res) => {
  try {
    await GradeModel.deleteGradeModel(req.params.id);
    res.json({ message: "Note supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les notes d’un étudiant
export const getGradesByStudent = async (req, res) => {
  try {
    const grades = await GradeModel.getGradesByStudentModel(req.params.studentId);
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getClassAverageForCourse = async (req, res) => {
  try {
    const { classId, courseId } = req.params;

    const result = await GradeModel.getClassAverageForCourseModel(classId, courseId);

    if (!result) {
      return res.status(404).json({ message: "Aucune note trouvée pour cette classe dans ce cours" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📊 Calculer la moyenne des notes d’un étudiant
export const getStudentAverage = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Récupérer toutes les notes de l’étudiant
    const grades = await prisma.grade.findMany({
      where: { studentId: parseInt(studentId) },
      select: { grade: true },
    });

    if (!grades || grades.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant." });
    }

    // Extraire juste les valeurs numériques
    const notes = grades.map(g => g.grade);

    // Utiliser le helper pour calculer la moyenne
    const average = calculateAverage(notes);

    res.json({
      studentId,
      moyenne: average.toFixed(2),
      nombreNotes: notes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Récupérer toutes les notes d’un étudiant pour un cours
export const getStudentGradesForCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const grades = await prisma.grade.findMany({
      where: {
        studentId: parseInt(studentId),
        exam: { courseId: parseInt(courseId) } // filtre sur le cours
      },
      include: {
        exam: true // ramène aussi examDate + type (controle/final/tp/oral)
      }
    });

    if (grades.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant dans ce cours." });
    }

    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
