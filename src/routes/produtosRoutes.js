const express = require('express');
const {
    listarProdutos,
    obterProduto,
    criarProduto,
    atualizarProduto,
    deletarProduto
} = require('../controllers/produtoController');
const { protect } = require('../middleware/authMiddleware');
const { verificarSegurancaEstrita } = require('../middleware/securityMiddleware');

const router = express.Router();

router.use(protect);
router.use(verificarSegurancaEstrita);

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciamento de produtos (Proteção Estrita)
 */

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de todos os produtos do e-commerce. Exige token JWT e ID de usuário correspondente no cabeçalho x-user-id.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário autenticado enviado de forma explícita.
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 */
router.get('/', listarProdutos);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Obtém produto por ID
 *     description: Detalhes de um produto específico. Exige token JWT e ID de usuário correspondente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário autenticado enviado de forma explícita.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado.
 */
router.get('/:id', obterProduto);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     description: Registra um novo produto. Valida se a categoria fornecida (categoria_id) existe. Exige token JWT e ID de usuário correspondente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário autenticado enviado de forma explícita.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Produto criado com sucesso
 *                 dados:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos ou categoria informada não existe.
 */
router.post('/', criarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     description: Atualiza os dados de um produto pelo ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário autenticado enviado de forma explícita.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 */
router.put('/:id', atualizarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     description: Remove o produto especificado por ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário autenticado enviado de forma explícita.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso.
 */
router.delete('/:id', deletarProduto);

module.exports = router;
