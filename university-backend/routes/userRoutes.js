import express from "express";
import { getUsers, getUser, addUser, editUser, removeUser } from "../controllers/userController.js";

const router = express.Router();

// Récupérer tous les utilisateurs
router.get("/", getUsers);

// Récupérer un utilisateur par ID
router.get("/:id", getUser);

// Créer un nouvel utilisateur
router.post("/", addUser);

// Modifier un utilisateur
router.put("/:id", editUser);

// Supprimer un utilisateur
router.delete("/:id", removeUser);

export default router;
