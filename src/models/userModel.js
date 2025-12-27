// src/models/userModel.js

// Importa a conexão com o banco de dados
import db from "../database/database.js";

// Modelo responsável por operações CRUD relacionadas aos usuários
class UserModel {
    
    // ----------------------------------------------------------------
    // MÉTODOS DE AUTENTICAÇÃO
    // ----------------------------------------------------------------

    /**
     * Busca um usuário pelo seu email.
     * @param {string} email O email do usuário
     * @returns {Promise<Object | undefined>} Objeto do usuário ou undefined se não for encontrado.
     */
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            // NOTA: Ajustei 'users' para 'User' para consistência com suas outras queries
            const sql = 'SELECT * FROM User WHERE email = ?'; 
            
            // db.get é ideal para buscar uma única linha
            db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error("Erro ao buscar usuário por email:", err.message);
                    reject(err);
                } else {
                    // Retorna o objeto do usuário (row) ou undefined
                    resolve(row); 
                }
            });
        });
    }

    // ----------------------------------------------------------------
    // MÉTODOS CRUD (Refatorados para usar Promises)
    // ----------------------------------------------------------------

    /**
     * Busca todos os usuários.
     * @returns {Promise<Array>} Lista de objetos de usuários.
     */
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM User;`;
            // db.all é ideal para buscar múltiplas linhas
            db.all(query, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    /**
     * Busca um único usuário pelo ID.
     * @param {number} id
     * @returns {Promise<Object | undefined>} Objeto do usuário ou undefined.
     */
    static getById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM User WHERE idUser = ?;`;
            db.get(query, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    /**
     * Cria um novo usuário.
     * @param {Object} user - Dados do usuário.
     * @returns {Promise<number>} O ID do usuário recém-criado.
     */
    static create(user) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO User (name, password, email, number, nif, role)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            const params = [user.name, user.password, user.email, user.number, user.nif, user.role];

            // db.run é ideal para INSERT, UPDATE, DELETE
            db.run(query, params, function (err) {
                if (err) return reject(err);
                // this.lastID contém o ID do registro inserido
                resolve(this.lastID); 
            });
        });
    }

    /**
     * Atualiza um usuário existente de forma dinâmica.
     * @param {number} id
     * @param {Object} user - Novos dados do usuário (apenas os campos a alterar).
     * @returns {Promise<void>}
     */
    static update(id, user) {
        return new Promise((resolve, reject) => {
            // 1. Pegar as chaves do objeto (ex: ["name", "number"])
            const fields = Object.keys(user);
            if (fields.length === 0) return resolve(); // Nada para atualizar

            // 2. Montar a string: "name = ?, number = ?"
            const setClause = fields.map(field => `${field} = ?`).join(", ");
            
            // 3. Montar o array de valores + o ID no final para o WHERE
            const params = [...Object.values(user), id];

            const query = `UPDATE User SET ${setClause} WHERE idUser = ?;`;

            db.run(query, params, function(err) {
                if (err) {
                    console.error("Erro SQL no update:", err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * Remove um usuário.
     * @param {number} id
     * @returns {Promise<void>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM User WHERE idUser = ?;`;
            db.run(query, [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

export default UserModel;