import app from "./src/app.js";
import dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'; // Define o host, se não estiver nas variáveis de ambiente

// Inicia o servidor
app.listen(PORT, () => {
    // CORREÇÃO AQUI: Cria e exibe o link completo
    const serverUrl = `http://${HOST}:${PORT}`;
    
    console.log(`Servidor iniciado na porta ${PORT}`);
    console.log(`Acesse o servidor em: ${serverUrl}`); 
});