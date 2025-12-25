// src/database/database.js

import sqlite3 from 'sqlite3';
import fs from 'fs';

const dbPath = './src/database/outcast.db';
const databaseExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar à base de dados:", err);
    } else {
        console.log("Ligado à base de dados SQLite.");
    }
});

const createTables = () => {
    // db.serialize garante que as tabelas sejam criadas ANTES de tentarmos inserir o admin
    db.serialize(() => {
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
            () => console.log("Tabela User verificada/criada.")
        );

        // ------------------------
        // Tabela CATEGORY
        // ------------------------
        db.run(
            `CREATE TABLE IF NOT EXISTS Category (
                idCategory INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL UNIQUE
            );`,
            () => console.log("Tabela Category verificada/criada.")
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
                FOREIGN KEY (idCategory)
                    REFERENCES Category(idCategory)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );`,
            () => console.log("Tabela Product verificada/criada.")
        );

        // ------------------------
        // Tabela STOCK
        // ------------------------
        db.run(
            `CREATE TABLE IF NOT EXISTS Stock (
                idStock INTEGER PRIMARY KEY AUTOINCREMENT,
                idProduct INTEGER UNIQUE NOT NULL,
                quantity INTEGER DEFAULT 0,
                FOREIGN KEY (idProduct)
                    REFERENCES Product(idProduct)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );`,
            () => {
                console.log("Tabela Stock verificada/criada.");
                // Chamamos o seed aqui dentro, pois as tabelas já foram processadas
                seedAdmin();
                seedCategories();
            }
        );
    });
};

function seedAdmin() {
    const adminEmail = 'admin@outcast.com';
    const checkAdminQuery = `SELECT idUser FROM User WHERE email = ?`;

    db.get(checkAdminQuery, [adminEmail], (err, row) => {
        if (err) {
            console.error("Erro ao verificar admin:", err.message);
            return;
        }

        if (!row) {
            console.log("Criando usuário administrador...");
            const insertAdmin = `INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)`;
            const adminValues = ['Guilherme Rodrigues', adminEmail, 'admin123', 'admin'];

            db.run(insertAdmin, adminValues, function(err) {
                if (err) console.error("Erro ao criar admin inicial:", err.message);
                else console.log("Admin criado com sucesso! ID:", this.lastID);
            });
        } else {
            console.log("Admin já existe no banco de dados.");
        }
    });
}

function seedCategories() {
    const categories = ['Skates', 'Shapes', 'Rodas', 'Trucks', 'Rolamentos', 'Lixas', 'Acessórios', 'Roupas'];

    db.serialize(() => {
        categories.forEach(cat => {
            // O serialize garante que 'Skates' termine antes de 'Rodas' começar
            db.run(`INSERT OR IGNORE INTO Category (type) VALUES (?)`, [cat]);
        });
    });
    console.log("Categorias inseridas na ordem correta.");
}

// Inicialização
if (!databaseExists) {
    console.log("Base de dados não encontrada. Criando nova base...");
    createTables();
} else {
    console.log("Base de dados já existe.");
    // Mesmo que o banco exista, garantimos que o admin está lá
    seedAdmin();
}

export default db;