import { API_BASE_URL } from '../../config.js';
import { getSession } from '../auth/session.js';
import { getLocale } from '../i18n/i18n.js';

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });
  return url;
}

export async function rawRequest(path, { method = 'GET', body, params } = {}) {
  const { accessToken } = getSession();
  const headers = { 'Content-Type': 'application/json', 'X-Locale': getLocale() };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return fetch(buildUrl(path, params), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}
