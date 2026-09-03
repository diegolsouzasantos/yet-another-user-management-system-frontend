import { API_BASE_URL } from '../../config.js';
import { getSession } from '../auth/session.js';
import { getLocale } from '../i18n/i18n.js';
import { request } from './http-client.js';

export async function exportCsv(basePath, params = {}) {
  const url = new URL(`${API_BASE_URL}${basePath}/export`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const { accessToken } = getSession();
  const headers = { 'X-Locale': getLocale() };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(url, { headers });

  if (!response.ok && response.status !== 202) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'export_failed');
  }

  if ((response.headers.get('content-type') || '').includes('application/json')) {
    const { data } = await response.json();
    return { emailed: true, ...data };
  }

  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^";]+)"?/);
  return {
    emailed: false,
    blob: await response.blob(),
    filename: match ? match[1] : 'export.csv',
  };
}

export function bulkDelete(basePath, ids) {
  return request(basePath, { method: 'DELETE', body: { ids } });
}

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
