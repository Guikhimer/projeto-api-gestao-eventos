const Categoria = require('../models/categoriaModel');

// @desc    Listar todas as categorias
// @route   GET /api/categorias
// @access  Private (Segurança Estrita)
exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.listarTodos();
        res.status(200).json({ sucesso: true, dados: categorias });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Obter uma categoria por ID
// @route   GET /api/categorias/:id
// @access  Private (Segurança Estrita)
exports.obterCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.buscarPorId(req.params.id);
        
        if (!categoria) {
            return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
        }

        res.status(200).json({ sucesso: true, dados: categoria });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Criar uma nova categoria
// @route   POST /api/categorias
// @access  Private (Segurança Estrita)
exports.criarCategoria = async (req, res) => {
    try {
        const { nome, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({ sucesso: false, erro: 'O nome da categoria é obrigatório' });
        }

        const novaCategoriaId = await Categoria.criar(nome, descricao || null);
        
        res.status(201).json({
            sucesso: true,
            mensagem: 'Categoria criada com sucesso',
            dados: { id: novaCategoriaId, nome, descricao }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Atualizar uma categoria
// @route   PUT /api/categorias/:id
// @access  Private (Segurança Estrita)
exports.atualizarCategoria = async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        const id = req.params.id;

        if (!nome) {
            return res.status(400).json({ sucesso: false, erro: 'O nome da categoria é obrigatório' });
        }

        // Verificar se categoria existe
        const categoriaExistente = await Categoria.buscarPorId(id);
        if (!categoriaExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
        }

        await Categoria.atualizar(id, nome, descricao || null);

        res.status(200).json({
            sucesso: true,
            mensagem: 'Categoria atualizada com sucesso',
            dados: { id, nome, descricao }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Deletar uma categoria
// @route   DELETE /api/categorias/:id
// @access  Private (Segurança Estrita)
exports.deletarCategoria = async (req, res) => {
    try {
        const id = req.params.id;

        // Verificar se categoria existe
        const categoriaExistente = await Categoria.buscarPorId(id);
        if (!categoriaExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
        }

        const deletado = await Categoria.deletar(id);
        
        if (!deletado) {
            return res.status(400).json({ sucesso: false, erro: 'Não foi possível deletar a categoria' });
        }

        res.status(200).json({ sucesso: true, mensagem: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
