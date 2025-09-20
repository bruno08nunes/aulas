import express from "express";
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from "../controllers/schoolController.js";

const schoolRouter = express.Router();

schoolRouter.post("/", createSchool);
schoolRouter.get("/", getSchools);
schoolRouter.get("/:id", getSchoolById);
schoolRouter.put("/:id", updateSchool);
schoolRouter.delete("/:id", deleteSchool);

export default schoolRouter;
