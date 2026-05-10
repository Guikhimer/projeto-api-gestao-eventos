const express = require('express');
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/', getEvents);
router.get('/:id', getEvent);

// Rotas protegidas (precisam de token JWT)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
