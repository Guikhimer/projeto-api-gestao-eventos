const db = require('../config/database');

const Usuario = {
    // Buscar usuário por e-mail (para login e verificação de duplicidade)
    async buscarPorEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    // Buscar usuário por ID (para verificação de token / middleware)
    async buscarPorId(id) {
        const [rows] = await db.query('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },

    // Criar um novo usuário (registro)
    async criar(nome, email, senha) {
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        return result.insertId;
    }
};

module.exports = Usuario;
