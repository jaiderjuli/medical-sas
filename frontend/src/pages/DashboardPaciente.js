import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Footer from '../components/Footer';
import '../assets/dashboard.css';
import logo from '../assets/logo-health.svg';

const specialties = [
  'Medicina General',
  'Pediatría',
  'Ginecología',
  'Cardiología',
  'Dermatología',
  'Odontología',
];
const doctors = [
  'Dr. Juan Pérez',
  'Dra. Ana Gómez',
  'Dr. Carlos Ruiz',
  'Dra. Laura Torres',
];
const types = [
  'Consulta presencial',
  'Consulta virtual',
];

const citasEjemplo = [
  { id: 1, especialidad: 'Medicina General', medico: 'Dr. Juan Pérez', fecha: '2025-07-10', hora: '09:00', tipo: 'Presencial', estado: 'Realizada' },
  { id: 2, especialidad: 'Pediatría', medico: 'Dra. Ana Gómez', fecha: '2025-07-15', hora: '11:00', tipo: 'Virtual', estado: 'Pendiente' },
];

// Cargar los iconos SVG en el DOM
if (typeof window !== 'undefined') {
  const svgIcons = document.getElementById('dashboard-icons');
  if (!svgIcons) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/dashboard-icons.svg', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const div = document.createElement('div');
        div.innerHTML = xhr.responseText;
        div.style.display = 'none';
        div.id = 'dashboard-icons';
        document.body.appendChild(div);
      }
    };
    xhr.send();
  }
}

const initialForm = {
  especialidad: '',
  medico: '',
  fecha: '',
  hora: '',
  tipo: '',
  edad: '',
  motivo: '',
  telefono: '',
  email: '',
  direccion: '',
  documento: '',
  observaciones: '',
};

const DashboardPaciente = () => {
  const [menu, setMenu] = useState('reservar');
  const [form, setForm] = useState(initialForm);
  const [citas, setCitas] = useState(citasEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [citaToEdit, setCitaToEdit] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAgendar = e => {
    e.preventDefault();
    setMensaje('Cita agendada. Tienes un día para cancelar o reagendar la cita.');
    // Aquí iría la lógica real de agendar cita
  };

  const handleCancelar = id => {
    setCitas(citas.filter(c => c.id !== id));
  };

  const handleReagendar = id => {
    setMenu('reservar');
    setMensaje('Puedes reagendar tu cita.');
    // Aquí podrías cargar los datos de la cita seleccionada
  };

  const handleDeleteClick = (id) => {
    setCitaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCitas(citas.filter(c => c.id !== citaToDelete));
    setShowDeleteModal(false);
    setCitaToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCitaToDelete(null);
  };

  const handleEditClick = (cita) => {
    setCitaToEdit(cita);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setCitaToEdit({ ...citaToEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    setCitas(citas.map(c => c.id === citaToEdit.id ? citaToEdit : c));
    setShowEditModal(false);
    setCitaToEdit(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setCitaToEdit(null);
  };

  const citasFiltradas = citas.filter(cita =>
    cita.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
    cita.medico.toLowerCase().includes(busqueda.toLowerCase()) ||
    cita.fecha.includes(busqueda)
  );

  return (
    <>
      <div className="dashboard-menu-bar">
        <div className="dashboard-logo-app">
          <img src={logo} alt="Logo Medical SAS" className="dashboard-logo" />
          <span className="dashboard-app-name">Medical SAS</span>
        </div>
        <nav className="dashboard-menu">
          <button className={menu === 'reservar' ? 'active' : ''} onClick={() => setMenu('reservar')}>Reservar cita</button>
          <button className={menu === 'mis-citas' ? 'active' : ''} onClick={() => setMenu('mis-citas')}>Mis citas</button>
          <button className="dashboard-logout" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</button>
        </nav>
      </div>
      <div className="dashboard-content">
        {menu === 'reservar' && (
          <form className="dashboard-form" onSubmit={handleAgendar}>
            <h2 className="dashboard-title">Reservar cita</h2>
            <div className="dashboard-form-row">
              <select name="especialidad" value={form.especialidad} onChange={handleFormChange} required>
                <option value="">Especialidad</option>
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
              <select name="medico" value={form.medico} onChange={handleFormChange} required>
                <option value="">Médico</option>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="dashboard-form-row">
              <input type="date" name="fecha" value={form.fecha} onChange={handleFormChange} required />
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <input
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleFormChange}
                  required
                  style={{ flex: 1 }}
                />
                <select
                  name="ampm"
                  value={form.ampm || ''}
                  onChange={e => setForm({ ...form, ampm: e.target.value })}
                  required
                  style={{ maxWidth: '70px' }}
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="dashboard-form-row">
              <select name="tipo" value={form.tipo} onChange={handleFormChange} required>
                <option value="">Tipo de consulta</option>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="number" name="edad" placeholder="Edad" value={form.edad} onChange={handleFormChange} min="0" required />
            </div>
            <div className="dashboard-form-row">
              <input type="text" name="motivo" placeholder="Motivo de la cita" value={form.motivo} onChange={handleFormChange} required />
              <input type="text" name="telefono" placeholder="Teléfono de contacto" value={form.telefono} onChange={handleFormChange} required />
            </div>
            <div className="dashboard-form-row">
              <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleFormChange} required />
              <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleFormChange} required />
            </div>
            <div className="dashboard-form-row">
              <input type="text" name="documento" placeholder="Documento de identidad" value={form.documento} onChange={handleFormChange} required />
              <input type="text" name="observaciones" placeholder="Observaciones adicionales" value={form.observaciones} onChange={handleFormChange} />
            </div>
            <button className="dashboard-btn" type="submit">Reservar</button>
            {mensaje && <div className="dashboard-msg-info">{mensaje}</div>}
          </form>
        )}
        {menu === 'mis-citas' && (
          <div className="dashboard-citas">
            <h2 className="dashboard-title">Mis citas</h2>
            <div className="dashboard-search-bar">
              <span className="dashboard-search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#1976d2" strokeWidth="2" fill="none"/><line x1="16" y1="16" x2="22" y2="22" stroke="#1976d2" strokeWidth="2"/></svg>
              </span>
              <input className="dashboard-search" placeholder="Buscar cita..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
            <div className="dashboard-citas-table-wrapper">
              <table className="dashboard-citas-table">
                <thead>
                  <tr>
                    <th><svg width="20" height="20"><use href="#icon-specialty" /></svg> Especialidad</th>
                    <th><svg width="20" height="20"><use href="#icon-doctor" /></svg> Médico</th>
                    <th><svg width="20" height="20"><use href="#icon-calendar" /></svg> Fecha</th>
                    <th><svg width="20" height="20"><use href="#icon-clock" /></svg> Hora</th>
                    <th><svg width="20" height="20"><use href="#icon-type" /></svg> Tipo</th>
                    <th><svg width="20" height="20"><use href="#icon-status" /></svg> Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan="7" className="dashboard-cita-empty">No hay citas encontradas.</td>
                    </tr>
                  )}
                  {citasFiltradas.map(cita => (
                    <tr key={cita.id} className="dashboard-cita-row">
                      <td>{cita.especialidad}</td>
                      <td>{cita.medico}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>{cita.tipo}</td>
                      <td>{cita.estado}</td>
                      <td className="dashboard-cita-actions">
                        <button className="dashboard-btn-cancel" title="Eliminar" onClick={() => handleDeleteClick(cita.id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" style={{verticalAlign: 'middle'}}><path d="M3 6h18" stroke="#fff" strokeWidth="2"/><rect x="6" y="8" width="12" height="10" rx="2" fill="#fff" stroke="#e53935" strokeWidth="2"/><rect x="10" y="11" width="1.5" height="5" rx="0.75" fill="#e53935"/><rect x="12.5" y="11" width="1.5" height="5" rx="0.75" fill="#e53935"/></svg>
                        </button>
                        <button className="dashboard-btn-reagendar" title="Editar" onClick={() => handleEditClick(cita)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" style={{verticalAlign: 'middle'}}><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z" fill="#fff" stroke="#1976d2" strokeWidth="1.5"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#1976d2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {showDeleteModal && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>¿Estás seguro de eliminar la cita?</h3>
            <div className="dashboard-modal-actions">
              <button className="dashboard-btn-cancel" onClick={confirmDelete}>Sí, eliminar</button>
              <button className="dashboard-btn" onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && citaToEdit && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>Editar cita</h3>
            <div className="dashboard-modal-form">
              <input type="date" name="fecha" value={citaToEdit.fecha} onChange={handleEditChange} />
              <input type="time" name="hora" value={citaToEdit.hora} onChange={handleEditChange} />
              <input type="text" name="motivo" value={citaToEdit.motivo || ''} onChange={handleEditChange} placeholder="Motivo" />
              <input type="text" name="telefono" value={citaToEdit.telefono || ''} onChange={handleEditChange} placeholder="Teléfono" />
              <input type="email" name="email" value={citaToEdit.email || ''} onChange={handleEditChange} placeholder="Correo" />
              <input type="text" name="direccion" value={citaToEdit.direccion || ''} onChange={handleEditChange} placeholder="Dirección" />
              <input type="text" name="documento" value={citaToEdit.documento || ''} onChange={handleEditChange} placeholder="Documento" />
              <input type="text" name="observaciones" value={citaToEdit.observaciones || ''} onChange={handleEditChange} placeholder="Observaciones" />
            </div>
            <div className="dashboard-modal-actions">
              <button className="dashboard-btn-reagendar" onClick={saveEdit}>Guardar</button>
              <button className="dashboard-btn" onClick={cancelEdit}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPaciente;
