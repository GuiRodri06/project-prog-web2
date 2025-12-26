// src/middlewares/authMiddleware.js

export const isAuthenticated = (req, res, next) => {
    // Verificamos se existe um usuário na sessão (req.session.user)
    if (req.session && req.session.user) {
        return next(); // Está logado! Pode prosseguir.
    }
    // Se não estiver logado, redireciona para o login
    res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
    // Primeiro verifica se está logado, depois se é admin
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next(); // É admin! Pode prosseguir.
    }
    // Se for um cliente tentando acessar área de admin, manda para a home ou erro
    res.status(403).send("Acesso negado: Esta área é restrita a administradores.");
};