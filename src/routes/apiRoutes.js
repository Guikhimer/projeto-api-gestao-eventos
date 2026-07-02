const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Status
 *   description: Rota pública para monitoramento e versão da API
 */

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Retorna a versão e status da API
 *     description: Endpoint público para checagem rápida de integridade da API. Não exige autenticação.
 *     tags: [API Status]
 *     responses:
 *       200:
 *         description: Status retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 versao:
 *                   type: string
 *                   example: 2.0.0
 *                 status:
 *                   type: string
 *                   example: online
 */
router.get('/status', (req, res) => {
    res.status(200).json({ versao: '2.0.0', status: 'online' });
});

/**
 * @swagger
 * /api/versao:
 *   get:
 *     summary: Retorna a versão e status da API
 *     description: Endpoint público para checagem rápida de integridade da API. Não exige autenticação.
 *     tags: [API Status]
 *     responses:
 *       200:
 *         description: Status retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 versao:
 *                   type: string
 *                   example: 2.0.0
 *                 status:
 *                   type: string
 *                   example: online
 */
router.get('/versao', (req, res) => {
    res.status(200).json({ versao: '2.0.0', status: 'online' });
});

module.exports = router;
