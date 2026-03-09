import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add CSRF token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('csrftoken');
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Forbidden - check permissions');
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - please login');
    }
    return Promise.reject(error);
  }
);

// Auth helpers (basic for MVP)
export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout/');
};

// Leads APIs
export const getLeads = async () => {
  const response = await api.get('/leads/');
  return response.data;
};

export const getLead = async (id) => {
  const response = await api.get(`/leads/${id}/`);
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await api.post('/leads/', leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await api.put(`/leads/${id}/`, leadData);
  return response.data;
};

export const assignAgent = async (id, agentId) => {
  const response = await api.post(`/leads/${id}/assign/`, { agent_id: agentId });
  return response.data;
};

export const updateStage = async (id, stage) => {
  const response = await api.post(`/leads/${id}/stage/`, { stage });
  return response.data;
};

// Visits APIs
export const getVisits = async () => {
  const response = await api.get('/visits/');
  return response.data;
};

export const createVisit = async (visitData) => {
  const response = await api.post('/visits/', visitData);
  return response.data;
};

export const updateVisit = async (id, visitData) => {
  const response = await api.put(`/visits/${id}/`, visitData);
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/');
  return response.data;
};

export default api;
