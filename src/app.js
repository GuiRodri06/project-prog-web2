// Importa o Express, o framework que vai controlar rotas, middlewares, etc.
const express = require('express');

// Cria uma instância da aplicação Express.
// Pensa nisto como "o objeto principal" da aplicação.
const app = express();

// ---------------------------------------------------------------------
// MIDDLEWARES GLOBAIS
// Aqui colocamos configurações que afetam todas as rotas da aplicação.
// ---------------------------------------------------------------------

// Permite tratar JSON no corpo das requisições.
// Sem isso, req.body seria undefined.
app.use(express.json());

// Aqui poderíamos colocar outro middlewares, por exemplo:
// - CORS
// - logs de requisição
// - validações globais
// - tratamento de erros
//
// Exemplo (comentado por agora):
// const cors = require('cors');
// app.use(cors());

// ---------------------------------------------------------------------
// ROTAS DA APLICAÇÃO
// Cada conjunto de rotas fica num ficheiro separado.
// Aqui apenas "montamos" as rotas no app.
// ---------------------------------------------------------------------

// Importa rotas de exemplo
const userRoutes = require('./routes/users');

// Todas as rotas que começam com /users vão para userRoutes.
// Ex.: GET /users → users.js
app.use('/users', userRoutes);

// Se quiseres, poderás ir adicionando outras rotas aqui:
// app.use('/auth', require('./routes/auth'));
// app.use('/posts', require('./routes/posts'));

// ---------------------------------------------------------------------
// EXPORTAÇÃO
// Exportamos o app já configurado.
// O server.js só precisa "usar" esta aplicação e iniciar o servidor.
// ---------------------------------------------------------------------
module.exports = app;
