// src/routes/auth.js

import express from "express";
import path from "path"; 
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
import db from '../database/database.js';

const router = express.Router();

// Função auxiliar para servir os ficheiros HTML
const serveTemplate = (filename) => (req, res) => {
    res.sendFile(path.resolve('public', 'templates', filename));
};

// --- ROTAS PÚBLICAS ---
router.get("/login", serveTemplate('login.html'));
router.post("/login", authController.login);

router.get("/logout", authController.logout);

// --- ROTAS DE PÁGINAS PROTEGIDAS (ADMIN) ---
// Note que aqui mantemos apenas o GET que entrega a página HTML
router.get("/admin", isAdmin, serveTemplate('admin.html')); 
router.get("/admin/add-product", isAdmin, serveTemplate('add-product.html'));

// --- ROTAS DE PÁGINAS PROTEGIDAS (CLIENTE) ---
router.get("/client", isAuthenticated, serveTemplate('client.html'));

router.get("/api/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, role: req.session.user.role });
    } else {
        res.json({ loggedIn: false });
    }
});

router.get("/api/user-data", (req, res) => {
    // 1. Verificar se há um utilizador na sessão
    if (!req.session.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.session.user.id;

    // 2. Procurar os dados reais na tabela User
    db.get("SELECT name, email, number, nif FROM User WHERE idUser = ?", [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao consultar base de dados" });
        }
        if (!row) {
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }
        
        // 3. Enviar os dados para o client.html
        res.json(row);
    });
});

// Rota para atualizar os dados do perfil
router.post("/api/update-profile", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Sessão expirada. Faça login novamente." });
    }

    const userId = req.session.user.id;
    const { name, number, nif, password } = req.body;

    // Se o utilizador enviou uma nova password, incluímos na atualização
    if (password && password.trim() !== "") {
        const query = "UPDATE User SET name = ?, number = ?, nif = ?, password = ? WHERE idUser = ?";
        db.run(query, [name, number, nif, password, userId], function(err) {
            if (err) return res.status(500).json({ error: "Erro ao atualizar perfil e senha." });
            res.json({ message: "Perfil e senha atualizados com sucesso!" });
        });
    } else {
        // Atualiza apenas os dados básicos
        const query = "UPDATE User SET name = ?, number = ?, nif = ? WHERE idUser = ?";
        db.run(query, [name, number, nif, userId], function(err) {
            if (err) return res.status(500).json({ error: "Erro ao atualizar dados do perfil." });
            res.json({ message: "Dados atualizados com sucesso!" });
        });
    }
});

export { router };