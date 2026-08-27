import { request } from './http-client.js';

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function me() {
  return request('/auth/me');
}

export function logout(refreshToken) {
  return request('/auth/logout', { method: 'POST', body: { refreshToken } });
}
