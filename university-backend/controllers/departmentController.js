import { DepartmentModel } from "../models/departmentModel.js";
import prisma from "../config/prismaClient.js";


export const DepartmentController = {
  async getAll(req, res) {
    try {
      const departments = await DepartmentModel.getAll();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async getById(req, res) {
    try {
      const department = await DepartmentModel.getById(req.params.id);
      if (!department) {
        return res.status(404).json({ error: "Département non trouvé" });
      }
      res.json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async create(req, res) {
    try {
      const newDepartment = await DepartmentModel.create(req.body);
      res.status(201).json(newDepartment);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(400).json({ error: "Impossible de créer le département" });
    }
  },

  async update(req, res) {
    try {
      const updated = await DepartmentModel.update(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(400).json({ error: "Impossible de mettre à jour le département" });
    }
  },

  async delete(req, res) {
    try {
      await DepartmentModel.delete(req.params.id);
      res.json({ message: "Département supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(400).json({ error: "Impossible de supprimer le département" });
    }
  }
};
// Associer un enseignant à un département
export const addTeacherToDepartment = async (req, res) => {
  try {
    const { teacherId, departmentId } = req.body;

    // Vérifier si l'utilisateur existe et est un teacher
    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    if (teacher.role !== "teacher") {
      return res.status(400).json({ error: "Seuls les enseignants peuvent être associés à un département" });
    }

    // Vérifier si le département existe
    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      return res.status(404).json({ error: "Département non trouvé" });
    }

    // Associer l’enseignant au département
    const updatedTeacher = await prisma.user.update({
      where: { id: teacherId },
      data: { departmentId },
    });

    res.json({
      message: "✅ Enseignant associé au département avec succès",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Associer une classe à un département
export const addClassToDepartment = async (req, res) => {
  try {
    const { classId, departmentId } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: { departmentId },
    });

    res.json({ message: "✅ Classe ajoutée au département avec succès", class: updatedClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
