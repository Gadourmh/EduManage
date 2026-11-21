// src/models/examModel.js
import prisma from "../config/prismaClient.js";

// Créer un examen
export const createExamModel = async (data) => {
  return await prisma.exam.create({ data });
};

// Récupérer tous les examens
export const getAllExamsModel = async () => {
  return await prisma.exam.findMany({
    include: { course: true }, // ramène aussi les infos du cours
  });
};

// Récupérer un examen par ID
export const getExamByIdModel = async (id) => {
  return await prisma.exam.findUnique({
    where: { id: parseInt(id) },
    include: { course: true, grades: true },
  });
};

// Mettre à jour un examen
export const updateExamModel = async (id, data) => {
  return await prisma.exam.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Supprimer un examen
export const deleteExamModel = async (id) => {
  return await prisma.exam.delete({
    where: { id: parseInt(id) },
  });
};
