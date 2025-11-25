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
    const newUser = req.body; // Dados do usuário vêm no corpo da requisição

    // Validação básica (idealmente, mais robusta)
    if (!newUser.email || !newUser.password || !newUser.name) {
        return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    try {
        const newId = await UserModel.create(newUser);
        res.status(201).json({ 
            message: "Usuário criado com sucesso.", 
            id: newId, 
            user: newUser 
        });
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        res.status(500).json({ message: "Erro interno do servidor ao criar usuário." });
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
 * Remove um usuário.
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
    updateUser,
    deleteUser
};