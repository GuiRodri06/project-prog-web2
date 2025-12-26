// src/routes/products.js
import express from "express";
import db from "../database/database.js";
import productController from "../controllers/productController.js";
import { isAdmin } from "../middlewares/authMiddleware.js"; // Importa a proteção
import ProductModel from "../models/productModel.js";

const router = express.Router();

// [ADMIN] - Só o admin pode criar produtos
router.post("/", isAdmin, productController.createProduct); 

// [PÚBLICO/ADMIN] - Ver produtos
router.get("/", productController.listProducts);

router.delete("/:id", isAdmin, productController.deleteProduct);

router.get("/categories", (req, res) => {
    db.all("SELECT * FROM Category ORDER BY type ASC", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar categorias" });
        }
        res.json(rows); // Deve retornar a lista de categorias
    });
});

// Rota para buscar um único produto (incluindo stock para o formulário)
router.get("/:id", isAdmin, (req, res) => {
    const query = `
        SELECT p.*, s.quantity 
        FROM Product p 
        JOIN Stock s ON p.idProduct = s.idProduct 
        WHERE p.idProduct = ?`;
        
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// Rota para SALVAR a edição
router.put("/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price, idCategory, quantity } = req.body;
    
    try {
        await ProductModel.update(id, name, price, idCategory, quantity);
        res.json({ message: "Produto e Stock atualizados!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router };