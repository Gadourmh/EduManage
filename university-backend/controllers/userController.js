import * as UserModel from "../models/userModel.js";
import prisma from "../config/prismaClient.js";

export const getUsers = async (req, res) => {
  try {
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const users = await UserModel.getAllUsers(role);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const user = await UserModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const user = await UserModel.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    // Vérifier si user existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé ❌" });

    // Supprimer d'abord les relations
    await prisma.teachersCourses.deleteMany({ where: { teacherId: userId } });
    await prisma.studentsClasses.deleteMany({ where: { studentId: userId } });
    await prisma.grade.deleteMany({ where: { studentId: userId } });

    // Ensuite supprimer le user
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "✅ Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
