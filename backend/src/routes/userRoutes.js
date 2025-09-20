import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getTeachers,
  getStudents,
  getPedagogues,
  login,
  getMe,
  syncTeacherSubjects,
  getUserById,
  syncStudentClasses
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/token-middleware.js";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

userRouter.post("/login", login);
userRouter.get("/me", verifyToken, getMe);

userRouter.post("/teachers/sync", syncTeacherSubjects);
userRouter.post("/students/sync", syncStudentClasses);

// Novas rotas específicas
userRouter.get("/teachers", getTeachers);
userRouter.get("/students", getStudents);
userRouter.get("/pedagogues", getPedagogues);

export default userRouter;
