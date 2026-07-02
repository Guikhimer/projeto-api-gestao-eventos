exports.verificarSegurancaEstrita = (req, res, next) => {
    // 1. Verificar se o usuário foi autenticado pelo authMiddleware (chave/token válido)
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Acesso negado: Chave/token de usuário inválida ou ausente.'
        });
    }

    // 2. Extrair o ID do usuário explicitamente informado na requisição
    // Aceita no cabeçalho 'x-user-id' ou nos parâmetros da requisição (body ou query)
    const userIdExplicito = req.headers['x-user-id'] || req.body.userId || req.body.usuarioId || req.query.userId || req.query.usuarioId;

    if (!userIdExplicito) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Acesso negado: O ID do usuário correspondente deve ser informado explicitamente (no cabeçalho x-user-id ou como parâmetro).'
        });
    }

    // 3. Validar se o ID informado coincide com o ID do usuário autenticado no token
    if (String(req.user.id) !== String(userIdExplicito)) {
        return res.status(403).json({
            sucesso: false,
            erro: 'Acesso proibido: O ID do usuário informado não corresponde ao usuário autenticado pelo token.'
        });
    }

    next();
};
