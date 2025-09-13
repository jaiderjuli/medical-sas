import api from './api';

// Obtener todas las notificaciones
export const getNotificaciones = () => api.get('/admin/notificaciones');

// Crear una nueva notificación
export const crearNotificacion = (data) => api.post('/admin/notificaciones', data);

// Marcar como leída
export const marcarLeida = (id) => api.put(`/admin/notificaciones/${id}/leida`);

// Eliminar notificación
export const eliminarNotificacion = (id) => api.delete(`/admin/notificaciones/${id}`);