import db from "../database/database.js";

class ContactModel {
    static create(data) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ContactMessage (name, email, message, idProduct) VALUES (?, ?, ?, ?)`;
            db.run(sql, [data.name, data.email, data.message, data.idProduct], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            // O LEFT JOIN permite ver a mensagem mesmo que o produto tenha sido apagado entretanto
            const sql = `
            SELECT m.*, p.name as productName 
            FROM ContactMessage m 
            LEFT JOIN Product p ON m.idProduct = p.idProduct 
            ORDER BY m.date DESC`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}
export default ContactModel;