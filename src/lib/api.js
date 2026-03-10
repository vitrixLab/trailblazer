import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => {
  // OAuth2 password grant expects form data
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  return api.post('/auth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const getMe = () => api.get('/auth/me');

// Events (token automatically added by interceptor)
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Photos
export const addPhoto = (eventId, file, caption) => {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) formData.append('caption', caption);
  return api.post(`/events/${eventId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePhoto = (eventId, publicId) =>
  api.delete(`/events/${eventId}/photos/${publicId}`);

export default api;