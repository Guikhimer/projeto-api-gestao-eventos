const express = require('express');
const { 
    listarCategorias, 
    obterCategoria, 
    criarCategoria, 
    atualizarCategoria, 
    deletarCategoria 
} = require('../controllers/categoriaController');
const { protect } = require('../middleware/authMiddleware');
const { verificarSegurancaEstrita } = require('../middleware/securityMiddleware');

const router = express.Router();

// Aplicar middlewares de autenticação e proteção estrita em todas as rotas de categorias
router.use(protect);
router.use(verificarSegurancaEstrita);

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gerenciamento de categorias de produtos (Proteção Estrita)
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna uma lista de todas as categorias cadastradas. Exige token JWT e ID de usuário correspondente no cabeçalho x-user-id.
 *     tags: [Categorias]
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
 *         description: Lista de categorias retornada com sucesso.
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
 *                     $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: Token não enviado, inválido ou ID explícito ausente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: O ID do usuário no cabeçalho não coincide com o ID do token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listarCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtém uma categoria por ID
 *     description: Retorna os detalhes de uma categoria específica. Exige token JWT e ID de usuário correspondente.
 *     tags: [Categorias]
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
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria não encontrada.
 */
router.get('/:id', obterCategoria);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     description: Registra uma nova categoria no sistema. Exige token JWT e ID de usuário correspondente no cabeçalho.
 *     tags: [Categorias]
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
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
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
 *                   example: Categoria criada com sucesso
 *                 dados:
 *                   $ref: '#/components/schemas/Categoria'
 */
router.post('/', criarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     description: Atualiza os dados de uma categoria pelo ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Categorias]
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
 *         description: ID da categoria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 */
router.put('/:id', atualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     description: Remove uma categoria pelo ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Categorias]
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
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso.
 */
router.delete('/:id', deletarCategoria);

module.exports = router;
