import UserModel from "../models/userModel.js";

const UserController = {
    getAll(req, res) {
        UserModel.getAll((err, users) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(users);
        });
    },

    create(req, res) {
        UserModel.create(req.body, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Usuário criado!", id });
        });
    }
};

export default UserController;
