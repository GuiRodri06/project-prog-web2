// src/models/productModel.js
import db from "../database/database.js";

class ProductModel {
    static createWithStock(name, price, idCategory, quantity) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. Inserir o Produto
                const productQuery = `INSERT INTO Product (name, price, idCategory) VALUES (?, ?, ?)`;

                db.run(productQuery, [name, price, idCategory], function (err) {
                    if (err) return reject(err);

                    const lastId = this.lastID; // O ID do produto que acabou de ser criado

                    // 2. Inserir o Stock inicial para esse produto
                    const stockQuery = `INSERT INTO Stock (idProduct, quantity) VALUES (?, ?)`;

                    db.run(stockQuery, [lastId, quantity], (err) => {
                        if (err) return reject(err);
                        resolve(lastId);
                    });
                });
            });
        });
    }

    static getAllWithCategory() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.idProduct, p.name, p.price, c.type as category, s.quantity
                FROM Product p
                JOIN Category c ON p.idCategory = c.idCategory
                JOIN Stock s ON p.idProduct = s.idProduct
            `;
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. Primeiro apagamos o registo de Stock
                db.run(`DELETE FROM Stock WHERE idProduct = ?`, [id], (err) => {
                    if (err) return reject(err);

                    // 2. Depois apagamos o Produto
                    db.run(`DELETE FROM Product WHERE idProduct = ?`, [id], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    }

    static update(id, name, price, idCategory, quantity) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // Atualiza dados básicos do produto
                const queryProd = `UPDATE Product SET name = ?, price = ?, idCategory = ? WHERE idProduct = ?`;
                db.run(queryProd, [name, price, idCategory, id], (err) => {
                    if (err) return reject(err);

                    // Atualiza a quantidade no Stock
                    const queryStock = `UPDATE Stock SET quantity = ? WHERE idProduct = ?`;
                    db.run(queryStock, [quantity, id], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    }
}


export default ProductModel;