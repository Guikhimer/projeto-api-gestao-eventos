const db = require('../config/database');

const Produto = {
    // Listar todos os produtos com o nome da categoria associada
    async listarTodos() {
        const query = `
            SELECT p.*, c.nome AS categoria_nome 
            FROM produtos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            ORDER BY p.nome ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Buscar produto por ID
    async buscarPorId(id) {
        const query = `
            SELECT p.*, c.nome AS categoria_nome 
            FROM produtos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Criar novo produto
    async criar(nome, descricao, preco, estoque, categoria_id) {
        const [result] = await db.query(
            'INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES (?, ?, ?, ?, ?)',
            [nome, descricao, preco, estoque, categoria_id]
        );
        return result.insertId;
    },

    // Atualizar produto existente
    async atualizar(id, nome, descricao, preco, estoque, categoria_id) {
        await db.query(
            'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria_id = ? WHERE id = ?',
            [nome, descricao, preco, estoque, categoria_id, id]
        );
        return true;
    },

    // Deletar produto
    async deletar(id) {
        const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Produto;
