import { api } from './client';

export function login(email, senha) {
  return api.post('/auth/login', { email, senha });
}

export function logout(refreshToken) {
  if (!refreshToken) return Promise.resolve();
  return api.post('/auth/logout', { refreshToken }).catch(() => {});
}
