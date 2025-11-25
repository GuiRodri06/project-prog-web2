// src/app.js

import express from "express";
import path from "path"; // Mantenha o path para caminhos absolutos

import db from "./database/database.js"; 

// Importa as Rotas
import { router as userRoute } from "./routes/user.js";
import { router as authRoute } from "./routes/auth.js"; 

// Cria o app do express
const app = express();

// --- NOVO: Configuração para servir arquivos estáticos ---
// A pasta 'public' (onde está login.html) será servida diretamente.
// O __dirname pode não funcionar em ES Modules. Use path.resolve() para garantir o caminho.
app.use(express.static(path.resolve('public')));
// --------------------------------------------------------

// Middleware para permitir JSON nas requisições
app.use(express.json());

// Middleware para lidar com dados de formulário (url-encoded)
app.use(express.urlencoded({ extended: true })); 

// Define grupo de rotas
app.use("/users", userRoute);
app.use("/", authRoute); // Rota base para autenticação (ex: /login)

// Rota padrão
app.get("/", (req, res) => {
    // Redireciona para o arquivo login.html dentro da pasta 'public'
    res.redirect("/templates/index.html");
});

// Exporta o app pro server.js usar
export default app;