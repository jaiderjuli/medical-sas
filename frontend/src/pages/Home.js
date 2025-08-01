import React from 'react';
import '../assets/home.css';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="home-card">
          <img src={require('../assets/logo-health.svg').default} alt="Logo Medical SAS" className="home-logo" />
          <h1 className="home-title">Medical SAS</h1>
          <p className="home-lead">Tu mejor amigo en gestión de citas, ahórrate largas filas y gestiona tu cita fácilmente.</p>
          <div>
            <a className="home-btn-primary" href="/register">Crear Cuenta</a>
            <a className="home-btn-secondary" href="/login">Ingresar</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
