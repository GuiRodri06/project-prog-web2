// src/routes/products.js
import express from "express";
import db from "../database/database.js";
import productController from "../controllers/productController.js";
import { isAdmin } from "../middlewares/authMiddleware.js"; // Importa a proteção
import ProductModel from "../models/productModel.js";
import ContactModel from "../models/contactModel.js";

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

router.post("/contact", async (req, res) => {
    try {
        const { name, email, message, idProduct } = req.body;
        await ContactModel.create({ name, email, message, idProduct });
        res.json({ message: "Pedido de informação enviado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao enviar mensagem." });
    }
});

// Esta rota será acessível via GET /api/products/admin/contacts/all
router.get("/admin/contacts/all", async (req, res) => {
    try {
        // Verifica se é admin
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: "Acesso negado" });
        }

        const messages = await ContactModel.getAll();
        res.json(messages);
    } catch (error) {
        console.error("Erro ao buscar contactos:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// Rota para o formulário de contacto (POST /api/products/contact)
router.post("/contact", async (req, res) => {
    try {
        const { name, email, message, idProduct } = req.body;
        await ContactModel.create({ name, email, message, idProduct });
        res.status(201).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao guardar mensagem." });
    }
});

router.delete("/admin/contacts/:id", async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: "Acesso negado" });
        }
        
        const { id } = req.params;
        const sql = `DELETE FROM ContactMessage WHERE idMessage = ?`;
        
        db.run(sql, [id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Mensagem removida com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao apagar mensagem" });
    }
});

export { router };