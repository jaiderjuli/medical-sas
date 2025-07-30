const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40
  },
  apellidos: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },
  genero: {
    type: String,
    enum: ['Masculino', 'Femenino', 'Otro'],
    required: true
  },
  telefono: {
    type: String,
    required: true,
    match: /^\d{7,15}$/
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  direccion: {
    type: String,
    required: true,
    minlength: 5
  },
  ciudad: {
    type: String,
    required: true,
    minlength: 2
  },
  departamento: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Paciente', 'Medico', 'Admin'],
    default: 'Paciente',
  },
  isActive: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
