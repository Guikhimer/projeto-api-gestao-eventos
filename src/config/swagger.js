const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Management API',
      version: '2.0.0',
      description:
        'API REST para gerenciamento de e-commerce (Categorias, Produtos, Clientes e Pedidos) utilizando MySQL com segurança estrita.',
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
            sucesso: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        // ── Categorias ────────────────────────────────────────
        CategoriaInput: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Eletrônicos' },
            descricao: { type: 'string', example: 'Dispositivos eletrônicos e gadgets' },
          },
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Eletrônicos' },
            descricao: { type: 'string', example: 'Dispositivos eletrônicos e gadgets' },
            criado_em: { type: 'string', format: 'date-time' },
          },
        },
        // ── Produtos ──────────────────────────────────────────
        ProdutoInput: {
          type: 'object',
          required: ['nome', 'preco', 'categoria_id'],
          properties: {
            nome: { type: 'string', example: 'Smartphone XYZ' },
            descricao: { type: 'string', example: 'Smartphone topo de linha' },
            preco: { type: 'number', example: 1999.90 },
            estoque: { type: 'integer', example: 50 },
            categoria_id: { type: 'integer', example: 1 },
          },
        },
        Produto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Smartphone XYZ' },
            descricao: { type: 'string', example: 'Smartphone topo de linha' },
            preco: { type: 'number', example: 1999.90 },
            estoque: { type: 'integer', example: 50 },
            categoria_id: { type: 'integer', example: 1 },
            criado_em: { type: 'string', format: 'date-time' },
          },
        },
        // ── Clientes ──────────────────────────────────────────
        ClienteInput: {
          type: 'object',
          required: ['nome', 'email', 'cpf'],
          properties: {
            nome: { type: 'string', example: 'Guilherme Santos' },
            email: { type: 'string', format: 'email', example: 'guilherme@email.com' },
            cpf: { type: 'string', example: '123.456.789-00' },
            telefone: { type: 'string', example: '(11) 98765-4321' },
          },
        },
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Guilherme Santos' },
            email: { type: 'string', format: 'email', example: 'guilherme@email.com' },
            cpf: { type: 'string', example: '123.456.789-00' },
            telefone: { type: 'string', example: '(11) 98765-4321' },
            criado_em: { type: 'string', format: 'date-time' },
          },
        },
        // ── Pedidos ───────────────────────────────────────────
        PedidoInputItem: {
          type: 'object',
          required: ['produto_id', 'quantidade'],
          properties: {
            produto_id: { type: 'integer', example: 1 },
            quantidade: { type: 'integer', example: 2 },
          },
        },
        PedidoInput: {
          type: 'object',
          required: ['cliente_id', 'itens'],
          properties: {
            cliente_id: { type: 'integer', example: 1 },
            itens: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PedidoInputItem',
              },
            },
          },
        },
        PedidoStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', example: 'Enviado' },
          },
        },
        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            cliente_id: { type: 'integer', example: 1 },
            total: { type: 'number', example: 1999.90 },
            status: { type: 'string', example: 'Pendente' },
            criado_em: { type: 'string', format: 'date-time' },
          },
        },
        // ── Erros ─────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            sucesso: { type: 'boolean', example: false },
            erro: { type: 'string', example: 'Mensagem de erro descritiva.' },
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