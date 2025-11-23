import express from "express";

import db from "./database/database.js"; 

// Importação Nomeada da Rota de Usuário
import { router as userRoute } from "./routes/userRoute.js";

// Cria o app do express
const app = express();

// Middleware para permitir JSON nas requisições
app.use(express.json());

// Define grupo de rotas
app.use("/users", userRoute);

// Rota de teste só pra ver se está vivo
app.get("/", (req, res) => {
    res.send("API está rodando!");
});

// Exporta o app pro server.js usar
export default app;