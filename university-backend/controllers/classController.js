// src/controllers/classController.js
import {
  createClassModel,
  getAllClassesModel,
  getClassByIdModel,
  updateClassModel,
  deleteClassModel,
} from "../models/classModel.js";

export const createClass = async (req, res) => {
  try {
    const newClass = await createClassModel({
      name: req.body.name,
      departmentId: req.body.departmentId,
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await getAllClassesModel();
    res.json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classItem = await getClassByIdModel(req.params.id);
    if (!classItem) return res.status(404).json({ error: "Classe non trouvée" });
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updated = await updateClassModel(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await deleteClassModel(req.params.id);
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
