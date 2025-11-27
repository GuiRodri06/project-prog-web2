// src/routes/products.js

import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

// 1. [ADMIN] Rota para Adicionar um Novo Produto e Stock
// Exemplo: POST /products
router.post("/", productController.addProductAndStock);

// 2. [PÚBLICO] Rota para Listar todos os produtos (Loja)
// Exemplo: GET /products
router.get("/", productController.getAllProducts);

// ... Outras rotas (PUT /products/:id, DELETE /products/:id)

export { router };