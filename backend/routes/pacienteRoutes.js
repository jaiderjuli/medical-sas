const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
  try {
    const pacientes = await User.find({ role: { $in: ['Paciente', 'Admin'] } });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

module.exports = router;