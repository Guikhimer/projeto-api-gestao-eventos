const db = require('../config/database');

const Pedido = {
    // Listar todos os pedidos
    async listarTodos() {
        const query = `
            SELECT p.*, c.nome AS cliente_nome, c.email AS cliente_email 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.cliente_id = c.id 
            ORDER BY p.data DESC, p.criado_em DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Buscar pedido por ID, incluindo os itens associados
    async buscarPorId(id) {
        const queryPedido = `
            SELECT p.*, c.nome AS cliente_nome, c.email AS cliente_email 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.cliente_id = c.id 
            WHERE p.id = ?
        `;
        const [pedidos] = await db.query(queryPedido, [id]);
        
        if (pedidos.length === 0) {
            return null;
        }

        const pedido = pedidos[0];

        const queryItens = `
            SELECT ip.id, ip.pedido_id, ip.produto_id, ip.quantidade, ip.preco_unitario, ip.valor, prod.nome AS produto_nome 
            FROM itens_pedido ip
            JOIN produtos prod ON ip.produto_id = prod.id 
            WHERE ip.pedido_id = ?
        `;
        const [itens] = await db.query(queryItens, [id]);
        
        pedido.itens = itens;
        return pedido;
    },

    // Criar um novo pedido usando TRANSAÇÃO
    async criarPedido(cliente_id, data, itens) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Verificar se o cliente existe
            const [clientes] = await connection.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
            if (clientes.length === 0) {
                throw new Error(`Cliente com ID ${cliente_id} não encontrado`);
            }

            if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number.isNaN(Date.parse(`${data}T00:00:00`))) {
                throw new Error('A data do pedido deve estar no formato YYYY-MM-DD');
            }

            let totalPedido = 0;
            const itensValidados = [];

            // 2. Validar produtos, preços e estoque
            for (const item of itens) {
                const { produto_id, quantidade, valor: valorItem } = item;

                if (!produto_id || !quantidade || quantidade <= 0 || valorItem === undefined) {
                    throw new Error('Cada item deve conter produto_id, quantidade maior que zero e valor');
                }

                const valorItemNumerico = Number(valorItem);
                if (!Number.isFinite(valorItemNumerico) || valorItemNumerico < 0) {
                    throw new Error('O valor de cada item deve ser um numero maior ou igual a zero');
                }
                totalPedido += valorItemNumerico;

                // Buscar produto
                const [produtos] = await connection.query(
                    'SELECT nome, preco, estoque FROM produtos WHERE id = ?',
                    [produto_id]
                );

                if (produtos.length === 0) {
                    throw new Error(`Produto com ID ${produto_id} não encontrado`);
                }

                const produto = produtos[0];

                // Verificar estoque
                if (produto.estoque < quantidade) {
                    throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.estoque}, Solicitado: ${quantidade}`);
                }

                const precoUnitario = parseFloat(produto.preco);
                itensValidados.push({
                    produto_id,
                    quantidade,
                    preco_unitario: precoUnitario,
                    valor: valorItemNumerico,
                    data,
                    novo_estoque: produto.estoque - quantidade
                });
            }

            // 3. Inserir o cabeçalho do pedido
            const [pedidoResult] = await connection.query(
                'INSERT INTO pedidos (cliente_id, total, data, status) VALUES (?, ?, ?, ?)',
                [cliente_id, totalPedido, data, 'Pendente']
            );
            const pedidoId = pedidoResult.insertId;

            // 4. Inserir itens do pedido e atualizar estoques
            for (const item of itensValidados) {
                // Inserir item
                await connection.query(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, valor, data) VALUES (?, ?, ?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.valor, item.data]
                );

                // Atualizar estoque do produto
                await connection.query(
                    'UPDATE produtos SET estoque = ? WHERE id = ?',
                    [item.novo_estoque, item.produto_id]
                );
            }

            await connection.commit();
            return pedidoId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Atualizar status do pedido
    async atualizarStatus(id, status) {
        const [result] = await db.query(
            'UPDATE pedidos SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    },

    // Deletar pedido (o banco fará DELETE CASCADE em itens_pedido)
    async deletarPedido(id) {
        const [result] = await db.query('DELETE FROM pedidos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Pedido;
