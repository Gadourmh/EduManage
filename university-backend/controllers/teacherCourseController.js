import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  assignTeacherToCourseModel,
  getTeachersByCourseModel,
  getCoursesByTeacherModel,
  getAllTeachersModel,
} from "../models/teacherCourseModel.js";

// Obtenir tous les enseignants avec leurs cours
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachersModel();
    res.json({ teachers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Associer un enseignant à un cours
export const assignTeacherToCourse = async (req, res) => {
  try {
    const { teacherId, courseId } = req.body;
    const result = await assignTeacherToCourseModel(teacherId, courseId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir les enseignants d’un cours
export const getTeachersByCourse = async (req, res) => {
  try {
    const teachers = await getTeachersByCourseModel(req.params.courseId);
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les cours d’un enseignant (optionnel)
export const getCoursesByTeacher = async (req, res) => {
  try {
    const courses = await getCoursesByTeacherModel(req.params.teacherId);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//supprimer teacher course
export const deleteTeacherCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.teachersCourses.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "✅ Association teacher-course supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
