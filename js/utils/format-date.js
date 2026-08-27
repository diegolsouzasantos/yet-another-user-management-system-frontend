import { getLocale } from '../i18n/i18n.js';

export function formatDate(value) {
  return new Date(value).toLocaleString(getLocale());
}
