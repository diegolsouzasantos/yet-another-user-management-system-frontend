import { resetPassword } from '../../js/api/auth.api.js';
import { loadLocale, applyI18n, t } from '../../js/i18n/i18n.js';
import { attachFormValidation, validators } from '../../js/utils/form-validation.js';

const token = new URLSearchParams(window.location.search).get('token') || '';

let validator;

async function handleSubmit(event) {
  event.preventDefault();
  if (!validator.validateAll()) return;

  const messageEl = document.getElementById('reset-message');
  const password = new FormData(event.target).get('password');

  try {
    await resetPassword(token, password);
    messageEl.textContent = t('auth.resetDone');
    event.target.querySelector('button').disabled = true;
  } catch (error) {
    if (error.fields && validator.applyServerErrors(error.fields)) return;
    messageEl.textContent = error instanceof TypeError ? t('auth.connectionError') : error.message;
  }
}

async function init() {
  await loadLocale();
  applyI18n();
  const form = document.getElementById('reset-form');
  validator = attachFormValidation(form, { password: validators.password });
  form.addEventListener('submit', handleSubmit);
}

init();
