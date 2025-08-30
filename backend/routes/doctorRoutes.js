// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();

// Importa las funciones del controlador de médicos
const { createDoctor, getDoctors, updateDoctor, deleteDoctor } = require('../controllers/doctorController');

// Define las rutas para los médicos
router.post('/', createDoctor);  // Ruta para crear un médico
router.get('/', getDoctors);           // Ruta para obtener todos los médicos
router.put('/:id', updateDoctor);     // Ruta para actualizar un médico
router.delete('/:id', deleteDoctor);  // Ruta para eliminar un médico

module.exports = router;

