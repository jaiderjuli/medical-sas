// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();

// Importa las funciones del controlador de médicos
const { createDoctor, getDoctors } = require('../controllers/doctorController');

// Define las rutas para los médicos
router.post('/create', createDoctor);  // Ruta para crear un médico
router.get('/', getDoctors);           // Ruta para obtener todos los médicos

module.exports = router;

