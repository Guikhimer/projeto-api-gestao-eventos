const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ sucesso: false, erro: 'Não autorizado, token não enviado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreta_padrao');

        // Buscar usuário no MySQL
        const user = await Usuario.buscarPorId(decoded.id);

        if (!user) {
            return res.status(401).json({ sucesso: false, erro: 'Não autorizado, usuário inexistente' });
        }

        req.user = user; // Injeta o usuário autenticado na requisição

        next();
    } catch (error) {
        return res.status(401).json({ sucesso: false, erro: 'Não autorizado, token inválido' });
    }
};
