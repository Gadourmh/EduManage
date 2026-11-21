// src/models/gradeModel.js
import prisma from "../config/prismaClient.js";


// Récupérer toutes les notes
export const getAllGradesModel = async () => {
  return await prisma.grade.findMany({
    include: { student: true, exam: true },
  });
};

// Récupérer toutes les notes d'un étudiant avec détails (examens + cours)
export const getStudentGradesDetailedModel = async (studentId) => {
  return await prisma.grade.findMany({
    where: { studentId: parseInt(studentId) },
    include: {
      exam: {
        include: {
          course: true, // on récupère aussi le cours lié à l'examen
        },
      },
    },
  });
};

// Récupérer une note par ID
export const getGradeByIdModel = async (id) => {
  return await prisma.grade.findUnique({
    where: { id: parseInt(id) },
    include: { student: true, exam: true },
  });
};

// Mettre à jour une note
export const updateGradeModel = async (id, data) => {
  return await prisma.grade.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Supprimer une note
export const deleteGradeModel = async (id) => {
  return await prisma.grade.delete({
    where: { id: parseInt(id) },
  });
};

// Récupérer toutes les notes d'un étudiant
export const getGradesByStudentModel = async (studentId) => {
  return await prisma.grade.findMany({
    where: { studentId: parseInt(studentId) },
    include: { exam: { include: { course: true } } },
  });
};


export const getClassAverageForCourseModel = async (classId, courseId) => {
  // Récupérer tous les étudiants de la classe
  const students = await prisma.studentsClasses.findMany({
    where: { classId: parseInt(classId) },
    select: { studentId: true },
  });

  const studentIds = students.map((s) => s.studentId);

  if (studentIds.length === 0) return null;

  // Récupérer toutes les notes des étudiants pour ce cours
  const grades = await prisma.grade.findMany({
    where: {
      studentId: { in: studentIds },
      exam: { courseId: parseInt(courseId) },
    },
    include: { exam: true },
  });

  if (grades.length === 0) return null;

  // Calcul de la moyenne
  const total = grades.reduce((acc, g) => acc + g.grade, 0);
  const average = total / grades.length;

  return {
    classId: parseInt(classId),
    courseId: parseInt(courseId),
    numberOfStudents: studentIds.length,
    numberOfGrades: grades.length,
    average,
  };
};
