import ProductModel from "../models/productModel.js";

const createProduct = async (req, res) => {
    try {
        const { name, price, idCategory, quantity } = req.body;
        await ProductModel.createWithStock(name, price, idCategory, quantity);
        
        // Após salvar, volta para a lista de produtos no painel admin
        res.redirect("/admin"); 
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).send("Erro interno ao salvar o produto.");
    }
};

const listProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAllWithCategory();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createProduct, listProducts };