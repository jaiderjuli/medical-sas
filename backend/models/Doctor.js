// models/Doctor.js
const mongoose = require('mongoose');

// Definir el esquema de Doctor
const doctorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  especialidad: {
    type: String,
    required: true,
  },
  horario: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Crear el modelo de Doctor
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
