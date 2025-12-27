// Exemplo dentro do seu router de administração
import ContactModel from "../models/contactModel.js";

router.get("/admin/contacts/all", async (req, res) => {
    try {
        // 1. (Opcional) Verificar se é admin
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: "Acesso negado" });
        }

        // 2. Chamar o Model (Garante que importaste o ContactModel no topo do ficheiro)
        const messages = await ContactModel.getAll();
        
        // 3. Enviar os dados
        res.json(messages);
    } catch (error) {
        console.error("Erro na rota de contactos:", error);
        res.status(500).json({ error: "Erro interno ao buscar mensagens" });
    }
});