import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on ajoute l’utilisateur dans req.user
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ error: "Token invalide" });
  }
};
