// Carrega variáveis de ambiente do ficheiro .env
require('dotenv').config();

// Importa a app configurada (rotas, middlewares...)
// O app.js monta o Express, aqui nós só o usamos.
const app = require('./src/app');

// Função principal que inicia o servidor.
// É parecida com o "main" do Java, mas versão Node: simples e direta.
async function startServer() {
  try {
    // Porta onde o servidor vai correr.
    // Se PORT não existir no .env, usa 3000 como valor padrão.
    const PORT = process.env.PORT || 3000;

    // Aqui é o local perfeito para inicializar serviços externos.
    // Exemplo real:
    // await database.connect();   // Conecta à base de dados
    // await cache.init();         // Carrega cache
    // await messageQueue.start(); // Liga filas de mensagens
    //
    // Mantemos vazio por enquanto, mas já com espaço reservado.

    // Aqui finalmente iniciamos o servidor HTTP.
    app.listen(PORT, () => {
      console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });

  } catch (error) {
    // Caso algo dê errado na inicialização (ex.: DB caiu),
    // mostramos o erro e fechamos o processo com código de falha.
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Chamamos a função principal.
// Isto é literalmente o "programa começa aqui".
startServer();
