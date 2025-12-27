// src/app.js
import express from "express";
import session from 'express-session';
import path from "path"; 

import db from "./database/database.js"; 

import { router as userRoute } from "./routes/user.js";
import { router as authRoute } from "./routes/auth.js"; 
import { router as productRoutes } from "./routes/product.js"; 

const app = express();

app.use(session({
    secret: 'outcast123', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use(express.static(path.resolve('public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- DEFINIÇÃO DAS ROTAS ---

app.use("/users", userRoute);
app.use("/", authRoute); 
app.use("/api/products", productRoutes);

// --- ROTAS DE PÁGINAS (USAR 'app' EM VEZ DE 'router') ---
app.get("/register", (req, res) => {
    res.sendFile(path.resolve('public', 'templates', 'register.html'));
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve('public', 'templates', 'index.html'));
});

// Caso tenhas uma página de login separada:
app.get("/login", (req, res) => {
    res.sendFile(path.resolve('public', 'login.html'));
});

export default app;