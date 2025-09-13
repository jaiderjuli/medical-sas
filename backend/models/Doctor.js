// models/Doctor.js
const mongoose = require('mongoose');

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


const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
