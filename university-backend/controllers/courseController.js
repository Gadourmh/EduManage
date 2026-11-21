// src/controllers/courseController.js
import {
  createCourseModel,
  getAllCoursesModel,
  getCourseByIdModel,
  updateCourseModel,
  deleteCourseModel,
} from "../models/courseModel.js";

export const createCourse = async (req, res) => {
  try {
    const { name, credit, departmentId } = req.body;

    const newCourse = await createCourseModel({
      name,
      credit,
      departmentId,
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await getAllCoursesModel();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await getCourseByIdModel(req.params.id);
    if (!course) return res.status(404).json({ error: "Cours non trouvé" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updated = await updateCourseModel(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await deleteCourseModel(req.params.id);
    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
