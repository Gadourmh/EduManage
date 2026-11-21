import express from "express";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/teachers", getTeachers);
router.post("/teachers", createTeacher);
router.delete("/teachers/:id", deleteTeacher);

export default router;
