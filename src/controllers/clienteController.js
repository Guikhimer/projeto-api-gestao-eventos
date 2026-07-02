const Cliente = require('../models/clienteModel');

// @desc    Listar todos os clientes
// @route   GET /api/clientes
// @access  Private (Segurança Estrita)
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.listarTodos();
        res.status(200).json({ sucesso: true, dados: clientes });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Obter cliente por ID
// @route   GET /api/clientes/:id
// @access  Private (Segurança Estrita)
exports.obterCliente = async (req, res) => {
    try {
        const cliente = await Cliente.buscarPorId(req.params.id);
        
        if (!cliente) {
            return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
        }

        res.status(200).json({ sucesso: true, dados: cliente });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Criar novo cliente
// @route   POST /api/clientes
// @access  Private (Segurança Estrita)
exports.criarCliente = async (req, res) => {
    try {
        const { nome, email, cpf, telefone } = req.body;

        if (!nome || !email || !cpf) {
            return res.status(400).json({ sucesso: false, erro: 'Nome, E-mail e CPF são obrigatórios' });
        }

        // Verificar se e-mail já existe
        const emailExistente = await Cliente.buscarPorEmail(email);
        if (emailExistente) {
            return res.status(400).json({ sucesso: false, erro: 'Este e-mail já está associado a outro cliente' });
        }

        // Verificar se CPF já existe
        const cpfExistente = await Cliente.buscarPorCpf(cpf);
        if (cpfExistente) {
            return res.status(400).json({ sucesso: false, erro: 'Este CPF já está associado a outro cliente' });
        }

        const novoClienteId = await Cliente.criar(nome, email, cpf, telefone || null);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Cliente cadastrado com sucesso',
            dados: { id: novoClienteId, nome, email, cpf, telefone }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Atualizar cliente
// @route   PUT /api/clientes/:id
// @access  Private (Segurança Estrita)
exports.atualizarCliente = async (req, res) => {
    try {
        const { nome, email, cpf, telefone } = req.body;
        const id = req.params.id;

        if (!nome || !email || !cpf) {
            return res.status(400).json({ sucesso: false, erro: 'Nome, E-mail e CPF são obrigatórios' });
        }

        // Verificar se o cliente existe
        const clienteExistente = await Cliente.buscarPorId(id);
        if (!clienteExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
        }

        // Verificar se e-mail já pertence a outro cliente
        const emailExistente = await Cliente.buscarPorEmail(email);
        if (emailExistente && String(emailExistente.id) !== String(id)) {
            return res.status(400).json({ sucesso: false, erro: 'Este e-mail já está associado a outro cliente' });
        }

        // Verificar se CPF já pertence a outro cliente
        const cpfExistente = await Cliente.buscarPorCpf(cpf);
        if (cpfExistente && String(cpfExistente.id) !== String(id)) {
            return res.status(400).json({ sucesso: false, erro: 'Este CPF já está associado a outro cliente' });
        }

        await Cliente.atualizar(id, nome, email, cpf, telefone || null);

        res.status(200).json({
            sucesso: true,
            mensagem: 'Cliente atualizado com sucesso',
            dados: { id, nome, email, cpf, telefone }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Deletar cliente
// @route   DELETE /api/clientes/:id
// @access  Private (Segurança Estrita)
exports.deletarCliente = async (req, res) => {
    try {
        const id = req.params.id;

        // Verificar se cliente existe
        const clienteExistente = await Cliente.buscarPorId(id);
        if (!clienteExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado' });
        }

        const deletado = await Cliente.deletar(id);
        
        if (!deletado) {
            return res.status(400).json({ sucesso: false, erro: 'Não foi possível deletar o cliente' });
        }

        res.status(200).json({ sucesso: true, mensagem: 'Cliente deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
