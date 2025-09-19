import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getTeachers,
  getStudents,
  getPedagogues
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

// Novas rotas específicas
userRouter.get("/teachers", getTeachers);
userRouter.get("/students", getStudents);
userRouter.get("/pedagogues", getPedagogues);

export default userRouter;
