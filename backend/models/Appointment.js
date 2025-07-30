// models/Appointment.js
const mongoose = require('mongoose');

// Definir el esquema de la cita
const appointmentSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// Crear el modelo de cita
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
