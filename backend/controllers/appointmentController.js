// controllers/appointmentController.js
const Appointment = require('../models/Appointment'); // Asegúrate de tener un modelo Appointment creado

// Función para crear una cita
exports.createAppointment = async (req, res) => {
  const { patient, doctor, date, time } = req.body;

  try {
    const newAppointment = new Appointment({
      patient,
      doctor,
      date,
      time,
    });

    await newAppointment.save();
    res.status(201).json({ msg: 'Cita creada exitosamente', newAppointment });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear cita', error });
  }
};

// Función para obtener todas las citas
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener citas', error });
  }
};
