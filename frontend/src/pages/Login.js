// src/pages/Login.js
import React, { useState, useContext } from 'react';
import '../assets/login.css';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Email inválido';
    if (!form.password || form.password.length < 8) errs.password = 'Contraseña inválida';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const res = await api.post('/users/login', form);
        setSuccess('Ingreso exitoso');
        loginContext(res.data.user || { email: form.email });
        setTimeout(() => navigate('/dashboard'), 1200);
      } catch (err) {
        setSuccess('');
        setErrors({ api: err.response?.data?.msg || 'Error al ingresar' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="login-title">Iniciar sesión</h2>
          <div className="login-row">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="login-error">{errors.email}</span>}
          </div>
          <div className="login-row">
            <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
            {errors.password && <span className="login-error">{errors.password}</span>}
          </div>
          <a className="login-link" href="/forgot-password">¿Olvidaste tu contraseña?</a>
          <a className="login-link" href="/register">¿No tienes una cuenta? Crear cuenta</a>
          {/* Aquí podrías integrar un captcha visual si lo deseas */}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          {errors.api && <div className="login-error">{errors.api}</div>}
          {success && <div className="login-success">{success}</div>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
