const Produto = require('../models/produtoModel');
const Categoria = require('../models/categoriaModel');

// @desc    Listar todos os produtos
// @route   GET /api/produtos
// @access  Private (Segurança Estrita)
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.listarTodos();
        res.status(200).json({ sucesso: true, dados: produtos });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Obter produto por ID
// @route   GET /api/produtos/:id
// @access  Private (Segurança Estrita)
exports.obterProduto = async (req, res) => {
    try {
        const produto = await Produto.buscarPorId(req.params.id);
        
        if (!produto) {
            return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
        }

        res.status(200).json({ sucesso: true, dados: produto });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Criar novo produto
// @route   POST /api/produtos
// @access  Private (Segurança Estrita)
exports.criarProduto = async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria_id } = req.body;

        if (!nome || preco === undefined) {
            return res.status(400).json({ sucesso: false, erro: 'Nome e Preço são obrigatórios' });
        }

        if (preco < 0) {
            return res.status(400).json({ sucesso: false, erro: 'O preço não pode ser negativo' });
        }

        // Validar se a categoria existe
        if (categoria_id) {
            const categoriaExistente = await Categoria.buscarPorId(categoria_id);
            if (!categoriaExistente) {
                return res.status(400).json({ sucesso: false, erro: `Categoria com ID ${categoria_id} não existe` });
            }
        }

        const novoProdutoId = await Produto.criar(
            nome,
            descricao || null,
            preco,
            estoque || 0,
            categoria_id || null
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Produto criado com sucesso',
            dados: { id: novoProdutoId, nome, descricao, preco, estoque, categoria_id }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Atualizar produto
// @route   PUT /api/produtos/:id
// @access  Private (Segurança Estrita)
exports.atualizarProduto = async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria_id } = req.body;
        const id = req.params.id;

        if (!nome || preco === undefined) {
            return res.status(400).json({ sucesso: false, erro: 'Nome e Preço são obrigatórios' });
        }

        if (preco < 0) {
            return res.status(400).json({ sucesso: false, erro: 'O preço não pode ser negativo' });
        }

        // Verificar se o produto existe
        const produtoExistente = await Produto.buscarPorId(id);
        if (!produtoExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
        }

        // Validar se a categoria existe
        if (categoria_id) {
            const categoriaExistente = await Categoria.buscarPorId(categoria_id);
            if (!categoriaExistente) {
                return res.status(400).json({ sucesso: false, erro: `Categoria com ID ${categoria_id} não existe` });
            }
        }

        await Produto.atualizar(id, nome, descricao || null, preco, estoque || 0, categoria_id || null);

        res.status(200).json({
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso',
            dados: { id, nome, descricao, preco, estoque, categoria_id }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Deletar produto
// @route   DELETE /api/produtos/:id
// @access  Private (Segurança Estrita)
exports.deletarProduto = async (req, res) => {
    try {
        const id = req.params.id;

        // Verificar se produto existe
        const produtoExistente = await Produto.buscarPorId(id);
        if (!produtoExistente) {
            return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
        }

        const deletado = await Produto.deletar(id);
        
        if (!deletado) {
            return res.status(400).json({ sucesso: false, erro: 'Não foi possível deletar o produto' });
        }

        res.status(200).json({ sucesso: true, mensagem: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
