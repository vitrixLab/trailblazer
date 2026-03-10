import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
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
export const loginAdmin = (email, password) =>
  api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

// Events
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Photos
export const addPhoto = (eventId, data) =>
  api.post(`/events/${eventId}/photos`, data);
export const deletePhoto = (eventId, photoId) =>
  api.delete(`/events/${eventId}/photos/${photoId}`);

// Cloudinary
export const getCloudinarySignature = (folder = 'trailblazers/events') =>
  api.get(`/cloudinary/signature?folder=${folder}`);

export const uploadToCloudinary = async (file, folder = 'trailblazers/events') => {
  const { data: sig } = await getCloudinarySignature(folder);
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.api_key);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
    form
  );
  return res.data;
};

export default api;
