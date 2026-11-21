import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hash du mot de passe
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Vérifier mot de passe
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Générer JWT
export const generateToken = async (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Fonction utilitaire pour calculer la moyenne
export const calculateAverage = (notes) => {
  if (!notes || notes.length === 0) return 0;

  const total = notes.reduce((sum, n) => sum + n, 0);
  return total / notes.length;
};
