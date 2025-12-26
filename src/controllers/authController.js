// src/controllers/authController.js

import UserModel from "../models/userModel.js";

const login = async (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.redirect("/login");
    }

    try {
        const user = await UserModel.findByEmail(username);

        // Se o usuário não for encontrado OU a senha estiver incorreta
        if (!user || password !== user.password) {
            console.log(`Login falhou: Credenciais inválidas para ${username}`);
            return res.redirect("/login"); 
        }
        
        // LOGIN VÁLIDO
        // Criamos o objeto na sessão para que os middlewares (isAuthenticated/isAdmin) possam ler
        req.session.user = {
            id: user.idUser,
            name: user.name,
            email: user.email,
            role: user.role
        };

        console.log(`Sessão criada para: ${user.email} (Role: ${user.role})`);
        
        // Redirecionamento baseado no papel
        if (user.role === 'admin') {
            return res.redirect("/admin"); 
        } else {
            return res.redirect("/client");
        }

    } catch (error) {
        console.error("Erro durante o processo de login:", error);
        return res.redirect("/login"); 
    }
};

/**
 * Lógica para Logout 
 */
const logout = (req, res) => {
    // ✅ Agora destruímos a sessão de verdade
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao destruir sessão:", err);
            return res.redirect("/");
        }
        console.log("Usuário deslogado e sessão destruída.");
        res.clearCookie('connect.sid'); // Limpa o cookie no navegador
        res.redirect("/login");
    });
};

export default {
    login,
    logout
};