import express from "express";
import { DepartmentController ,
    addTeacherToDepartment,
     addClassToDepartment,
 } from "../controllers/departmentController.js";

const router = express.Router();

// GET all
router.get("/", DepartmentController.getAll);

// GET by ID
router.get("/:id", DepartmentController.getById);

// CREATE
router.post("/", DepartmentController.create);

// UPDATE
router.put("/:id", DepartmentController.update);

// DELETE
router.delete("/:id", DepartmentController.delete);
//add teacher a un departement
router.post("/add-teacher", addTeacherToDepartment);
//add class a un departement
router.post("/add-class", addClassToDepartment);

export default router;
