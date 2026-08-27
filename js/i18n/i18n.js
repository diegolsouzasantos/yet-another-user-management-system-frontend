const STORAGE_KEY = 'yaums.locale';
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'pt-BR', 'es'];

let bundle = {};

export function getLocale() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LOCALE;
}

function resolve(key, vars) {
  const template = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), bundle) || key;
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, name) => (vars && name in vars ? vars[name] : match));
}

export async function loadLocale(locale = getLocale()) {
  const resolved = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const response = await fetch(`/js/i18n/locales/${resolved}.json`);
  bundle = await response.json();
  localStorage.setItem(STORAGE_KEY, resolved);
}

export function t(key, vars) {
  return resolve(key, vars);
}

export function supportedLocales() {
  return SUPPORTED_LOCALES;
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}
