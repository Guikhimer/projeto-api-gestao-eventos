const db = require('../config/database');

const Cliente = {
    // Listar todos os clientes
    async listarTodos() {
        const [rows] = await db.query('SELECT * FROM clientes ORDER BY nome ASC');
        return rows;
    },

    // Buscar cliente por ID
    async buscarPorId(id) {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0];
    },

    // Buscar por CPF
    async buscarPorCpf(cpf) {
        const [rows] = await db.query('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
        return rows[0];
    },

    // Buscar por E-mail
    async buscarPorEmail(email) {
        const [rows] = await db.query('SELECT * FROM clientes WHERE email = ?', [email]);
        return rows[0];
    },

    // Criar novo cliente
    async criar(nome, email, cpf, telefone) {
        const [result] = await db.query(
            'INSERT INTO clientes (nome, email, cpf, telefone) VALUES (?, ?, ?, ?)',
            [nome, email, cpf, telefone]
        );
        return result.insertId;
    },

    // Atualizar cliente existente
    async atualizar(id, nome, email, cpf, telefone) {
        await db.query(
            'UPDATE clientes SET nome = ?, email = ?, cpf = ?, telefone = ? WHERE id = ?',
            [nome, email, cpf, telefone, id]
        );
        return true;
    },

    // Deletar cliente
    async deletar(id) {
        const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Cliente;
