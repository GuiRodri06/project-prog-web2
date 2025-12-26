// ./routes/user.js
import express from "express";
import userController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Rota para registrar novo usuário (POST /users/register)
// Esta rota é chamada pelo formulário de cadastro
router.post("/register", userController.register);

// 2. Rota para o usuário ver o próprio perfil (GET /users/profile)
// Exemplo de como usar o middleware para proteger dados do próprio usuário
router.get("/profile", isAuthenticated, (req, res) => {
    res.json({
        message: "Dados do seu perfil",
        user: req.session.user // Pega os dados da sessão que criamos no login
    });
});

export { router };