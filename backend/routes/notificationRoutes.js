const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
  try {
    const notificaciones = await Notification.find().populate('usuario', 'nombre email');
    res.json(notificaciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Crear una nueva notificación
router.post('/', async (req, res) => {
  try {
    const nueva = new Notification(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear notificación' });
  }
});

// Marcar como leída
router.put('/:id/leida', async (req, res) => {
  try {
    const notificacion = await Notification.findByIdAndUpdate(
      req.params.id,
      { estado: 'leída' },
      { new: true }
    );
    res.json(notificacion);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar notificación' });
  }
});

// Eliminar notificación
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Notificación eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar notificación' });
  }
});

module.exports = router;