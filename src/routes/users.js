// Importa o Express para poder criar um router.
// O router funciona como um "mini-app" com rotas específicas.
const express = require('express');

// Criamos uma instância do router.
const router = express.Router();

// ---------------------------------------------------------------------
// ROTA DE TESTE
// Esta rota é só para confirmar que está tudo a funcionar.
// GET /users
// ---------------------------------------------------------------------
router.get('/', (req, res) => {
  res.json({
    message: "Rota de utilizadores a funcionar!",
  });
});

// Exportamos o router para que o app.js o possa usar.
module.exports = router;
