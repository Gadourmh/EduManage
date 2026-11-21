// controllers/studentClassController.js
import prisma from "../config/prismaClient.js";

const normalizeStudentsClasses = async () => {
  const allAssignments = await prisma.studentsClasses.findMany({
    select: { id: true, studentId: true },
    orderBy: { id: "asc" },
  });

  const seenStudents = new Set();
  const duplicateAssignmentIds = [];

  for (const assignment of allAssignments) {
    if (seenStudents.has(assignment.studentId)) {
      duplicateAssignmentIds.push(assignment.id);
      continue;
    }
    seenStudents.add(assignment.studentId);
  }

  if (duplicateAssignmentIds.length > 0) {
    await prisma.studentsClasses.deleteMany({
      where: { id: { in: duplicateAssignmentIds } },
    });
  }
};

export const assignStudentToClass = async (req, res) => {
  try {
    // Nettoie les doublons legacy: un étudiant doit avoir une seule classe.
    await normalizeStudentsClasses();

    const { studentId, classId } = req.body;
    const parsedStudentId = Number.parseInt(studentId);
    const parsedClassId = Number.parseInt(classId);

    if (Number.isNaN(parsedStudentId) || Number.isNaN(parsedClassId)) {
      return res.status(400).json({ error: "studentId et classId doivent être des nombres valides" });
    }

    // Vérifier que l'étudiant existe et qu'il a bien le rôle "student"
    const student = await prisma.user.findUnique({
      where: { id: parsedStudentId },
    });
    if (student?.role !== "student") {
      return res.status(400).json({ error: "Étudiant non valide" });
    }

    // Vérifier que la classe existe
    const classFound = await prisma.class.findUnique({
      where: { id: parsedClassId },
    });
    if (!classFound) {
      return res.status(400).json({ error: "Classe introuvable" });
    }

    // Règle métier: un étudiant ne peut être inscrit que dans UNE seule classe.
    const existingEnrollment = await prisma.studentsClasses.findFirst({
      where: { studentId: parsedStudentId },
      include: { class: { select: { id: true, name: true } } },
    });

    if (existingEnrollment) {
      if (existingEnrollment.classId === parsedClassId) {
        return res.status(409).json({ error: "Cet étudiant est déjà assigné à cette classe." });
      }

      return res.status(409).json({
        error: `Cet étudiant est déjà assigné à la classe ${existingEnrollment.class?.name ?? existingEnrollment.classId}.`,
      });
    }

    // Associer étudiant à la classe
    const result = await prisma.studentsClasses.create({
      data: {
        studentId: parsedStudentId,
        classId: parsedClassId,
      },
    });

    res.status(201).json({
      message: "Étudiant associé à la classe avec succès",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🚀 Retirer un étudiant d'une classe
export const removeStudentFromClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    // Vérifier si l'association existe
    const association = await prisma.studentsClasses.findFirst({
      where: {
        studentId: Number.parseInt(studentId),
        classId: Number.parseInt(classId),
      },
    });

    if (!association) {
      return res.status(404).json({ error: "Étudiant non inscrit dans cette classe" });
    }

    // Supprimer l’association
    await prisma.studentsClasses.delete({
      where: { id: association.id },
    });

    res.json({ message: "Étudiant retiré de la classe avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getStudentsByClass = async (req, res) => {
  try {
    // Garantit une seule affectation par étudiant, même avec anciennes données.
    await normalizeStudentsClasses();

    const { classId } = req.params;

    const students = await prisma.studentsClasses.findMany({
      where: { classId: Number.parseInt(classId) },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            department: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (students.length === 0) {
      return res.json([]);
    }

    res.json(
      students.map((sc) => ({
        ...sc.student,
        className: sc.class?.name ?? null,
        departmentName: sc.class?.department?.name ?? null,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
