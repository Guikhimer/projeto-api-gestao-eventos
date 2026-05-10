const express = require('express');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Carrega as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

const app = express();

// Middleware para interpretar JSON (Body Parser)
app.use(express.json());

// Sanitização de dados (NoSQL Injection protection)
app.use(mongoSanitize());

// Arquivos de Rotas
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Monta as Rotas
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API de Gestão de Eventos está rodando!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
