import prisma from "../config/prismaClient.js";
import { hashPassword, comparePassword, generateToken } from "../utils/helper.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role : "student",
      },
    });

    res.status(201).json({ message: "✅ Utilisateur créé avec succès", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect" });

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // ✅ Renvoie token + infos utilisateur (sans password)
    res.json({
      message: "✅ Connexion réussie",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // req.user est injecté par le middleware authMiddleware.js
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
