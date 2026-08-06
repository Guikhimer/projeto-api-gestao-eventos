const db = require('../config/database');

const Categoria = {
    // Listar todas as categorias
    async listarTodos() {
        const [rows] = await db.query('SELECT * FROM categorias ORDER BY nome ASC');
        return rows;
    },

    // Buscar categoria por ID
    async buscarPorId(id) {
        const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
        return rows[0];
    },

    // Criar nova categoria
    async criar(nome, descricao) {
        const [result] = await db.query(
            'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
            [nome, descricao]
        );
        return result.insertId;
    },

    // Atualizar categoria existente
    async atualizar(id, nome, descricao) {
        await db.query(
            'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
            [nome, descricao, id]
        );
        return true;
    },

    // Deletar categoria
    async deletar(id) {
        const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Categoria;
