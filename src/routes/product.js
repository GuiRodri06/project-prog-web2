// src/routes/products.js
import express from "express";
import db from "../database/database.js";
import productController from "../controllers/productController.js";
import { isAdmin } from "../middlewares/authMiddleware.js"; // Importa a proteção

const router = express.Router();

// [ADMIN] - Só o admin pode criar produtos
router.post("/", isAdmin, productController.createProduct); 

// [PÚBLICO/ADMIN] - Ver produtos
router.get("/", productController.listProducts);

router.get("/categories", (req, res) => {
    db.all("SELECT * FROM Category ORDER BY type ASC", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar categorias" });
        }
        res.json(rows); // Deve retornar a lista de categorias
    });
});

export { router };