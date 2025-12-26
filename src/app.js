// src/app.js

import express from "express";
import session from 'express-session';
import path from "path"; 

// Importa a conexão do banco (garante que o seed rode ao iniciar)
import db from "./database/database.js"; 

// Importa as Rotas
import { router as userRoute } from "./routes/user.js";
import { router as authRoute } from "./routes/auth.js"; 
import { router as productRoutes } from "./routes/product.js"; 

const app = express();

// Configuração da Sessão 
app.use(session({
    secret: 'outcast123', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 1 dia de duração
    }
}));

// Servir arquivos estáticos (CSS, Imagens, JS do front)
app.use(express.static(path.resolve('public')));

// Middlewares para ler dados das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- DEFINIÇÃO DAS ROTAS ---

// Rotas de Usuários (ex: /users/register)
app.use("/users", userRoute);

// Rotas de Autenticação e Páginas (ex: /login, /admin, /logout)
app.use("/", authRoute); 

// Rotas de API de Produtos (ex: GET /api/products ou POST /api/products)
// O prefixo "/api/products" ajuda a organizar o que é busca de dados
app.use("/api/products", productRoutes); // << ADICIONADO

// Rota padrão (Home da Loja)
app.get("/", (req, res) => {
    res.sendFile(path.resolve('public', 'templates', 'index.html'));
});

export default app;