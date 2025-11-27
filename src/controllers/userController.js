// src/controllers/userController.js

import UserModel from "../models/userModel.js";

/**
 * Busca e retorna todos os usuários.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error.message);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

/**
 * Busca um único usuário pelo ID.
 */
const getUserById = async (req, res) => {
    const { id } = req.params; // Assumindo que a rota é /users/:id

    try {
        const user = await UserModel.getById(id);
        
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error(`Erro ao buscar usuário ID ${id}:`, error.message);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

/**
 * Cria um novo usuário.
 */
const createUser = async (req, res) => {
    // 1. Extrai os dados do formulário (usando req.body do POST /register)
    const { name, email, password, number, nif } = req.body; 

    if (!name || !email || !password) {
        return res.status(400).send("Dados obrigatórios faltando."); // Em produção, redirecionar com erro
    }

    try {
        // 2. Verifica se o usuário já existe
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            console.log(`Tentativa de cadastro falhou: Email já existe: ${email}`);
            return res.status(409).send("Email já cadastrado."); // 409 Conflict
        }

        // 3. Cria o objeto do novo usuário
        const newUser = {
            name,
            password, 
            email,
            number: number || null,
            nif: nif || null,
            role: 'client' // 🛑 Define o papel padrão como cliente
        };

        // 4. Cria o usuário no banco de dados
        const newId = await UserModel.create(newUser);
        
        console.log(`Novo cliente cadastrado com sucesso! ID: ${newId}`);
        
        // 5. Redireciona para o login (ou retorna sucesso JSON para API)
        // Como a requisição vem de um formulário, redirecionar é o ideal.
        return res.redirect("/login"); 

    } catch (error) {
        console.error("Erro durante o processo de cadastro/criação:", error);
        return res.status(500).send("Erro interno ao criar usuário.");
    }
};

/**
 * Atualiza um usuário existente.
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    try {
        await UserModel.update(id, userData);
        res.status(200).json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
        console.error(`Erro ao atualizar usuário ID ${id}:`, error.message);
        res.status(500).json({ message: "Erro interno do servidor ao atualizar usuário." });
    }
};

/**
 * Deleta um usuário existente.
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await UserModel.delete(id);
        res.status(200).json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
        console.error(`Erro ao deletar usuário ID ${id}:`, error.message);
        res.status(500).json({ message: "Erro interno do servidor ao deletar usuário." });
    }
};


export default {
    getAllUsers,
    getUserById,
    createUser,
    register: createUser,
    updateUser,
    deleteUser
};