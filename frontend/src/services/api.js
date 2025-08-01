import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Dirección de tu backend
});

export const registerUser = async (data) => {
  return api.post('/users/register', data);
};

export const activateUser = async (token) => {
  return api.get(`/users/activate/${token}`);
};

export const forgotPassword = async (data) => {
  return api.post('/users/forgot-password', data);
};

export const resetPassword = async (token, data) => {
  return api.post(`/users/reset-password/${token}`, data);
};

export default api;
