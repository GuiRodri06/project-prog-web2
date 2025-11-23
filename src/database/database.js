// Importa o módulo sqlite3 no modo verbose (mostra logs úteis no terminal)
import sqlite3 from 'sqlite3';

// Importa o módulo fs para verificar se o arquivo .db existe
import fs from 'fs';

// Caminho da base de dados
const dbPath = './src/database/outcast.db';

// Verifica se o arquivo da base de dados já existe
const databaseExists = fs.existsSync(dbPath);

// Cria uma conexão com o SQLite
// Mesmo se o arquivo não existir, o SQLite cria automaticamente
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar à base de dados:", err);
    } else {
        console.log("Ligado à base de dados SQLite.");
    }
});

// Função que cria todas as tabelas (só será executada caso o arquivo não exista)
const createTables = () => {

    // Ativa a verificação de chaves estrangeiras no SQLite
    db.run("PRAGMA foreign_keys = ON;");

    // ------------------------
    // Tabela USER
    // ------------------------
    db.run(
        `CREATE TABLE IF NOT EXISTS User (
            idUser INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            number TEXT,
            nif TEXT UNIQUE,
            role TEXT NOT NULL CHECK (role IN ('admin', 'client'))
        );`,
        () => console.log("Tabela User criada.")
    );

    // ------------------------
    // Tabela CATEGORY
    // ------------------------
    db.run(
        `CREATE TABLE IF NOT EXISTS Category (
            idCategory INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL UNIQUE
        );`,
        () => console.log("Tabela Category criada.")
    );

    // ------------------------
    // Tabela PRODUCT
    // ------------------------
    db.run(
        `CREATE TABLE IF NOT EXISTS Product (
            idProduct INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            idCategory INTEGER NOT NULL,
            
            -- Chave estrangeira ligando categoria → produto
            FOREIGN KEY (idCategory)
                REFERENCES Category(idCategory)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`,
        () => console.log("Tabela Product criada.")
    );

    // ------------------------
    // Tabela STOCK
    // Relação 1:1 com Product (idProduct é UNIQUE)
    // ------------------------
    db.run(
        `CREATE TABLE IF NOT EXISTS Stock (
            idStock INTEGER PRIMARY KEY AUTOINCREMENT,
            idProduct INTEGER UNIQUE NOT NULL,
            quantity INTEGER DEFAULT 0,
            
            -- Liga produto → stock
            FOREIGN KEY (idProduct)
                REFERENCES Product(idProduct)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`,
        () => console.log("Tabela Stock criada.")
    );

    console.log("Todas as tabelas foram criadas com sucesso.");
};

// Só cria as tabelas se o arquivo .db NÃO existir
if (!databaseExists) {
    console.log("Base de dados não encontrada. Criando nova base...");
    createTables();
} else {
    console.log("Base de dados já existe. Nenhuma tabela será recriada.");
}

// Exporta a conexão da base para ser usada em outros arquivos (controllers, models…)
export default db;
