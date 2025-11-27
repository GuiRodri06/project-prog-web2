// src/models/productModel.js

import db from "../database/database.js";

class ProductModel {

    /**
     * Cria um novo produto na tabela Product.
     * @param {Object} product - Dados do produto.
     * @returns {Promise<number>} O ID do produto recém-criado.
     */
    static create(product) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO Product (name, description, price, categoryId)
                VALUES (?, ?, ?, ?);
            `;
            const params = [product.name, product.description, product.price, product.categoryId];

            db.run(query, params, function (err) {
                if (err) return reject(err);
                resolve(this.lastID); 
            });
        });
    }

    /**
     * Adiciona ou atualiza a quantidade de um produto na tabela Stock.
     * @param {number} productId - ID do produto.
     * @param {number} quantity - Quantidade a ser adicionada/ajustada.
     * @returns {Promise<void>}
     */
    static updateStock(productId, quantity) {
        return new Promise((resolve, reject) => {
            // Verifica se o produto já está em stock
            const selectQuery = 'SELECT idStock FROM Stock WHERE productId = ?';
            
            db.get(selectQuery, [productId], (err, row) => {
                if (err) return reject(err);

                if (row) {
                    // Produto já existe, apenas atualiza a quantidade
                    const updateQuery = 'UPDATE Stock SET quantity = quantity + ? WHERE productId = ?';
                    db.run(updateQuery, [quantity, productId], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                } else {
                    // Produto não existe, insere novo registro de stock
                    const insertQuery = 'INSERT INTO Stock (productId, quantity) VALUES (?, ?)';
                    db.run(insertQuery, [productId, quantity], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Busca todos os produtos com a quantidade em stock.
     * @returns {Promise<Array>} Lista de produtos.
     */
    static getAllWithStock() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    p.idProduct, p.name, p.description, p.price, s.quantity
                FROM Product p
                LEFT JOIN Stock s ON p.idProduct = s.productId
            `;
            db.all(query, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    /**
     * 🆕 NOVO: Cria um Produto e seu Stock inicial em uma única transação.
     * @param {Object} product - Dados do produto (name, price, categoryId, etc.).
     * @param {number} initialStock - Quantidade inicial de stock.
     * @returns {Promise<number>} O ID do produto recém-criado.
     */
    static createProductAndStock(product, initialStock) {
        return new Promise((resolve, reject) => {
            
            // 1. Inicia a transação
            db.run("BEGIN TRANSACTION;", (err) => {
                if (err) return reject(err);

                // 2. Insere o Produto
                const productQuery = `
                    INSERT INTO Product (name, description, price, categoryId)
                    VALUES (?, ?, ?, ?);
                `;
                const productParams = [
                    product.name, 
                    product.description, 
                    product.price, 
                    product.categoryId
                ];

                db.run(productQuery, productParams, function (err) {
                    if (err) {
                        db.run("ROLLBACK;"); // Falha na inserção, desfaz tudo
                        return reject(err);
                    }
                    
                    const newProductId = this.lastID;

                    // 3. Insere o Stock (com a FK idProduct única)
                    const stockQuery = `
                        INSERT INTO Stock (idProduct, quantity)
                        VALUES (?, ?);
                    `;
                    const stockParams = [newProductId, initialStock];

                    db.run(stockQuery, stockParams, (err) => {
                        if (err) {
                            db.run("ROLLBACK;"); // Falha na inserção, desfaz tudo
                            return reject(err);
                        }

                        // 4. Sucesso: Confirma a transação
                        db.run("COMMIT;", (err) => {
                            if (err) return reject(err);
                            resolve(newProductId);
                        });
                    });
                });
            });
        });
    }
    // ... Outros métodos CRUD (getById, update, delete)
}

export default ProductModel;