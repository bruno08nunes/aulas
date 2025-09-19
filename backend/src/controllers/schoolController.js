import { db } from "../config/db.js";

export const createSchool = async (req, res) => {
    try {
        const { name, address, phone, cnpj } = req.body;
        const [result] = await db.query(
            "INSERT INTO schools (name, address, phone, cnpj) VALUES (?, ?, ?, ?)",
            [name, address, phone, cnpj]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            address,
            phone,
            cnpj,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSchools = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM schools");
    res.json(rows);
};

export const getSchoolById = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM schools WHERE id = ?", [
        req.params.id,
    ]);
    if (rows.length === 0)
        return res.status(404).json({ message: "Escola não encontrada" });
    res.json(rows[0]);
};

export const updateSchool = async (req, res) => {
    const { name, address, phone, cnpj } = req.body;
    await db.query(
        "UPDATE schools SET name=?, address=?, phone=?, cnpj=? WHERE id=?",
        [name, address, phone, cnpj, req.params.id]
    );
    res.json({ message: "Escola atualizada" });
};

export const deleteSchool = async (req, res) => {
    await db.query("DELETE FROM schools WHERE id=?", [req.params.id]);
    res.json({ message: "Escola removida" });
};
