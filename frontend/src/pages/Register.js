// src/pages/Register.js
import React, { useState } from 'react';
import '../assets/register.css';
import Footer from '../components/Footer';
import { registerUser } from '../services/api';

const initialState = {
  nombre: '',
  apellidos: '',
  genero: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  ciudad: '',
  departamento: '',
  email: '',
  password: '',
  confirmPassword: '',
  documento: ''
};

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,40}$/)) errs.nombre = 'Nombre inválido';
    if (!form.apellidos.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,60}$/)) errs.apellidos = 'Apellidos inválidos';
    if (!['Masculino','Femenino','Otro'].includes(form.genero)) errs.genero = 'Seleccione un género';
    if (!form.telefono.match(/^\d{7,15}$/)) errs.telefono = 'Teléfono inválido';
    if (!form.fechaNacimiento) errs.fechaNacimiento = 'Fecha requerida';
    if (!form.direccion || form.direccion.length < 5) errs.direccion = 'Dirección inválida';
    if (!form.ciudad || form.ciudad.length < 2) errs.ciudad = 'Ciudad inválida';
    if (!form.departamento || form.departamento.length < 2) errs.departamento = 'Departamento inválido';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Email inválido';
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) errs.password = 'Contraseña insegura';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    if (!form.documento.match(/^\d{5,15}$/)) errs.documento = 'Número de documento inválido';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await registerUser({
          nombre: form.nombre,
          apellidos: form.apellidos,
          genero: form.genero,
          telefono: form.telefono,
          fechaNacimiento: form.fechaNacimiento,
          direccion: form.direccion,
          ciudad: form.ciudad,
          departamento: form.departamento,
          email: form.email,
          password: form.password,
          documento: form.documento
        });
        setSuccess('Cuenta creada. Revisa tu correo para activarla.');
        setForm(initialState);
      } catch (err) {
        setSuccess('');
        setErrors({ api: err.response?.data?.msg || 'Error al registrar usuario' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="register-container-horizontal">
        <div className="register-side-info">
          <img src={require('../assets/logo-health.svg').default} alt="Logo Medical SAS" className="register-logo" />
          <h2 className="register-title-side">Crea tu cuenta<br/>Medical SAS</h2>
          <a className="register-btn-login" href="/login">Iniciar sesión</a>
        </div>
        <div className="register-form-side">
          <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="register-fields">
              <div className="register-row">
                <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                {errors.nombre && <span className="register-error">{errors.nombre}</span>}
              </div>
              <div className="register-row">
                <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
                {errors.apellidos && <span className="register-error">{errors.apellidos}</span>}
              </div>
              <div className="register-row">
                <select name="genero" value={form.genero} onChange={handleChange}>
                  <option value="">Género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.genero && <span className="register-error">{errors.genero}</span>}
              </div>
              <div className="register-row">
                <input
                  type="text"
                  name="documento"
                  placeholder="Número de documento"
                  value={form.documento}
                  onChange={handleChange}
                  required
                />
                {errors.documento && <span className="register-error">{errors.documento}</span>}
              </div>
              <div className="register-row">
                <input name="telefono" placeholder="Número de teléfono" value={form.telefono} onChange={handleChange} />
                {errors.telefono && <span className="register-error">{errors.telefono}</span>}
              </div>
              <div className="register-row">
                <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
                {errors.fechaNacimiento && <span className="register-error">{errors.fechaNacimiento}</span>}
              </div>
              <div className="register-row">
                <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
                {errors.direccion && <span className="register-error">{errors.direccion}</span>}
              </div>
              <div className="register-row">
                <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
                {errors.ciudad && <span className="register-error">{errors.ciudad}</span>}
              </div>
              <div className="register-row">
                <input name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} />
                {errors.departamento && <span className="register-error">{errors.departamento}</span>}
              </div>
              <div className="register-row">
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                {errors.email && <span className="register-error">{errors.email}</span>}
              </div>
              <div className="register-row">
                <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
                {errors.password && <span className="register-error">{errors.password}</span>}
              </div>
              <div className="register-row">
                <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
              </div>
            </div>
            <button className="register-btn" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Cuenta'}</button>
            {errors.api && <div className="register-error">{errors.api}</div>}
            {success && <div className="register-success">{success}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
