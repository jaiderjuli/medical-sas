import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Footer from '../components/Footer';
import '../assets/dashboard.css';
import logo from '../assets/logo-health.svg';
import api from '../services/api';

const types = [
  'Consulta presencial',
  'Consulta virtual',
];

const today = new Date().toISOString().split('T')[0];

const initialForm = {
  especialidad: '',
  doctor: '',
  fecha: today, // <-- la fecha actual por defecto
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
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [citaToEdit, setCitaToEdit] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      const res = await api.get('/admin/especialidades');
      setEspecialidades(res.data);
    };
    const fetchMedicos = async () => {
      const res = await api.get('/admin/medicos');
      setMedicos(res.data);
    };
    const fetchCitas = async () => {
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    };
    fetchEspecialidades();
    fetchMedicos();
    fetchCitas();
  }, []);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAgendar = async e => {
    e.preventDefault();
    // Siempre usa el documento del usuario logueado
    const formToSend = { ...form, documento: localStorage.getItem('documento') };
    try {
      await api.post('/admin/citas', formToSend);
      setMensaje('Cita agendada. Tienes un día para cancelar o reagendar la cita.');
      setForm(initialForm);
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (error) {
      if (error.response?.data?.msg === 'Solo puedes agendar dos citas por mes.') {
        setShowLimitModal(true);
      } else {
        setMensaje(error.response?.data?.msg || 'Error al agendar la cita.');
      }
    }
  };

  const handleDeleteClick = id => {
    setCitaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/citas/${citaToDelete}`);
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (error) {
      setMensaje('Error al eliminar la cita.');
    }
    setShowDeleteModal(false);
    setCitaToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCitaToDelete(null);
  };

  const handleEditClick = cita => {
    setCitaToEdit(cita);
    setShowEditModal(true);
  };

  const handleEditChange = e => {
    setCitaToEdit({ ...citaToEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/citas/${citaToEdit._id}`, citaToEdit);
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (error) {
      setMensaje('Error al editar la cita.');
    }
    setShowEditModal(false);
    setCitaToEdit(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setCitaToEdit(null);
  };

  // Obtén el documento del usuario logueado
  const userDocumento = form.documento || localStorage.getItem('documento');

  // Filtra solo las citas de ese usuario
  const citasFiltradas = citas
    .filter(cita => cita.documento === userDocumento)
    .filter(cita => cita.especialidad && cita.doctor && cita.date)
    .filter(cita =>
      cita.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.doctor.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.date.includes(busqueda)
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
      <div className="dashboard-user-info" style={{margin: '1rem 0', textAlign: 'center'}}>
        <strong>Paciente:</strong> {localStorage.getItem('nombre')?.split(' ')[0] || ''} {localStorage.getItem('apellido')?.split(' ')[0] || ''} <br />
        <strong>Identificación:</strong> {localStorage.getItem('documento') || ''}
      </div>
      <div className="dashboard-content">
        {menu === 'reservar' && (
          <form className="dashboard-form" onSubmit={handleAgendar}>
            <h2 className="dashboard-title">Reservar cita</h2>
            <div className="dashboard-form-row">
              <select name="especialidad" value={form.especialidad} onChange={handleFormChange} required>
                <option value="">Especialidad</option>
                {especialidades.map(e => (
                  <option key={e._id} value={e.nombre}>{e.nombre}</option>
                ))}
              </select>
              <select name="doctor" value={form.doctor} onChange={handleFormChange} required>
                <option value="">Médico</option>
                {medicos.map(m => (
                  <option key={m._id} value={m.nombre + ' ' + m.apellidos}>
                    {m.nombre} {m.apellidos} - {m.especialidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="dashboard-form-row">
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleFormChange}
                className="register-input"
                required
                readOnly
              />
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleFormChange}
                className="register-input"
                required
              />
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
              <input
                type="text"
                name="documento"
                placeholder="Documento de identidad"
                value={localStorage.getItem('documento') || ''}
                readOnly
                required
              />
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
                    <tr key={cita._id} className="dashboard-cita-row">
                      <td>{cita.especialidad}</td>
                      <td>{cita.medico}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>{cita.tipo}</td>
                      <td>{cita.estado || 'Pendiente'}</td>
                      <td className="dashboard-cita-actions">
                        <button className="dashboard-btn-cancel" title="Eliminar" onClick={() => handleDeleteClick(cita._id)}>
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
              <input type="date" name="fecha" value={citaToEdit.fecha || ''} onChange={handleEditChange} />
              <input type="time" name="hora" value={citaToEdit.hora || ''} onChange={handleEditChange} />
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
      {showLimitModal && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>Solo puedes agendar 2 citas por mes</h3>
            <div className="dashboard-modal-actions">
              <button className="dashboard-btn" onClick={() => setShowLimitModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPaciente;

