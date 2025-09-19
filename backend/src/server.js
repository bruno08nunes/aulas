import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/", userRouter);

const PORT = env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
