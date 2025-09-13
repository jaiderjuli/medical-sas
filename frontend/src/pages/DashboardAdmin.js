import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd, FaClipboardList, FaUsers, FaBell, FaChartBar, FaCog,
  FaHome, FaStethoscope, FaSignOutAlt, FaExclamationTriangle, FaPlus, FaEdit, FaTrash,
  FaCalendarDay, FaCalendarWeek, FaClock, FaBan,
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { getNotificaciones, marcarLeida, eliminarNotificacion } from '../services/notificationApi';
import '../assets/dashboard-admin.css';

const sections = [
  { key: 'inicio', label: 'Inicio', icon: <FaHome /> },
  { key: 'medicos', label: 'Gestión de médicos', icon: <FaUserMd /> },
  { key: 'especialidades', label: 'Gestión de especialidades', icon: <FaStethoscope /> },
  { key: 'citas', label: 'Gestión de citas', icon: <FaClipboardList /> },
  { key: 'pacientes', label: 'Gestión de pacientes', icon: <FaUsers /> },
  { key: 'notificaciones', label: 'Notificaciones', icon: <FaBell /> },
  { key: 'reportes', label: 'Reportes', icon: <FaChartBar /> },
  { key: 'configuraciones', label: 'Configuraciones', icon: <FaCog /> },
];

const initialMedico = {
  nombre: '',
  apellidos: '',
  especialidad: '',
  horario: '',
  email: '',
};

const initialEspecialidad = {
  nombre: '',
};

const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // INICIO
  const [resumen, setResumen] = useState({
    hoy: 0, semana: 0, pendientes: 0, canceladas: 0,
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // MÉDICOS
  const [medicos, setMedicos] = useState([]);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [editMedico, setEditMedico] = useState(null);
  const [medicoForm, setMedicoForm] = useState(initialMedico);
  const [medicoError, setMedicoError] = useState('');
  const [deleteMedicoId, setDeleteMedicoId] = useState(null);

  // ESPECIALIDADES
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [showEspecialidadModal, setShowEspecialidadModal] = useState(false);
  const [editEspecialidad, setEditEspecialidad] = useState(null);
  const [especialidadForm, setEspecialidadForm] = useState(initialEspecialidad);
  const [especialidadError, setEspecialidadError] = useState('');
  const [deleteEspecialidadId, setDeleteEspecialidadId] = useState(null);

  // CITAS
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // PACIENTES
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);

  // NOTIFICACIONES
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);

  // REPORTES
  const [reportes, setReportes] = useState([]);

  // CONFIGURACIONES
  const [config] = useState({
    duracionCita: 30,
    horarioInicio: '08:00',
    horarioFin: '18:00',
  });

  // CRUD visual para Citas
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [editCita, setEditCita] = useState(null);
  const [citaForm, setCitaForm] = useState({});
  const [deleteCitaId, setDeleteCitaId] = useState(null);

  // CRUD visual para Pacientes
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [editPaciente, setEditPaciente] = useState(null);
  const [pacienteForm, setPacienteForm] = useState({});

  // CRUD visual para Reportes
  const [deleteReporteId, setDeleteReporteId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // INICIO: cargar resumen y gráfico
  useEffect(() => {
    const fetchResumen = async () => {
      setLoading(true);
      try {
        const resCitas = await api.get('/admin/resumen-citas');
        const resEspecialidades = await api.get('/admin/citas-por-especialidad');
        setResumen(resCitas.data);
        setEspecialidades(resEspecialidades.data);
      } catch (err) {
        setResumen({ hoy: 0, semana: 0, pendientes: 0, canceladas: 0 });
        setEspecialidades([]);
      } finally {
        setLoading(false);
      }
    };
    if (activeSection === 'inicio') fetchResumen();
  }, [activeSection]);

  // MÉDICOS: cargar médicos
  const fetchMedicos = async () => {
    setLoadingMedicos(true);
    try {
      const res = await api.get('/admin/medicos');
      setMedicos(res.data);
    } catch (err) {
      setMedicos([]);
    } finally {
      setLoadingMedicos(false);
    }
  };
  useEffect(() => {
    if (activeSection === 'medicos') fetchMedicos();
  }, [activeSection]);

  // ESPECIALIDADES: cargar especialidades
  const fetchEspecialidades = async () => {
    setLoadingEspecialidades(true);
    try {
      const res = await api.get('/admin/especialidades');
      setEspecialidadesList(res.data);
    } catch (err) {
      setEspecialidadesList([]);
    } finally {
      setLoadingEspecialidades(false);
    }
  };
  useEffect(() => {
    if (activeSection === 'especialidades') fetchEspecialidades();
  }, [activeSection]);

  // CITAS: cargar citas
  useEffect(() => {
    const fetchCitas = async () => {
      
      if (activeSection !== 'citas') return;
      setLoadingCitas(true);
      try {
        const res = await api.get('/admin/citas');
        setCitas(res.data);
      } catch (err) {
        setCitas([]);
      } finally {
        setLoadingCitas(false);
      }
    };
    fetchCitas();
  }, [activeSection]);

  // PACIENTES: cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      if (activeSection !== 'pacientes') return;
      setLoadingPacientes(true);
      try {
        const res = await api.get('/admin/pacientes');
        setPacientes(res.data);
      } catch (err) {
        setPacientes([]);
      } finally {
        setLoadingPacientes(false);
      }
    };
    fetchPacientes();
  }, [activeSection]);

  // REPORTES: cargar reportes (simulado)
  useEffect(() => {
    if (activeSection !== 'reportes') return;
    setReportes([
      { id: 1, titulo: 'Citas por especialidad', fecha: '2025-08-15', tipo: 'PDF' },
      { id: 2, titulo: 'Pacientes por edad', fecha: '2025-08-14', tipo: 'Excel' },
    ]);
  }, [activeSection]);

  // --- CRUD MÉDICOS ---
  const openAddMedico = () => {
    setEditMedico(null);
    setMedicoForm(initialMedico);
    setMedicoError('');
    setShowMedicoModal(true);
  };
  const openEditMedico = medico => {
    setEditMedico(medico);
    setMedicoForm(medico);
    setMedicoError('');
    setShowMedicoModal(true);
  };
  const closeMedicoModal = () => {
    setShowMedicoModal(false);
    setEditMedico(null);
    setMedicoForm(initialMedico);
    setMedicoError('');
  };
  const handleMedicoChange = e => {
    setMedicoForm({ ...medicoForm, [e.target.name]: e.target.value });
  };
  const handleMedicoSubmit = async e => {
    e.preventDefault();
    setMedicoError('');
    try {
      if (editMedico) {
        await api.put(`/admin/medicos/${editMedico._id}`, medicoForm);
      } else {
        await api.post('/admin/medicos', medicoForm);
      }
      closeMedicoModal();
      fetchMedicos();
    } catch (err) {
      setMedicoError('Error al guardar médico');
    }
  };
  const confirmDeleteMedico = id => setDeleteMedicoId(id);
  const handleDeleteMedico = async () => {
    try {
      await api.delete(`/admin/medicos/${deleteMedicoId}`);
      setDeleteMedicoId(null);
      fetchMedicos();
    } catch {
      setDeleteMedicoId(null);
      alert('Error al eliminar médico');
    }
  };

  // --- CRUD ESPECIALIDADES ---
  const openAddEspecialidad = () => {
    setEditEspecialidad(null);
    setEspecialidadForm(initialEspecialidad);
    setEspecialidadError('');
    setShowEspecialidadModal(true);
  };
  const openEditEspecialidad = esp => {
    setEditEspecialidad(esp);
    setEspecialidadForm(esp);
    setEspecialidadError('');
    setShowEspecialidadModal(true);
  };
  const closeEspecialidadModal = () => {
    setShowEspecialidadModal(false);
    setEditEspecialidad(null);
    setEspecialidadForm(initialEspecialidad);
    setEspecialidadError('');
  };
  const handleEspecialidadChange = e => {
    setEspecialidadForm({ ...especialidadForm, [e.target.name]: e.target.value });
  };
  const handleEspecialidadSubmit = async e => {
    e.preventDefault();
    setEspecialidadError('');
    try {
      if (editEspecialidad) {
        await api.put(`/admin/especialidades/${editEspecialidad._id}`, especialidadForm);
      } else {
        await api.post('/admin/especialidades', especialidadForm);
      }
      closeEspecialidadModal();
      fetchEspecialidades();
    } catch (err) {
      setEspecialidadError('Error al guardar especialidad');
    }
  };
  const confirmDeleteEspecialidad = id => setDeleteEspecialidadId(id);
  const handleDeleteEspecialidad = async () => {
    try {
      await api.delete(`/admin/especialidades/${deleteEspecialidadId}`);
      setDeleteEspecialidadId(null);
      fetchEspecialidades();
    } catch {
      setDeleteEspecialidadId(null);
      alert('Error al eliminar especialidad');
    }
  };

  // --- Funciones para Citas ---
  const handleHoraChange = async (id, nuevaHora) => {
    try {
      await api.put(`/admin/citas/${id}`, { time: nuevaHora });
      // Actualiza la lista de citas
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (err) {
      alert('Error al actualizar la hora');
    }
  };

  const handleConfirmCita = async (id) => {
    try {
      await api.put(`/admin/citas/${id}`, { estado: 'Confirmada' });
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (err) {
      alert('Error al confirmar la cita');
    }
  };

  const handleRejectCita = async (id) => {
    try {
      await api.put(`/admin/citas/${id}`, { estado: 'Rechazada' });
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (err) {
      alert('Error al rechazar la cita');
    }
  };



  const handleRolChange = async (id, nuevoRol) => {
    try {
      await api.put(`/admin/pacientes/${id}`, { rol: nuevoRol });
      const res = await api.get('/admin/pacientes');
      setPacientes(res.data);
    } catch {
      alert('Error al cambiar el rol');
    }
  };

  const handleDeletePaciente = async id => {
    try {
      await api.delete(`/admin/pacientes/${id}`);
      const res = await api.get('/admin/pacientes');
      setPacientes(res.data);
    } catch {
      alert('Error al eliminar paciente');
    }
  };

  const openEditPaciente = paciente => {
    setEditPaciente(paciente);
    setPacienteForm(paciente);
    setShowPacienteModal(true);
  };

  const closePacienteModal = () => {
    setShowPacienteModal(false);
    setEditPaciente(null);
    setPacienteForm({});
  };

  const handlePacienteChange = e => {
    setPacienteForm({ ...pacienteForm, [e.target.name]: e.target.value });
  };

  const handlePacienteSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/admin/pacientes/${editPaciente._id}`, pacienteForm);
      closePacienteModal();
      const res = await api.get('/admin/pacientes');
      setPacientes(res.data);
    } catch {
      alert('Error al guardar paciente');
    }
  };
  // ...otras funciones...

const confirmDeleteReporte = id => setDeleteReporteId(id);

const handleDeleteReporte = async () => {
  try {
    setReportes(reportes.filter(r => r.id !== deleteReporteId));
    setDeleteReporteId(null);
  } catch {
    setDeleteReporteId(null);
    alert('Error al eliminar reporte');
  }
};


  return (
    <div className="dashboard-admin">
      <aside className="dashboard-admin-sidebar">
        <div className="dashboard-admin-logo">
          <img src={require('../assets/logo-health.svg').default} alt="Logo" />
          <span>Medical SAS</span>
        </div>
        <nav>
          {sections.map(sec => (
            <button
              key={sec.key}
              className={activeSection === sec.key ? 'active' : ''}
              onClick={() => setActiveSection(sec.key)}
            >
              {sec.icon} {sec.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-admin-main">
        <header className="dashboard-admin-header">
          <h2>{sections.find(s => s.key === activeSection).label}</h2>
          <div className="dashboard-admin-user">
            <span>Admin</span>
            <img src={require('../assets/logo-health.svg').default} alt="Admin" />
            <button className="dashboard-admin-logout" onClick={handleLogout} title="Cerrar sesión">
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        </header>
        <section className="dashboard-admin-content">
          {/* INICIO */}
          {activeSection === 'inicio' && (
            <div className="dashboard-admin-inicio">
              {loading ? (
                <div>Cargando datos...</div>
              ) : (
                <>
                  <div className="dashboard-admin-cards">
                    <div className="dashboard-admin-card">
                      <h4><FaCalendarDay style={{ marginRight: 8 }} />Citas de hoy</h4>
                      <span className="dashboard-admin-card-num">{resumen.hoy}</span>
                    </div>
                    <div className="dashboard-admin-card">
                      <h4><FaCalendarWeek style={{ marginRight: 8 }} />Citas esta semana</h4>
                      <span className="dashboard-admin-card-num">{resumen.semana}</span>
                    </div>
                    <div className="dashboard-admin-card alert">
                      <h4><FaClock style={{ marginRight: 8 }} />Pendientes</h4>
                      <span className="dashboard-admin-card-num">{resumen.pendientes}</span>
                    </div>
                    <div className="dashboard-admin-card alert-cancel">
                      <h4><FaBan style={{ marginRight: 8 }} />Canceladas</h4>
                      <span className="dashboard-admin-card-num">{resumen.canceladas}</span>
                    </div>
                  </div>
                  <div className="dashboard-admin-graph-section">
                    <h4>Gráfico de citas por especialidad</h4>
                    <div className="dashboard-admin-graph">
                      {especialidades.length === 0 && <div>No hay datos para mostrar.</div>}
                      {especialidades.map(es => (
                        <div key={es.nombre} className="dashboard-admin-bar">
                          <span>{es.nombre}</span>
                          <div className="dashboard-admin-bar-bg">
                            <div
                              className="dashboard-admin-bar-fill"
                              style={{ width: `${es.cantidad * 5}%` }}
                            >
                              {es.cantidad}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard-admin-alerts">
                    <h4><FaExclamationTriangle style={{ color: '#e53935', marginRight: 8 }} />Alertas</h4>
                    <ul>
                      <li>Hay {resumen.pendientes} citas pendientes por confirmar.</li>
                      <li>Se han cancelado {resumen.canceladas} citas esta semana.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          {/* MÉDICOS */}
          {activeSection === 'medicos' && (
            <div className="dashboard-admin-medicos">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>Listado de médicos</h3>
                <button className="dashboard-btn" onClick={openAddMedico}>
                  <FaPlus /> Agregar médico
                </button>
              </div>
              {loadingMedicos ? (
                <div>Cargando médicos...</div>
              ) : (
                <table className="dashboard-citas-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Especialidad</th>
                      <th>Horario</th>
                      <th>Email</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicos.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#e53935' }}>No hay médicos registrados.</td>
                      </tr>
                    ) : (
                      medicos.map(medico => (
                        <tr key={medico._id}>
                          <td>{medico.nombre} {medico.apellidos}</td>
                          <td>{medico.especialidad}</td>
                          <td>{medico.horario || '-'}</td>
                          <td>{medico.email}</td>
                          <td>
                            {/* Solo los botones de editar y eliminar */}
                            <button className="dashboard-btn-reagendar" onClick={() => openEditMedico(medico)} title="Editar"><FaEdit /></button>
                            <button className="dashboard-btn-cancel" onClick={() => confirmDeleteMedico(medico._id)} title="Eliminar"><FaTrash /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {/* Modal agregar/editar médico */}
              {showMedicoModal && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>{editMedico ? 'Editar médico' : 'Agregar médico'}</h3>
                    <form className="dashboard-modal-form" onSubmit={handleMedicoSubmit}>
                      <input name="nombre" placeholder="Nombre" value={medicoForm.nombre} onChange={handleMedicoChange} required />
                      <input name="apellidos" placeholder="Apellidos" value={medicoForm.apellidos} onChange={handleMedicoChange} required />
                      <input name="especialidad" placeholder="Especialidad" value={medicoForm.especialidad} onChange={handleMedicoChange} required />
                      <input name="horario" placeholder="Horario" value={medicoForm.horario} onChange={handleMedicoChange} />
                      <input name="email" type="email" placeholder="Email" value={medicoForm.email} onChange={handleMedicoChange} required />
                      {medicoError && <div className="dashboard-cita-empty">{medicoError}</div>}
                      <div className="dashboard-modal-actions">
                        <button className="dashboard-btn" type="submit">{editMedico ? 'Guardar' : 'Agregar'}</button>
                        <button className="dashboard-btn-cancel" type="button" onClick={closeMedicoModal}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Confirmar eliminar médico */}
              {deleteMedicoId && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>¿Eliminar médico?</h3>
                    <div className="dashboard-modal-actions">
                      <button className="dashboard-btn-cancel" onClick={handleDeleteMedico}>Eliminar</button>
                      <button className="dashboard-btn" onClick={() => setDeleteMedicoId(null)}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ESPECIALIDADES */}
          {activeSection === 'especialidades' && (
            <div className="dashboard-admin-especialidades">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>Especialidades</h3>
                <button className="dashboard-btn" onClick={openAddEspecialidad}>
                  <FaPlus /> Agregar especialidad
                </button>
              </div>
              {loadingEspecialidades ? (
                <div>Cargando especialidades...</div>
              ) : (
                <table className="dashboard-citas-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Médicos asignados</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {especialidadesList.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: '#e53935' }}>No hay especialidades registradas.</td>
                      </tr>
                    ) : (
                      especialidadesList.map(esp => (
                        <tr key={esp._id}>
                          <td>{esp.nombre}</td>
                          <td>{esp.medicosAsignados || 0}</td>
                          <td>
                            {/* Solo los botones de editar y eliminar */}
                            <button className="dashboard-btn-reagendar" onClick={() => openEditEspecialidad(esp)} title="Editar"><FaEdit /></button>
                            <button className="dashboard-btn-cancel" onClick={() => confirmDeleteEspecialidad(esp._id)} title="Eliminar"><FaTrash /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {/* Modal agregar/editar especialidad */}
              {showEspecialidadModal && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>{editEspecialidad ? 'Editar especialidad' : 'Agregar especialidad'}</h3>
                    <form className="dashboard-modal-form" onSubmit={handleEspecialidadSubmit}>
                      <input name="nombre" placeholder="Nombre" value={especialidadForm.nombre} onChange={handleEspecialidadChange} required />
                      {especialidadError && <div className="dashboard-cita-empty">{especialidadError}</div>}
                      <div className="dashboard-modal-actions">
                        <button className="dashboard-btn" type="submit">{editEspecialidad ? 'Guardar' : 'Agregar'}</button>
                        <button className="dashboard-btn-cancel" type="button" onClick={closeEspecialidadModal}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Confirmar eliminar especialidad */}
              {deleteEspecialidadId && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>¿Eliminar especialidad?</h3>
                    <div className="dashboard-modal-actions">
                      <button className="dashboard-btn-cancel" onClick={handleDeleteEspecialidad}>Eliminar</button>
                      <button className="dashboard-btn" onClick={() => setDeleteEspecialidadId(null)}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CITAS */}
          {activeSection === 'citas' && (
            <div className="dashboard-admin-citas">
              <h3>Gestión de citas</h3>
              {loadingCitas ? (
                <div>Cargando citas...</div>
              ) : (
                <table className="dashboard-citas-table">
                  <thead>
                    <tr>
                      <th>Especialidad</th>
                      <th>Médico</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Tipo</th>
                      <th>Paciente</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#e53935' }}>No hay citas registradas.</td>
                      </tr>
                    ) : (
                      citas.map(cita => (
                        <tr key={cita._id}>
                          <td>{cita.especialidad}</td>
                          <td>{cita.doctor}</td>
                          <td>{cita.date}</td>
                          <td>
                            <input
                              type="time"
                              value={cita.time}
                              onChange={e => handleHoraChange(cita._id, e.target.value)}
                              style={{ width: '90px' }}
                            />
                          </td>
                          <td>{cita.tipo}</td>
                          <td>{cita.documento}</td>
                          <td>{cita.estado || 'Pendiente'}</td>
                          <td>
                            <button className="dashboard-btn" onClick={() => handleConfirmCita(cita._id)}>Confirmar</button>
                            <button className="dashboard-btn-cancel" onClick={() => handleRejectCita(cita._id)}>Rechazar</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PACIENTES */}
          {activeSection === 'pacientes' && (
            <div className="dashboard-admin-pacientes">
              <h3>Gestión pacientes</h3>
              {loadingPacientes ? (
                <div>Cargando pacientes...</div>
              ) : (
                <table className="dashboard-citas-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Documento</th>
                      <th>Teléfono</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: '#e53935' }}>No hay pacientes registrados.</td>
                      </tr>
                    ) : (
                      pacientes.map(p => (
                        <tr key={p._id}>
                          <td>{p.nombre} {p.apellidos}</td>
                          <td>{p.email}</td>
                          <td>{p.documento}</td>
                          <td>{p.telefono}</td>
                          <td>
                            <select
                              value={p.rol || 'paciente'}
                              onChange={e => handleRolChange(p._id, e.target.value)}
                            >
                              <option value="paciente">Paciente</option>
                              <option value="administrador">Administrador</option>
                            </select>
                          </td>
                          <td>
                            <button className="dashboard-btn-reagendar" onClick={() => openEditPaciente(p)} title="Editar"><FaEdit /></button>
                            <button className="dashboard-btn-cancel" onClick={() => handleDeletePaciente(p._id)} title="Eliminar"><FaTrash /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {/* Modal editar paciente */}
              {showPacienteModal && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>Editar paciente</h3>
                    <form className="dashboard-modal-form" onSubmit={handlePacienteSubmit}>
                      <input name="nombre" placeholder="Nombre" value={pacienteForm.nombre || ''} onChange={handlePacienteChange} />
                      <input name="apellidos" placeholder="Apellidos" value={pacienteForm.apellidos || ''} onChange={handlePacienteChange} />
                      <input name="telefono" placeholder="Teléfono" value={pacienteForm.telefono || ''} onChange={handlePacienteChange} />
                      <input name="email" placeholder="Correo" value={pacienteForm.email || ''} onChange={handlePacienteChange} />
                      <input name="documento" placeholder="Documento" value={pacienteForm.documento || ''} onChange={handlePacienteChange} />
                      <select name="rol" value={pacienteForm.rol || 'paciente'} onChange={handlePacienteChange}>
                        <option value="paciente">Paciente</option>
                        <option value="administrador">Administrador</option>
                      </select>
                      <div className="dashboard-modal-actions">
                        <button className="dashboard-btn" type="submit">Guardar</button>
                        <button className="dashboard-btn-cancel" type="button" onClick={closePacienteModal}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REPORTES */}
          {activeSection === 'reportes' && (
            <div className="dashboard-admin-reportes">
              <h3>Reportes</h3>
              <table className="dashboard-citas-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#e53935' }}>No hay reportes generados.</td>
                    </tr>
                  ) : (
                    reportes.map(r => (
                      <tr key={r.id}>
                        <td>{r.titulo}</td>
                        <td>{r.fecha}</td>
                        <td>{r.tipo}</td>
                        <td>
                          {/* Solo los botones de editar y eliminar */}
                          <button className="dashboard-btn-reagendar" title="Editar"><FaEdit /></button>
                          <button className="dashboard-btn-cancel" onClick={() => confirmDeleteReporte(r.id)} title="Eliminar"><FaTrash /></button>
                        </td>
                      </tr>
                    ))
                   ) }
                </tbody>
              </table>
              {/* Confirmar eliminar reporte */}
              {deleteReporteId && (
                <div className="dashboard-modal-overlay">
                  <div className="dashboard-modal">
                    <h3>¿Eliminar reporte?</h3>
                    <div className="dashboard-modal-actions">
                      <button className="dashboard-btn-cancel" onClick={handleDeleteReporte}>Eliminar</button>
                      <button className="dashboard-btn" onClick={() => setDeleteReporteId(null)}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONFIGURACIONES */}
          {activeSection === 'configuraciones' && (
            <div className="dashboard-admin-config">
              <h3>Configuraciones generales</h3>
              <form className="dashboard-admin-config-form">
                <div>
                  <label>Duración de cita (minutos):</label>
                  <input type="number" value={config.duracionCita} min={10} max={120} readOnly />
                </div>
                <div>
                  <label>Horario inicio:</label>
                  <input type="time" value={config.horarioInicio} readOnly />
                </div>
                <div>
                  <label>Horario fin:</label>
                  <input type="time" value={config.horarioFin} readOnly />
                </div>
                <button className="dashboard-btn" type="button" disabled>Guardar cambios</button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardAdmin;