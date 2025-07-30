// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();

// Importa los controladores relacionados con citas (creación, obtención, etc.)
// Asegúrate de tener un archivo controller de citas creado (appointmentController.js)
const { createAppointment, getAppointments } = require('../controllers/appointmentController');

// Rutas relacionadas con citas
router.post('/create', createAppointment);  // Crear cita
router.get('/', getAppointments);           // Obtener todas las citas

module.exports = router;
