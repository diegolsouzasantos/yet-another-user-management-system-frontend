import { t } from './i18n.js';

export function tData(namespace, value) {
  if (value === null || value === undefined || value === '') return value;
  const key = `${namespace}.${value}`;
  const translated = t(key);
  return translated === key ? value : translated;
}
