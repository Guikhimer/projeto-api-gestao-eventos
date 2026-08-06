const express = require('express');
const {
    listarPedidos,
    obterPedido,
    criarPedido,
    atualizarStatus,
    deletarPedido
} = require('../controllers/pedidoController');
const { protect } = require('../middleware/authMiddleware');
const { verificarSegurancaEstrita } = require('../middleware/securityMiddleware');

const router = express.Router();

router.use(protect);
router.use(verificarSegurancaEstrita);

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gerenciamento de pedidos (Proteção Estrita)
 */

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     description: Retorna uma lista de todos os pedidos efetuados. Exige token JWT e ID de usuário correspondente no cabeçalho x-user-id.
 *     tags: [Pedidos]
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
 *         description: Lista de pedidos retornada com sucesso.
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
 *                     $ref: '#/components/schemas/Pedido'
 */
router.get('/', listarPedidos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtém detalhes de um pedido por ID
 *     description: Retorna os detalhes de um pedido específico incluindo total e data do pedido, além da lista de itens, quantidades, preços unitários e valores. Exige token JWT e ID de usuário correspondente.
 *     tags: [Pedidos]
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
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 dados:
 *                   $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado.
 */
router.get('/:id', obterPedido);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Cria um novo pedido (Faturamento imediato)
 *     description: Registra um novo pedido com data no pedido e valor em cada item, realizando a baixa do estoque. Executa dentro de uma transação SQL atômica. Exige token JWT e ID de usuário correspondente.
 *     tags: [Pedidos]
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
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido faturado e criado com sucesso.
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
 *                   example: Pedido criado e faturado com sucesso
 *                 dados:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Estoque insuficiente, cliente ou produto inexistente, ou payload inválido.
 */
router.post('/', criarPedido);

/**
 * @swagger
 * /api/pedidos/{id}/status:
 *   put:
 *     summary: Atualiza o status de um pedido
 *     description: Altera o status (Pendente, Pago, Enviado, Cancelado) do pedido correspondente. Exige token JWT e ID de usuário correspondente.
 *     tags: [Pedidos]
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
 *         description: ID do pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoStatusInput'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 */
router.put('/:id/status', atualizarStatus);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Deleta um pedido
 *     description: Remove o pedido do sistema. Exige token JWT e ID de usuário correspondente.
 *     tags: [Pedidos]
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
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso.
 */
router.delete('/:id', deletarPedido);

module.exports = router;
