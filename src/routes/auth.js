// src/routes/auth.js

import express from "express";
import path from "path"; 
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Função auxiliar para servir os ficheiros HTML
const serveTemplate = (filename) => (req, res) => {
    res.sendFile(path.resolve('public', 'templates', filename));
};

// --- ROTAS PÚBLICAS ---
router.get("/login", serveTemplate('login.html'));
router.post("/login", authController.login);

router.get("/register", serveTemplate('register.html'));
router.post("/register", userController.register);

router.get("/logout", authController.logout);

// --- ROTAS DE PÁGINAS PROTEGIDAS (ADMIN) ---
// Note que aqui mantemos apenas o GET que entrega a página HTML
router.get("/admin", isAdmin, serveTemplate('admin.html')); 
router.get("/admin/add-product", isAdmin, serveTemplate('add-product.html'));

// --- ROTAS DE PÁGINAS PROTEGIDAS (CLIENTE) ---
router.get("/client", isAuthenticated, serveTemplate('client.html'));

export { router };