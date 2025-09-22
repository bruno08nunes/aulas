import express from "express";
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} from "../controllers/classController.js";
import { isPedagogue } from "../middleware/is-pedagogue-middleware.js";
import { verifyToken } from "../middleware/token-middleware.js";

const classRouter = express.Router();

classRouter.post("/", verifyToken, isPedagogue, createClass);
classRouter.get("/", getClasses);
classRouter.get("/:id", getClassById);
classRouter.put("/:id", verifyToken, isPedagogue, updateClass);
classRouter.delete("/:id", verifyToken, isPedagogue, deleteClass);

export default classRouter;
