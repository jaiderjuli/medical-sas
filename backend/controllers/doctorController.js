// controllers/doctorController.js
const Doctor = require('../models/Doctor'); // Asegúrate de tener un modelo Doctor creado

// Función para crear un nuevo médico
exports.createDoctor = async (req, res) => {
  const { nombre, apellidos, especialidad, horario, email } = req.body;

  try {
    const newDoctor = new Doctor({
      nombre,
      apellidos,
      especialidad,
      horario,
      email,
    });

    await newDoctor.save();
    res.status(201).json({ msg: 'Médico creado exitosamente', newDoctor });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear médico', error });
  }
};

// Función para obtener la lista de médicos
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener médicos', error });
  }
};

// Actualizar médico
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ msg: 'Médico no encontrado' });
    res.status(200).json({ msg: 'Médico actualizado', doctor });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar médico', error });
  }
};

// Eliminar médico
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ msg: 'Médico no encontrado' });
    res.status(200).json({ msg: 'Médico eliminado' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar médico', error });
  }
};
