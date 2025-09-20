import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    const { name, email, password, cellphone, birth_date, type, registration } =
        req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 🔎 Validação ANTES de criar o user
        if (type === "student" && !registration) {
            await connection.rollback();
            return res
                .status(400)
                .json({ error: "Matrícula obrigatória para aluno." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar user
        const [userResult] = await connection.query(
            "INSERT INTO users (name, email, password, cellphone, birth_date) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, cellphone, birth_date]
        );

        const userId = userResult.insertId;
        let typeId;

        if (type === "teacher") {
            const [result] = await connection.query(
                "INSERT INTO teachers (user_id) VALUES (?)",
                [userId]
            );
            typeId = result.insertId;
        } else if (type === "student") {
            const [result] = await connection.query(
                "INSERT INTO students (user_id, registration) VALUES (?, ?)",
                [userId, registration]
            );
            typeId = result.insertId;
        } else if (type === "pedagogue") {
            const [result] = await connection.query(
                "INSERT INTO pedagogues (user_id) VALUES (?)",
                [userId]
            );
            typeId = result.insertId;
        }

        await connection.commit();

        res.status(201).json({ id: userId, name, email, type, typeId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
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
        token,
    });
};

export const getUserById = async (req, res) => {
    const [rows] = await db.query(
        `
            SELECT 
                u.id,
                u.name,
                u.email,
                u.cellphone,
                u.birth_date,
                CASE 
                    WHEN t.user_id IS NOT NULL THEN 'teacher'
                    WHEN s.user_id IS NOT NULL THEN 'student'
                    WHEN p.user_id IS NOT NULL THEN 'pedagogue'
                    ELSE 'undefined'
                END AS type,
                s.registration,
                t.id AS teacher_id,
                s.id AS student_id,
                p.id AS pedagogue_id
                FROM users u
                LEFT JOIN teachers t ON u.id = t.user_id
                LEFT JOIN students s ON u.id = s.user_id
                LEFT JOIN pedagogues p ON u.id = p.user_id
                WHERE u.id = ?
  `,
        [req.params.id]
    );

    if (rows.length === 0)
        return res.status(404).json({ message: "Usuário não encontrado" });

    res.json(rows[0]);
};

export const getMe = async (req, res) => {
    try {
        const { id, role } = req.user;

        const [user] = await db.query(
            "SELECT id, name, email, cellphone, birth_date FROM users WHERE id = ?",
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).json({
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            cellphone: user[0].cellphone,
            birth_date: user[0].birth_date,
            role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
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

export const syncTeacherSubjects = async (req, res) => {
    const { teacherId, subjects } = req.body;

    if (!teacherId || !Array.isArray(subjects)) {
        return res
            .status(400)
            .json({ error: "Informe teacherId e um array de subjects" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Apaga os vínculos que não estão no array
        await connection.query(
            `DELETE FROM teacher_subject 
       WHERE teacher_id = ? 
       AND subject_id NOT IN (?)`,
            [teacherId, subjects.length > 0 ? subjects : [0]] // evita erro se o array for vazio
        );

        // 2. Adiciona vínculos novos (ignora se já existe)
        for (const subjectId of subjects) {
            await connection.query(
                `INSERT IGNORE INTO teacher_subject (teacher_id, subject_id) VALUES (?, ?)`,
                [teacherId, subjectId]
            );
        }

        await connection.commit();
        res.json({
            message: "Relações professor-matérias atualizadas com sucesso",
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

export const syncStudentClasses = async (req, res) => {
    const { studentId, classes } = req.body;

    if (!studentId || !Array.isArray(classes)) {
        return res
            .status(400)
            .json({ error: "Informe studentId e um array de classes" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Remover vínculos que não estão no array
        await connection.query(
            `DELETE FROM student_registration
       WHERE student_id = ?
       AND class_id NOT IN (?)`,
            [studentId, classes.length > 0 ? classes : [0]] // se o array for vazio, deleta todos
        );

        // 2. Inserir vínculos novos
        for (const classId of classes) {
            await connection.query(
                `INSERT IGNORE INTO student_registration (student_id, class_id)
         VALUES (?, ?)`,
                [studentId, classId]
            );
        }

        await connection.commit();
        res.json({ message: "Relações aluno-turmas atualizadas com sucesso" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

export const updateUser = async (req, res) => {
    const { name, email, password, cellphone } = req.body;

    try {
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await db.query(
            "UPDATE users SET name=?, email=?, password=COALESCE(?, password), cellphone=? WHERE id=?",
            [name, email, hashedPassword, cellphone, req.params.id]
        );

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
