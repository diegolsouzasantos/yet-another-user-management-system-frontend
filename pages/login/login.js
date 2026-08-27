import { login } from '../../js/api/auth.api.js';
import { setTokens, isAuthenticated } from '../../js/auth/session.js';
import { loadLocale, applyI18n, t } from '../../js/i18n/i18n.js';

async function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const { accessToken, refreshToken } = await login(form.get('email'), form.get('password'));
    setTokens(accessToken, refreshToken);
    window.location.href = '/pages/home/home.html';
  } catch (error) {
    errorEl.textContent = error instanceof TypeError ? t('auth.connectionError') : error.message;
  }
}

async function init() {
  await loadLocale();
  applyI18n();
  if (isAuthenticated()) {
    window.location.href = '/pages/home/home.html';
    return;
  }
  document.getElementById('login-form').addEventListener('submit', handleSubmit);
}

init();
