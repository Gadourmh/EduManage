import prisma from "../config/prismaClient.js";
import { hashPassword } from "../utils/helper.js";

// ✅ GET teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      include: {
        courses: true,
      },
    });

    res.json({ teachers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ CREATE teacher
export const createTeacher = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const teacher = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "teacher",
      },
    });

    res.json({ teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ DELETE teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
