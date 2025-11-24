// Importa a conexão com o banco de dados
import db from "../database/database.js";

// Modelo responsável por operações CRUD relacionadas aos usuários
const UserModel = {
    // Busca todos os usuários
    getAll(callback) {
        const query = `SELECT * FROM User;`;
        db.all(query, [], callback);
    },

    // Busca um único usuário pelo ID
    getById(id, callback) {
        const query = `SELECT * FROM User WHERE idUser = ?;`;
        db.get(query, [id], callback);
    },

    // Cria um novo usuário
    create(user, callback) {
        const query = `
            INSERT INTO User (name, password, email, number, nif, role)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const params = [
            user.name,
            user.password,
            user.email,
            user.number,
            user.nif,
            user.role
        ];

        db.run(query, params, function (err) {
            callback(err, this?.lastID);
        });
    },

    // Atualiza um usuário existente
    update(id, user, callback) {
        const query = `
            UPDATE User
            SET name = ?, password = ?, email = ?, number = ?, nif = ?, role = ?
            WHERE idUser = ?;
        `;

        const params = [
            user.name,
            user.password,
            user.email,
            user.number,
            user.nif,
            user.role,
            id
        ];

        db.run(query, params, callback);
    },

    // Remove um usuário
    delete(id, callback) {
        const query = `DELETE FROM User WHERE idUser = ?;`;
        db.run(query, [id], callback);
    }
};

export default UserModel;
