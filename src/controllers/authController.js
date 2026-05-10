const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função para gerar JWT
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

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ sucesso: false, erro: 'Usuário já existe' });
        }

        const user = await User.create({
            nome,
            email,
            senha
        });

        res.status(201).json({
            sucesso: true,
            token: generateToken(user._id)
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

        const user = await User.findOne({ email }).select('+senha');

        if (!user || !(await user.matchSenha(senha))) {
            return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
        }

        res.status(200).json({
            sucesso: true,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
