// controllers/appointmentController.js
const Appointment = require('../models/Appointment');

// Crear cita
exports.createAppointment = async (req, res) => {
  console.log('BODY:', req.body);
  try {
    // Obtener el documento del paciente
    const documento = req.body.documento;

    // Obtener el mes y año de la cita que se quiere agendar
    const fecha = req.body.fecha; // formato: 'YYYY-MM-DD'
    const [year, month] = fecha.split('-');

    // Buscar citas de ese paciente en el mismo mes y año
    const citasDelMes = await Appointment.find({
      documento: req.body.documento,
      date: { $regex: `^${year}-${month}` }
    });

    if (citasDelMes.length >= 2) {
      return res.status(400).json({ msg: 'Solo puedes agendar dos citas por mes.' });
    }

    // Mapeo de campos del frontend al modelo
    const horaCompleta = `${req.body.hora} ${req.body.ampm || ''}`.trim();

    const appointmentData = {
      documento: req.body.documento,
      doctor: req.body.doctor,
      date: new Date().toISOString().split('T')[0], // fecha actual
      time: req.body.hora, // hora con AM/PM
      especialidad: req.body.especialidad,
      motivo: req.body.motivo,
      telefono: req.body.telefono,
      email: req.body.email,
      direccion: req.body.direccion,
      observaciones: req.body.observaciones,
      tipo: req.body.tipo,
      edad: req.body.edad,
      estado: req.body.estado,
    };
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res.status(201).json({ msg: 'Cita creada', appointment });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ msg: 'Error al crear cita', error });
  }
};

// Obtener todas las citas
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener citas', error });
  }
};

// Actualizar cita
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.status(200).json({ msg: 'Cita actualizada', appointment });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar cita', error });
  }
};

// Eliminar cita
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.status(200).json({ msg: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar cita', error });
  }
};
