const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  tipo: { type: String, enum: ['info', 'alerta', 'error', 'recordatorio'], default: 'info' },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  estado: { type: String, enum: ['leída', 'no leída'], default: 'no leída' }
});

module.exports = mongoose.model('Notification', notificationSchema);