import React, { useState } from 'react';
import '../assets/login.css';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError('Contraseña insegura');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/users/reset-password/${token}`, { password });
      setMsg('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('El enlace no es válido o expiró.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="login-title">Restablecer contraseña</h2>
          <div className="login-row">
            <input type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="login-row">
            <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {error && <div className="login-error">{error}</div>}
          {msg && <div className="login-success">{msg}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Restableciendo...' : 'Restablecer'}</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
