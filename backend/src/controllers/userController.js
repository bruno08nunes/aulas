import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    const { name, email, password, cellphone, birth_date, type, registration } =
        req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult] = await db.query(
            "INSERT INTO users (name, email, password, cellphone, birth_date) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, cellphone, birth_date]
        );

        const userId = userResult.insertId;

        if (type === "teacher") {
            await db.query("INSERT INTO teachers (user_id) VALUES (?)", [
                userId,
            ]);
        } else if (type === "student") {
            if (!registration) {
                return res
                    .status(400)
                    .json({ error: "Matrícula obrigatória para aluno." });
            }
            await db.query(
                "INSERT INTO students (user_id, registration) VALUES (?, ?)",
                [userId, registration]
            );
        } else if (type === "pedagogue") {
            await db.query("INSERT INTO pedagogues (user_id) VALUES (?)", [
                userId,
            ]);
        }

        res.status(201).json({ id: userId, name, email, type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Username e password são obrigatórios" });
    }

    const [rows] = await db.query(
        `
    SELECT 
        u.*, 
        CASE 
            WHEN t.user_id IS NOT NULL THEN 'teacher'
            WHEN s.user_id IS NOT NULL THEN 'student'
            WHEN p.user_id IS NOT NULL THEN 'pedagogue'
            ELSE NULL
        END AS role
        FROM users u
        LEFT JOIN teachers t ON u.id = t.user_id
        LEFT JOIN students s ON u.id = s.user_id
        LEFT JOIN pedagogues p ON u.id = p.user_id
        WHERE u.email = ?;
    `,
        [email]
    );

    if (rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: "Senha incorreta" });
    }

    const SECRET_KEY = env.JWT_SECRET || "seu_segredo_supersecreto";
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        message: "Login bem-sucedido!",
        data: { ...user, password: undefined },
        token
    });
};

export const getTeachers = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.cellphone, u.birth_date
      FROM users u
      INNER JOIN teachers t ON u.id = t.user_id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.cellphone, u.birth_date, s.registration
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPedagogues = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.cellphone, u.birth_date
      FROM users u
      INNER JOIN pedagogues p ON u.id = p.user_id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, email, password, cellphone, birth_date, registration } =
        req.body;

    try {
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await db.query(
            "UPDATE users SET name=?, email=?, password=COALESCE(?, password), cellphone=?, birth_date=? WHERE id=?",
            [name, email, hashedPassword, cellphone, birth_date, req.params.id]
        );

        // Atualiza matrícula se for aluno
        if (registration) {
            await db.query(
                "UPDATE students SET registration=? WHERE user_id=?",
                [registration, req.params.id]
            );
        }

        res.json({ message: "Usuário atualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
        res.json({ message: "Usuário removido" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
