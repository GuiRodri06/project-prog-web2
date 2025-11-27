// src/controllers/productController.js

import ProductModel from "../models/productModel.js";

/**
 * [ADMIN] Adiciona um novo produto e sua quantidade inicial em stock.
 */
const addProductAndStock = async (req, res) => {
    
    const { name, description, price, categoryId, initialStock } = req.body;

    if (!name || !price || initialStock === undefined || categoryId === undefined) {
        return res.status(400).json({ message: "Nome, preço, categoria e stock inicial são obrigatórios." });
    }

    try {
        // 🛑 Usa o novo método transacional no Model
        const productId = await ProductModel.createProductAndStock({
            name,
            description,
            price: parseFloat(price),
            categoryId: parseInt(categoryId) 
        }, parseInt(initialStock)); // Passa o stock separadamente

        res.status(201).json({ 
            message: "Produto e stock adicionados com sucesso.", 
            id: productId 
        });
    } catch (error) {
        console.error("Erro ao adicionar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao processar a adição do produto." });
    }
};

/**
 * [CLIENTE/PÚBLICO] Retorna a lista de todos os produtos disponíveis, incluindo stock.
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAllWithStock();
        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
        res.status(500).json({ message: "Erro interno ao buscar lista de produtos." });
    }
};



// ... Outras funções (updateProduct, deleteProduct, getProductById)

export default {
    addProductAndStock,
    getAllProducts
};