// src/controllers/authController.js

import UserModel from "../models/userModel.js";

const login = async (req, res) => {
    
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.redirect("/login"); // Redireciona para o GET /login
    }

    try {
        const user = await UserModel.findByEmail(username);

        // Se o usuário não for encontrado OU a senha estiver incorreta
        if (!user || password !== user.password) {
            console.log(`Login falhou: Credenciais inválidas para ${username}`);
            // Volta para a página de login
            return res.redirect("/login"); 
        }
        
        // Sucesso: Login válido!
        console.log(`Login bem-sucedido para: ${user.email} (Role: ${user.role})`);
        
        // 🛑 LÓGICA DE REDIRECIONAMENTO POR PAPEL (ROLE)
        if (user.role === 'admin') {
            // Se for administrador, vai para a página de admin
            return res.redirect("/admin"); 
        } else {
            // Se for qualquer outra coisa (cliente, default), vai para a página de cliente
            return res.redirect("/client");
        }

    } catch (error) {
        console.error("Erro durante o processo de login:", error);
        return res.redirect("/login"); 
    }
};

/**
 * Lógica para Logout (simples, apenas redireciona)
 */
const logout = (req, res) => {
    // Em um projeto real, aqui você destruiria a sessão.
    console.log("Usuário deslogado.");
    res.redirect("/login"); // Volta para o formulário de login
};

export default {
    login,
    logout
};