import { resetPassword } from '../../js/api/auth.api.js';
import { loadLocale, applyI18n, t } from '../../js/i18n/i18n.js';

const token = new URLSearchParams(window.location.search).get('token') || '';

async function handleSubmit(event) {
  event.preventDefault();
  const messageEl = document.getElementById('reset-message');
  const password = new FormData(event.target).get('password');

  try {
    await resetPassword(token, password);
    messageEl.textContent = t('auth.resetDone');
    event.target.querySelector('button').disabled = true;
  } catch (error) {
    messageEl.textContent = error instanceof TypeError ? t('auth.connectionError') : error.message;
  }
}

async function init() {
  await loadLocale();
  applyI18n();
  document.getElementById('reset-form').addEventListener('submit', handleSubmit);
}

init();
