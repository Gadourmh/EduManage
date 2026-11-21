// src/controllers/examController.js
import * as ExamModel from "../models/examModel.js";

// Ajouter un examen
export const createExam = async (req, res) => {
  try {
    const { courseId, examDate, type } = req.body;

    const exam = await ExamModel.createExamModel({
      courseId: parseInt(courseId),
      examDate: new Date(examDate),
      type,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les examens
export const getExams = async (req, res) => {
  try {
    const exams = await ExamModel.getAllExamsModel();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un examen par ID
export const getExamById = async (req, res) => {
  try {
    const exam = await ExamModel.getExamByIdModel(req.params.id);
    if (!exam) return res.status(404).json({ message: "Examen introuvable" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un examen
export const updateExam = async (req, res) => {
  try {
    const exam = await ExamModel.updateExamModel(req.params.id, req.body);
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un examen
export const deleteExam = async (req, res) => {
  try {
    await ExamModel.deleteExamModel(req.params.id);
    res.json({ message: "Examen supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
