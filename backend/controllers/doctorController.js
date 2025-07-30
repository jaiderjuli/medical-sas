// controllers/doctorController.js
const Doctor = require('../models/Doctor'); // Asegúrate de tener un modelo Doctor creado

// Función para crear un nuevo médico
exports.createDoctor = async (req, res) => {
  const { name, specialty, email, phone } = req.body;

  try {
    const newDoctor = new Doctor({
      name,
      specialty,
      email,
      phone,
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
