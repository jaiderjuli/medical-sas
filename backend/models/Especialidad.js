const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  medicosAsignados: {
    type: Number,
    default: 0,
  },
});

const Especialidad = mongoose.model('Especialidad', especialidadSchema);

module.exports = Especialidad;