import { getLocale } from '../i18n/i18n.js';

export function formatDate(value) {
  return value ? new Date(value).toLocaleString(getLocale()) : '';
}

export function formatDateOnly(value) {
  return value ? new Date(value).toLocaleDateString(getLocale()) : '';
}
