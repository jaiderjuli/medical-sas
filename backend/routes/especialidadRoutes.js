const express = require('express');
const router = express.Router();

const { createEspecialidad, getEspecialidades, updateEspecialidad, deleteEspecialidad } = require('../controllers/especialidadController');

router.post('/', createEspecialidad);
router.get('/', getEspecialidades);
router.put('/:id', updateEspecialidad);
router.delete('/:id', deleteEspecialidad);

module.exports = router;