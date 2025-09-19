import express from "express";
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from "../controllers/schoolController.js";

const router = express.Router();

router.post("/", createSchool);
router.get("/", getSchools);
router.get("/:id", getSchoolById);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);

export default router;
