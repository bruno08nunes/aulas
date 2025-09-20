import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import userRouter from "./routes/userRoutes.js";
import classRouter from "./routes/classRoutes.js";
import schoolRouter from "./routes/schoolRoutes.js";
import { getUserClasses } from "./controllers/classController.js";
import { verifyToken } from "./middleware/token-middleware.js";
import subjectsRouter from "./routes/subjectsRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/", userRouter);
app.use("/classes", classRouter);
app.get("/my-classes", verifyToken, getUserClasses)
app.use("/schools", schoolRouter);
app.use("/subjects", subjectsRouter);

const PORT = env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
