import React from 'react';
import Footer from '../components/Footer';
import '../assets/dashboard.css';

const Dashboard = ({ userType = 'Paciente' }) => {
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Bienvenido a tu Panel, {userType}</h2>
          <div className="dashboard-sections">
            {userType === 'Paciente' && (
              <>
                <div className="dashboard-section">
                  <h3>Mis Citas</h3>
                  <p>Consulta, cancela o reprograma tus citas médicas fácilmente.</p>
                  <button className="dashboard-btn">Ver mis citas</button>
                </div>
                <div className="dashboard-section">
                  <h3>Agendar Nueva Cita</h3>
                  <p>Selecciona médico, fecha y hora para tu próxima consulta.</p>
                  <button className="dashboard-btn">Agendar cita</button>
                </div>
              </>
            )}
            {userType === 'Medico' && (
              <>
                <div className="dashboard-section">
                  <h3>Citas Programadas</h3>
                  <p>Visualiza y gestiona las citas de tus pacientes.</p>
                  <button className="dashboard-btn">Ver agenda</button>
                </div>
                <div className="dashboard-section">
                  <h3>Historial de Pacientes</h3>
                  <p>Accede al historial clínico de tus pacientes.</p>
                  <button className="dashboard-btn">Ver historial</button>
                </div>
              </>
            )}
            {userType === 'Admin' && (
              <>
                <div className="dashboard-section">
                  <h3>Gestión de Usuarios</h3>
                  <p>Administra médicos, pacientes y permisos.</p>
                  <button className="dashboard-btn">Gestionar usuarios</button>
                </div>
                <div className="dashboard-section">
                  <h3>Reportes</h3>
                  <p>Visualiza reportes de citas, usuarios y actividad.</p>
                  <button className="dashboard-btn">Ver reportes</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
