// models/Doctor.js
const mongoose = require('mongoose');

// Definir el esquema de Doctor
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Crear el modelo de Doctor
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
