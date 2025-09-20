import express from "express";
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} from "../controllers/classController.js";

const classRouter = express.Router();

classRouter.post("/", createClass);
classRouter.get("/", getClasses);
classRouter.get("/:id", getClassById);
classRouter.put("/:id", updateClass);
classRouter.delete("/:id", deleteClass);

export default classRouter;
