import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SECRET_KEY = env.JWT_SECRET || "seu_segredo_supersecreto";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];  // Pega o token após o "Bearer "

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;  // Salva os dados do usuário no req.user
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};
