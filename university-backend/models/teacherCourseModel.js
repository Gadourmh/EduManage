// src/models/teacherCourseModel.js
import prisma from "../config/prismaClient.js";

// Obtenir tous les enseignants avec leurs cours
export const getAllTeachersModel = async () => {
  return await prisma.teachersCourses.findMany({
    include: {
      teacher: true,
      course: true,
    },
  });
};

// Associer un enseignant à un cours
export const assignTeacherToCourseModel = async (teacherId, courseId) => {
  return await prisma.teachersCourses.create({
    data: {
      teacherId: parseInt(teacherId),
      courseId: parseInt(courseId),
    },
  });
};

// Afficher les enseignants d’un cours
export const getTeachersByCourseModel = async (courseId) => {
  return await prisma.teachersCourses.findMany({
    where: { courseId: parseInt(courseId) },
    include: { teacher: true }, // récupère les infos de l'enseignant
  });
};

// Afficher les cours d’un enseignant (optionnel)
export const getCoursesByTeacherModel = async (teacherId) => {
  return await prisma.teachersCourses.findMany({
    where: { teacherId: parseInt(teacherId) },
    include: { course: true }, // récupère les infos du cours
  });
};
