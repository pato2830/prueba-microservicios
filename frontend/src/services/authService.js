import { authApi } from './api';

export const login = async (email, password) => {
  const response = await authApi.post('/auth/login', {
    email,
    password,
  });

  return response.data;
};