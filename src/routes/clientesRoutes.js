const express = require('express');
const {
    listarClientes,
    obterCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
} = require('../controllers/clienteController');
const { protect } = require('../middleware/authMiddleware');
const { verificarSegurancaEstrita } = require('../middleware/securityMiddleware');

const router = express.Router();

router.use(protect);
router.use(verificarSegurancaEstrita);

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gerenciamento de clientes da loja (Proteção Estrita)
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     description: Retorna uma lista de todos os clientes. Exige token JWT e ID de usuário correspondente no cabeçalho x-user-id.
 *     tags: [Clientes]
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
 *         description: Lista de clientes retornada com sucesso.
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
 *                     $ref: '#/components/schemas/Cliente'
 */
router.get('/', listarClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtém cliente por ID
 *     description: Retorna os detalhes de um cliente específico. Exige token JWT e ID de usuário correspondente.
 *     tags: [Clientes]
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
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado.
 */
router.get('/:id', obterCliente);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     description: Cadastra um cliente. Garante CPF e E-mail únicos. Exige token JWT e ID de usuário correspondente no cabeçalho.
 *     tags: [Clientes]
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
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso.
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
 *                   example: Cliente cadastrado com sucesso
 *                 dados:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: E-mail ou CPF já cadastrado, ou dados obrigatórios ausentes.
 */
router.post('/', criarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     description: Atualiza os dados de um cliente pelo ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Clientes]
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
 *         description: ID do cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso.
 */
router.put('/:id', atualizarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Deleta um cliente
 *     description: Remove um cliente pelo ID. Exige token JWT e ID de usuário correspondente.
 *     tags: [Clientes]
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
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso.
 */
router.delete('/:id', deletarCliente);

module.exports = router;
