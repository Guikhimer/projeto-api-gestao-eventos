const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'loja',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão inicial
pool.getConnection()
    .then(connection => {
        console.log('MySQL conectado com sucesso ao banco:', process.env.DB_NAME || 'loja');
        connection.release();
    })
    .catch(error => {
        console.error('Erro de conexão no Pool do MySQL:', error.message);
    });

module.exports = pool;
