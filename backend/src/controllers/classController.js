import { db } from "../config/db.js";

export const createClass = async (req, res) => {
    try {
        const { name, school_id, shift, grade_level } = req.body;
        const creation_year = new Date().getFullYear();

        const [result] = await db.query(
            "INSERT INTO classes (name, school_id, shift, grade_level, creation_year) VALUES (?, ?, ?, ?, ?)",
            [name, school_id, shift, grade_level, creation_year]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            school_id,
            shift,
            grade_level,
            creation_year,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getClasses = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id, c.name, c.shift, c.grade_level, c.creation_year,
              s.id as school_id, s.name as school_name
       FROM classes c
       INNER JOIN schools s ON c.school_id = s.id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserClasses = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role === "student") {
            const [rows] = await db.query(
                `
                    SELECT c.id, c.name, c.shift, c.grade_level, c.creation_year, s.name as school_name
                    FROM student_registration sr
                    INNER JOIN classes c ON sr.class_id = c.id
                    INNER JOIN schools s ON c.school_id = s.id
                    WHERE sr.student_id = (
                    SELECT id FROM students WHERE user_id = ?
                    )
                `,
                [id]
            );

            return res.json(rows);
        }

        if (role === "teacher") {
            const [rows] = await db.query(
                `
                    SELECT c.id, c.name, c.shift, c.grade_level, c.creation_year, s.name as school_name
                    FROM teacher_class tc
                    INNER JOIN classes c ON tc.class_id = c.id
                    INNER JOIN schools s ON c.school_id = s.id
                    WHERE tc.teacher_id = (
                    SELECT id FROM teachers WHERE user_id = ?
                    )
                `,
                [id]
            );

            return res.json(rows);
        }

        return res
            .status(403)
            .json({
                error: "Apenas alunos ou professores podem listar turmas.",
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getClassById = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id, c.name, c.shift, c.grade_level, c.creation_year,
              s.id as school_id, s.name as school_name
       FROM classes c
       INNER JOIN schools s ON c.school_id = s.id
       WHERE c.id = ?`,
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: "Turma não encontrada" });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateClass = async (req, res) => {
    try {
        const { name, school_id, shift, grade_level, creation_year } = req.body;

        await db.query(
            "UPDATE classes SET name=?, shift=?, grade_level=? WHERE id=?",
            [name, shift, grade_level, req.params.id]
        );

        res.json({ message: "Turma atualizada com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteClass = async (req, res) => {
    try {
        await db.query("DELETE FROM classes WHERE id=?", [req.params.id]);
        res.json({ message: "Turma removida com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
