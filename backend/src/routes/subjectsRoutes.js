import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController.js";

const subjectsRouter = express.Router();

subjectsRouter.post("/", createSubject);
subjectsRouter.get("/", getAllSubjects);
subjectsRouter.get("/:id", getSubjectById);
subjectsRouter.put("/:id", updateSubject);
subjectsRouter.delete("/:id", deleteSubject);

export default subjectsRouter;
