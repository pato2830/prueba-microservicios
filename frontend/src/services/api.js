import axios from 'axios';

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Enviar automáticamente el JWT
usersApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Manejar tokens inválidos o expirados
usersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);