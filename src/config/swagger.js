const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventHub API',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de eventos com autenticação JWT e banco de dados MongoDB.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login. Exemplo: Bearer <token>',
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────
        RegisterInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome:  { type: 'string', example: 'João da Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            senha: { type: 'string', minLength: 6, example: 'senha123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        // ── Event ─────────────────────────────────────────────
        EventInput: {
          type: 'object',
          required: ['titulo', 'descricao', 'data', 'local'],
          properties: {
            titulo:    { type: 'string',  example: 'Workshop de Node.js' },
            descricao: { type: 'string',  example: 'Aprenda a construir APIs REST do zero.' },
            data:      { type: 'string',  format: 'date', example: '2025-09-15' },
            local:     { type: 'string',  example: 'Auditório Principal' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            titulo:    { type: 'string', example: 'Workshop de Node.js' },
            descricao: { type: 'string', example: 'Aprenda a construir APIs REST do zero.' },
            data:      { type: 'string', format: 'date', example: '2025-09-15' },
            local:     { type: 'string', example: 'Auditório Principal' },
            criador:   { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c01' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Mensagem de erro descritiva.' },
          },
        },
      },
    },
  },
  // Lê os comentários JSDoc de todos os arquivos de rota
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;