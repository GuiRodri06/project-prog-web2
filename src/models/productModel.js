// src/models/productModel.js
import db from "../database/database.js";

class ProductModel {
    static createWithStock(name, price, idCategory, quantity) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. Inserir o Produto
                const productQuery = `INSERT INTO Product (name, price, idCategory) VALUES (?, ?, ?)`;
                
                db.run(productQuery, [name, price, idCategory], function(err) {
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
}

export default ProductModel;