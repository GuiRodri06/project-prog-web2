// No seu arquivo de rotas (ou num novo api.js)
import CategoryModel from "../models/categoryModel.js"; // Se já criou
import db from "../database/database.js"; // Ou use o db direto se preferir agora

// Rota para o <select> do formulário
router.get("/api/categories", isAdmin, (req, res) => {
    db.all("SELECT * FROM Category ORDER BY type ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para processar o formulário (POST)
router.post("/api/products", isAdmin, async (req, res) => {
    const { name, price, idCategory, quantity } = req.body;
    
    // Aqui você chamará o seu ProductModel.create que já configuramos antes!
    // Ele deve inserir no Product E no Stock
    try {
        // Exemplo simplificado do que deve acontecer:
        // await ProductModel.createWithStock({ name, price, idCategory, quantity });
        res.redirect("/admin"); // Volta para a tabela após salvar
    } catch (error) {
        res.status(500).send("Erro ao salvar produto");
    }
});