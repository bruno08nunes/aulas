export const isPedagogue = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (req.user.role !== "pedagogue") {
        return res
            .status(403)
            .json({ error: "Apenas pedagogos podem acessar esta rota" });
    }

    next();
};
