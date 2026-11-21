// src/models/courseModel.js
import prisma from "../config/prismaClient.js";

export const createCourseModel = async (data) => {
  return await prisma.course.create({ data });
};

export const getAllCoursesModel = async () => {
  return await prisma.course.findMany({
    include: { department: true, teachers: true, exams: true },
  });
};

export const getCourseByIdModel = async (id) => {
  return await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: { department: true, teachers: true, exams: true },
  });
};

export const updateCourseModel = async (id, data) => {
  return await prisma.course.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteCourseModel = async (id) => {
  return await prisma.course.delete({
    where: { id: parseInt(id) },
  });
};
