const Event = require('../models/Event');

// @desc    Listar todos os eventos
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('criador', 'nome email');
        res.status(200).json({ sucesso: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Obter um evento específico
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('criador', 'nome email');
        if (!event) {
            return res.status(404).json({ sucesso: false, erro: 'Evento não encontrado' });
        }
        res.status(200).json({ sucesso: true, data: event });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Criar um novo evento
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        // Adicionando o ID do usuário (criador) através do token JWT
        req.body.criador = req.user.id;

        const event = await Event.create(req.body);
        res.status(201).json({ sucesso: true, data: event });
    } catch (error) {
        res.status(400).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Atualizar evento
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ sucesso: false, erro: 'Evento não encontrado' });
        }

        // Verifica se o usuário logado é o criador do evento
        if (event.criador.toString() !== req.user.id) {
            return res.status(403).json({ sucesso: false, erro: 'Usuário não autorizado a atualizar este evento' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ sucesso: true, data: event });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};

// @desc    Deletar evento
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ sucesso: false, erro: 'Evento não encontrado' });
        }

        // Verifica se o usuário logado é o criador do evento
        if (event.criador.toString() !== req.user.id) {
            return res.status(403).json({ sucesso: false, erro: 'Usuário não autorizado a deletar este evento' });
        }

        await event.deleteOne();

        res.status(200).json({ sucesso: true, data: {} });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
};
