// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  documento: { type: String, required: true }, // <-- este será el identificador del usuario
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  especialidad: { type: String },
  motivo: { type: String },
  telefono: { type: String },
  email: { type: String },
  direccion: { type: String },
  observaciones: { type: String },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
