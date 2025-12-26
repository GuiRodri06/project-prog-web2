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

// Rota para a Vitrine (Pública - sem o middleware isAdmin)
router.get("/store/all", (req, res) => {
    const query = `
        SELECT p.*, s.quantity, c.type as categoryName 
        FROM Product p 
        JOIN Stock s ON p.idProduct = s.idProduct 
        JOIN Category c ON p.idCategory = c.idCategory
        WHERE s.quantity > 0`; // Só mostra o que tem stock

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Usamos PATCH pois estamos a alterar apenas uma parte do recurso (o stock)
router.patch("/buy/:id", async (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    const query = `UPDATE Stock SET quantity = quantity - ? WHERE idProduct = ? AND quantity >= ?`;
    
    db.run(query, [quantidade, id, quantidade], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(400).json({ error: "Stock insuficiente!" });
        res.json({ message: "Stock atualizado!" });
    });
});

// Rota para buscar um único produto (incluindo stock para o formulário)
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT p.*, s.quantity, c.type as categoryName 
        FROM Product p 
        JOIN Stock s ON p.idProduct = s.idProduct 
        JOIN Category c ON p.idCategory = c.idCategory
        WHERE p.idProduct = ?`;

    db.get(query, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Produto não encontrado" });
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