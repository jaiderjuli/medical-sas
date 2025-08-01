import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { activateUser } from '../services/api';
import Footer from '../components/Footer';
import '../assets/register.css';

const ActivateAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const activate = async () => {
      try {
        await activateUser(token);
        setStatus('¡Cuenta activada correctamente! Ya puedes iniciar sesión.');
      } catch (err) {
        setStatus('El enlace no es válido o la cuenta ya fue activada.');
      }
    };
    activate();
  }, [token]);

  return (
    <>
      <div className="register-container">
        <div className="register-form">
          <h2 className="register-title">Activación de Cuenta</h2>
          <p className="register-success">{status}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ActivateAccount;
