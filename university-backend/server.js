import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import teacherCourseRoutes from "./routes/teacherCourseRoutes.js";
import examRoutes from "./routes/examRoutes.js"
import gradeRoutes from "./routes/gradeRoutes.js";
import studentClassRoutes from "./routes/studentClassRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";






dotenv.config()
const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers-courses", teacherCourseRoutes);
app.use("/api/exames", examRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/student-classes" , studentClassRoutes)
app.use("/api/auth", authRoutes); // ✅ toutes les routes auth commencent par /api/auth
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);


app.get("/", (req, res) => {
  res.send("🚀 API University Backend is running...");
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});