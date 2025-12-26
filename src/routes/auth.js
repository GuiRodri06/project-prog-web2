// src/routes/auth.js

import express from "express";
import path from "path"; 
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

const serveTemplate = (filename) => (req, res) => {
    res.sendFile(path.resolve('public', 'templates', filename));
};

// GET /login: Exibe o formulário de login
router.get("/login", serveTemplate('login.html'));

// Rota de Admin: agora com o middleware isAdmin
// O Express vai rodar 'isAdmin' primeiro. Se der OK, ele executa o 'serveTemplate'
router.get("/admin", isAdmin, serveTemplate('admin.html')); 

// Rota de Cliente: agora com o middleware isAuthenticated
router.get("/client", isAuthenticated, serveTemplate('client.html'));

// GET /logout: Lógica para sair da conta
router.get("/logout", authController.logout);

// POST /login: Processa a submissão do formulário
router.post("/login", authController.login);

// GET /register - Exibe o formulário de cadastro
router.get("/register", serveTemplate('register.html'));

// 🛑 MUDANÇA AQUI: POST /register AGORA APONTA PARA userController
router.post("/register", userController.register); // 'register' é o nome que exportamos

export { router };