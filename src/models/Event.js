const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Por favor, adicione o título do evento'],
        trim: true,
        maxlength: [100, 'O título não pode ter mais de 100 caracteres']
    },
    descricao: {
        type: String,
        required: [true, 'Por favor, adicione uma descrição']
    },
    data: {
        type: Date,
        required: [true, 'Por favor, informe a data do evento']
    },
    local: {
        type: String,
        required: [true, 'Por favor, adicione o local do evento']
    },
    criador: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
