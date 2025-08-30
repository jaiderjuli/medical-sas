const Especialidad = require('../models/Especialidad');

exports.createEspecialidad = async (req, res) => {
  try {
    const especialidad = new Especialidad(req.body);
    await especialidad.save();
    res.status(201).json({ msg: 'Especialidad creada', especialidad });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear especialidad', error });
  }
};

exports.getEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.find();
    res.status(200).json(especialidades);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener especialidades', error });
  }
};

exports.updateEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!especialidad) return res.status(404).json({ msg: 'Especialidad no encontrada' });
    res.status(200).json({ msg: 'Especialidad actualizada', especialidad });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar especialidad', error });
  }
};

exports.deleteEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByIdAndDelete(req.params.id);
    if (!especialidad) return res.status(404).json({ msg: 'Especialidad no encontrada' });
    res.status(200).json({ msg: 'Especialidad eliminada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar especialidad', error });
  }
};