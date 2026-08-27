import { getSession, setTokens, clearSession } from '../auth/session.js';
import { rawRequest } from './raw-request.js';

async function tryRefresh() {
  const { refreshToken } = getSession();
  if (!refreshToken) return false;

  const response = await rawRequest('/auth/refresh', { method: 'POST', body: { refreshToken } });
  if (!response.ok) return false;

  const { data } = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return true;
}

export async function request(path, options = {}) {
  let response = await rawRequest(path, options);

  if (response.status === 401 && await tryRefresh()) {
    response = await rawRequest(path, options);
  }

  if (response.status === 401) {
    clearSession();
    window.location.href = '/pages/login/login.html';
    throw new Error('unauthenticated');
  }

  const payload = response.status === 204 ? {} : await response.json();
  if (!response.ok) {
    const error = new Error(payload.error || 'request_failed');
    error.fields = payload.fields;
    throw error;
  }

  return payload.data;
}
