// ./routes/user.js
import express from "express";
import userController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Rota para registrar novo usuário (POST /users/register)
router.post("/register", (req, res, next) => {
    console.log("Recebido pedido de registo:", req.body);
    next();
}, userController.register);

// 2. Rota para buscar os dados completos da BD (Nome, E-mail, NIF, Telemóvel)
// O client.html chamará: fetch('/users/profile-data')
router.get("/profile-data", isAuthenticated, userController.getProfile);

// 3. Rota para atualizar os dados (Nome, NIF, Telemóvel e Password)
// O client.html chamará: fetch('/users/update-profile', { method: 'POST', ... })
router.post("/update-profile", isAuthenticated, userController.updateProfile);


// Rota antiga de exemplo (podes manter ou remover se usares a /profile-data)
router.get("/profile", isAuthenticated, (req, res) => {
    res.json({
        message: "Dados da sessão",
        user: req.session.user 
    });
});

export { router };