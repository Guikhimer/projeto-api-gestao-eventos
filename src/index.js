const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Pool do MySQL
require('./config/database');

const app = express();

// Middleware para interpretar JSON (Body Parser)
app.use(express.json());

// Rota do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
}));

// Importa arquivos de rotas
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

// Registra as rotas
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // Rotas /status e /versao
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Rota padrão para servir o Frontend
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
});
