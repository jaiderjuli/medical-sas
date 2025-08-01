import React, { useState } from 'react';
import '../assets/login.css';
import Footer from '../components/Footer';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Email inválido');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      setMsg('Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.');
    } catch (err) {
      setError('Error al enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="login-title">Recuperar contraseña</h2>
          <div className="login-row">
            <input name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            {error && <span className="login-error">{error}</span>}
          </div>
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar instrucciones'}</button>
          {msg && <div className="login-success">{msg}</div>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
