import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Insertion des données initiales...");

  // ----- Création de départements -----
  const informatique = await prisma.department.create({
    data: { name: "Informatique" }
  });

  const mathematiques = await prisma.department.create({
    data: { name: "Mathématiques" }
  });

  // ----- Création de classes -----
  const class1 = await prisma.class.create({
    data: {
      name: "L3 Informatique",
      departmentId: informatique.id
    }
  });

  const class2 = await prisma.class.create({
    data: {
      name: "M1 Mathématiques",
      departmentId: mathematiques.id
    }
  });

  // ----- Création de cours -----
  const course1 = await prisma.course.create({
    data: {
      name: "Programmation Web",
      credit: 5,
      departmentId: informatique.id
    }
  });

  const course2 = await prisma.course.create({
    data: {
      name: "Analyse Avancée",
      credit: 4,
      departmentId: mathematiques.id
    }
  });

  // ----- Création d’utilisateurs -----
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Principal",
      email: "admin@univ.tn",
      password: hashedPassword,
      role: "admin"
    }
  });

  const teacher = await prisma.user.create({
    data: {
      fullName: "Professeur Dupont",
      email: "teacher@univ.tn",
      password: hashedPassword,
      role: "teacher"
    }
  });

  const student = await prisma.user.create({
    data: {
      fullName: "Étudiant Ali",
      email: "student@univ.tn",
      password: hashedPassword,
      role: "student"
    }
  });

  // ----- Associer le prof au cours -----
  await prisma.teachersCourses.create({
    data: {
      teacherId: teacher.id,
      courseId: course1.id
    }
  });

  // ----- Associer l’étudiant à une classe -----
  await prisma.studentsClasses.create({
    data: {
      studentId: student.id,
      classId: class1.id
    }
  });

  console.log("✅ Données initiales insérées avec succès !");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
