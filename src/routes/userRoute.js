// ./routes/userRoute.js

import express from "express";

const router = express.Router();

// Exemplo de rota de usuário
router.get("/", (req, res) => {
    res.send("Rotas de Usuários ativas!");
});

// Exportação Nomeada
export { router };