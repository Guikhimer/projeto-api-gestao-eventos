const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const pool = require('./config/database');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const insecureSecrets = new Set(['', 'sua_chave_secreta_aqui', 'secreta_padrao']);

if (isProduction && (
  !process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME ||
  process.env.DB_SSL !== 'true' || !process.env.DB_SSL_CA ||
  !process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*' ||
  insecureSecrets.has(process.env.JWT_SECRET)
)) {
  throw new Error('Em produção, defina credenciais MySQL com TLS, CORS_ORIGIN e um JWT_SECRET forte.');
}

const app = express();
app.enable('trust proxy');

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get('Origin');
  const allowsAnyOrigin = allowedOrigins.includes('*');

  if (origin && !allowsAnyOrigin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ sucesso: false, erro: 'Origem não permitida pelo CORS.' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', allowsAnyOrigin ? '*' : origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (isProduction) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json({ limit: '100kb' }));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
}));

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/', (req, res) => res.json({
  name: 'E-Commerce Management API', documentation: '/api-docs', health: '/health',
}));
app.use((req, res) => res.status(404).json({ sucesso: false, erro: 'Rota não encontrada.' }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação: ${process.env.APP_URL || `http://localhost:${PORT}`}/api-docs`);
    });
  } catch (error) {
    console.error(`Erro na conexão com o MySQL: ${error.message}`);
    process.exit(1);
  }
};

startServer();
