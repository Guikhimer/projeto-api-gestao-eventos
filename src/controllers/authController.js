const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Gerar Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreta_padrao', {
        expiresIn: '30d',
    });
};

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ sucesso: false, erro: 'Por favor, forneça nome, email e senha' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ sucesso: false, erro: 'A senha deve ter no mínimo 6 caracteres' });
        }

        // Verificar se usuário já existe no MySQL
        const userExists = await Usuario.buscarPorEmail(email);

        if (userExists) {
            return res.status(400).json({ sucesso: false, erro: 'Usuário já cadastrado com este e-mail' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedSenha = await bcrypt.hash(senha, salt);

        // Criar no MySQL
        const userId = await Usuario.criar(nome, email, hashedSenha);

        res.status(201).json({
            sucesso: true,
            token: generateToken(userId)
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Logar usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, erro: 'Por favor, informe email e senha' });
        }

        // Buscar no MySQL
        const user = await Usuario.buscarPorEmail(email);

        if (!user) {
            return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
        }

        // Comparar senha criptografada
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
        }

        res.status(200).json({
            sucesso: true,
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
