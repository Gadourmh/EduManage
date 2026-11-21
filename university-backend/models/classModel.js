// src/models/classModel.js
import prisma from "../config/prismaClient.js";

export const createClassModel = async (data) => {
  if (!data.name || !data.departmentId) {
    throw new Error("Name and departmentId are required");
  }
  return await prisma.class.create({ 
    data,
    include: { department: true }
  });
};

export const getAllClassesModel = async () => {
  try {
    return await prisma.class.findMany({ 
      include: { department: true } 
    });
  } catch (error) {
    console.error("Database error in getAllClassesModel:", error.message);
    throw error;
  }
};

export const getClassByIdModel = async (id) => {
  return await prisma.class.findUnique({
    where: { id: Number.parseInt(id) },
    include: { department: true },
  });
};

export const updateClassModel = async (id, data) => {
  return await prisma.class.update({
    where: { id: Number.parseInt(id) },
    data,
    include: { department: true }
  });
};

export const deleteClassModel = async (id) => {
  return await prisma.class.delete({
    where: { id: Number.parseInt(id) },
  });
};
