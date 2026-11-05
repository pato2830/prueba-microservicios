import { usersApi } from './api';

// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await usersApi.get('/users');
  return response.data;
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
  const response = await usersApi.get(`/users/${id}`);
  return response.data;
};

// Crear un usuario
export const createUser = async (userData) => {
  const response = await usersApi.post('/users', userData);
  return response.data;
};

// Actualizar un usuario
export const updateUser = async (id, userData) => {
  const response = await usersApi.put(`/users/${id}`, userData);
  return response.data;
};

// Eliminar un usuario
export const deleteUser = async (id) => {
  const response = await usersApi.delete(`/users/${id}`);
  return response.data;
};