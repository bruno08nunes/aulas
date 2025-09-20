import { db } from "../config/db.js";

export const createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

        const [result] = await db.query(
            "INSERT INTO subjects (name) VALUES (?)",
            [name]
        );

        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM subjects");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM subjects WHERE id = ?", [
            id,
        ]);

        if (rows.length === 0)
            return res.status(404).json({ error: "Disciplina não encontrada" });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

        const [result] = await db.query(
            "UPDATE subjects SET name = ? WHERE id = ?",
            [name, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Disciplina não encontrada" });

        res.json({ message: "Disciplina atualizada com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query("DELETE FROM subjects WHERE id = ?", [
            id,
        ]);

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Disciplina não encontrada" });

        res.json({ message: "Disciplina deletada com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
