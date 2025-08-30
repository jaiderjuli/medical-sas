const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuración de nodemailer (ajusta con tus credenciales reales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para registrar un usuario
exports.registerUser = async (req, res) => {
  const {
    nombre, apellidos, documento, genero, telefono, fechaNacimiento, direccion, ciudad, departamento, email, password
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Usuario ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      nombre,
      apellidos,
      documento, // ahora sí tiene valor
      genero,
      telefono,
      fechaNacimiento,
      direccion,
      ciudad,
      departamento,
      email,
      password: hashedPassword,
      activationToken,
      isActive: false
    });

    await newUser.save();

    // Enviar correo de activación
    const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Activa tu cuenta Medical SAS',
      html: `<h3>Bienvenido a Medical SAS</h3><p>Tu cuenta ha sido creada. Para activarla, haz clic en el siguiente enlace:</p><a href="${activationUrl}">${activationUrl}</a>`
    });

    res.status(201).json({ msg: 'Usuario registrado. Revisa tu correo para activarlo.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar usuario', error });
  }
};

// Función para activar usuario
exports.activateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ activationToken: token });
    if (!user) return res.status(400).json({ msg: 'Token inválido' });
    user.isActive = true;
    user.activationToken = undefined;
    await user.save();
    res.status(200).json({ msg: 'Cuenta activada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al activar cuenta', error });
  }
};

// Función para el login de usuario
/*exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    if (!user.isActive) {
      return res.status(403).json({ msg: 'Debes activar tu cuenta desde el correo' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error al autenticar usuario', error });
  }
};*/

/////////////////////////////////////////////////////////////

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Usuario admin quemado para pruebas
  if (email === 'medicalcol.sas@gmail.com' && password === 'admin123@@') {
    return res.json({
      _id: 'admin-id',
      nombre: 'Administrador',
      apellidos: 'Principal',
      documento: '00000000', // <-- valor fijo para admin
      email: 'medicalcol.sas@gmail.com',
      rol: 'admin',
      token: 'token-falso-para-pruebas'
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    if (!user.isActive) {
      return res.status(403).json({ msg: 'Debes activar tu cuenta desde el correo' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      documento: user.documento, // <-- valor real del paciente
      email: user.email,
      rol: user.rol,
      token
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error al autenticar usuario', error });
  }
};

// Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ msg: 'Si el correo está registrado, recibirás instrucciones.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hora
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recupera tu contraseña Medical SAS',
      html: `<h3>Recuperación de contraseña</h3><p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`
    });
    res.status(200).json({ msg: 'Si el correo está registrado, recibirás instrucciones.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al solicitar recuperación', error });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: 'Token inválido o expirado' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ msg: 'Contraseña restablecida correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al restablecer contraseña', error });
  }
};

