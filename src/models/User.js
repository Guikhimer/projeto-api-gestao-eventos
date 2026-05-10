const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, adicione um nome']
    },
    email: {
        type: String,
        required: [true, 'Por favor, adicione um email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, adicione um email válido'
        ]
    },
    senha: {
        type: String,
        required: [true, 'Por favor, adicione uma senha'],
        minlength: 6,
        select: false // Não retorna a senha por padrão
    }
}, { timestamps: true });

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para verificar se a senha informada corresponde ao hash
userSchema.methods.matchSenha = async function(senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('User', userSchema);
