import prisma from "../config/prismaClient.js";
import { hashPassword } from "../utils/helper.js";

// ✅ GET students
export const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "student" },
      include: {
        class: {
          include: {
            department: true,
          },
        },
      },
    });

    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ CREATE student
export const createStudent = async (req, res) => {
  try {
    const { fullName, email, password, classId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await hashPassword(password);

    const student = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "student",
        classId: classId ? Number(classId) : null,
      },
    });

    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ UPDATE student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, classId } = req.body;

    const student = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        fullName,
        email,
        classId: classId ? Number(classId) : null,
      },
    });

    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ DELETE student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
