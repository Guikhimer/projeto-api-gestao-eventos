const Pedido = require('../models/pedidoModel');

// @desc    Listar todos os pedidos
// @route   GET /api/pedidos
// @access  Private (Segurança Estrita)
exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.listarTodos();
        res.status(200).json({ sucesso: true, dados: pedidos });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Obter pedido por ID
// @route   GET /api/pedidos/:id
// @access  Private (Segurança Estrita)
exports.obterPedido = async (req, res) => {
    try {
        const pedido = await Pedido.buscarPorId(req.params.id);
        
        if (!pedido) {
            return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado' });
        }

        res.status(200).json({ sucesso: true, dados: pedido });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Criar novo pedido (com controle de transação e estoque)
// @route   POST /api/pedidos
// @access  Private (Segurança Estrita)
exports.criarPedido = async (req, res) => {
    try {
        const { cliente_id, itens } = req.body;

        if (!cliente_id || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Parâmetros inválidos: cliente_id e itens (array não vazio) são obrigatórios' 
            });
        }

        const novoPedidoId = await Pedido.criarPedido(cliente_id, itens);

        // Buscar dados completos do pedido recém criado
        const pedidoCompleto = await Pedido.buscarPorId(novoPedidoId);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido criado e faturado com sucesso',
            dados: pedidoCompleto
        });
    } catch (error) {
        // Erros de estoque, validação de produto ou cliente retornarão erro amigável 400
        res.status(400).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Atualizar status do pedido
// @route   PUT /api/pedidos/:id/status
// @access  Private (Segurança Estrita)
exports.atualizarStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;

        if (!status) {
            return res.status(400).json({ sucesso: false, erro: 'O status do pedido é obrigatório' });
        }

        const pedidoExistente = await Pedido.buscarPorId(id);
        if (!pedidoExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado' });
        }

        const atualizado = await Pedido.atualizarStatus(id, status);
        
        if (!atualizado) {
            return res.status(400).json({ sucesso: false, erro: 'Não foi possível atualizar o status do pedido' });
        }

        res.status(200).json({ 
            sucesso: true, 
            mensagem: `Status do pedido atualizado para "${status}" com sucesso` 
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Deletar pedido
// @route   DELETE /api/pedidos/:id
// @access  Private (Segurança Estrita)
exports.deletarPedido = async (req, res) => {
    try {
        const id = req.params.id;

        const pedidoExistente = await Pedido.buscarPorId(id);
        if (!pedidoExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado' });
        }

        const deletado = await Pedido.deletarPedido(id);
        
        if (!deletado) {
            return res.status(400).json({ sucesso: false, erro: 'Não foi possível deletar o pedido' });
        }

        res.status(200).json({ sucesso: true, mensagem: 'Pedido deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
