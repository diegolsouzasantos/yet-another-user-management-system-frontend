import { requestPasswordReset } from '../../js/api/auth.api.js';
import { loadLocale, applyI18n, t } from '../../js/i18n/i18n.js';

async function handleSubmit(event) {
  event.preventDefault();
  const messageEl = document.getElementById('forgot-message');
  const email = new FormData(event.target).get('email');

  try {
    await requestPasswordReset(email);
    messageEl.textContent = t('auth.forgotDone');
    event.target.querySelector('button').disabled = true;
  } catch (error) {
    messageEl.textContent = error instanceof TypeError ? t('auth.connectionError') : error.message;
  }
}

async function init() {
  await loadLocale();
  applyI18n();
  document.getElementById('forgot-form').addEventListener('submit', handleSubmit);
}

init();
