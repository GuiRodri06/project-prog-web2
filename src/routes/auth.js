// src/routes/auth.js

import express from "express";
import path from "path"; 
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";

const router = express.Router();

const serveTemplate = (filename) => (req, res) => {
    res.sendFile(path.resolve('public', 'templates', filename));
};

// GET /login: Exibe o formulário de login
router.get("/login", serveTemplate('login.html'));

// GET /admin: Exibe a página do Administrador
// NOTA: Esta rota deve ser protegida por um middleware em um projeto real.
router.get("/admin", serveTemplate('admin.html')); 

// GET /client: Exibe a página do Cliente
// NOTA: Esta rota também deve ser protegida.
router.get("/client", serveTemplate('client.html'));

// GET /logout: Lógica para sair da conta
router.get("/logout", authController.logout);

// POST /login: Processa a submissão do formulário
router.post("/login", authController.login);

// GET /register - Exibe o formulário de cadastro
router.get("/register", serveTemplate('register.html'));

// 🛑 MUDANÇA AQUI: POST /register AGORA APONTA PARA userController
router.post("/register", userController.register); // 'register' é o nome que exportamos

export { router };