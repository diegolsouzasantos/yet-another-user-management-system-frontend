import { t } from '../i18n/i18n.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL = /[^A-Za-z0-9]/;

export const validators = {
  email: (value) => (EMAIL.test(String(value).trim()) ? null : 'validation.emailInvalid'),
  requiredText: (value) => (String(value).trim() ? null : 'validation.required'),
  requiredSelect: (value) => (value ? null : 'validation.required'),
  password: (value) => {
    if (String(value).length < 8) return 'validation.passwordShort';
    if (!SPECIAL.test(value)) return 'validation.passwordSpecial';
    return null;
  },
  optionalPassword: (value) => (value ? validators.password(value) : null),
};

function wrapperOf(input) {
  return input.closest('.form-field') || input.parentElement;
}

function paint(input, message) {
  const wrapper = wrapperOf(input);
  if (!wrapper) return;
  let hint = wrapper.querySelector('.form-field__error');
  if (message) {
    wrapper.classList.add('form-field--invalid');
    if (!hint) {
      hint = document.createElement('small');
      hint.className = 'form-field__error';
      wrapper.append(hint);
    }
    hint.textContent = message;
  } else {
    wrapper.classList.remove('form-field--invalid');
    if (hint) hint.textContent = '';
  }
}

export function attachFormValidation(formEl, rules) {
  const names = Object.keys(rules);

  const runField = (name) => {
    const input = formEl.elements[name];
    if (!input) return null;
    const fns = Array.isArray(rules[name]) ? rules[name] : [rules[name]];
    let key = null;
    for (const fn of fns) {
      key = fn(input.value, formEl);
      if (key) break;
    }
    paint(input, key ? t(key) : null);
    return key;
  };

  names.forEach((name) => {
    const input = formEl.elements[name];
    if (!input) return;
    const handler = () => runField(name);
    input.addEventListener('input', handler);
    input.addEventListener('blur', handler);
    if (input.tagName === 'SELECT') input.addEventListener('change', handler);
  });

  return {
    validateAll() {
      let firstInvalid = null;
      names.forEach((name) => {
        if (runField(name) && !firstInvalid) firstInvalid = formEl.elements[name];
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    },
    applyServerErrors(fields) {
      let firstInvalid = null;
      Object.entries(fields || {}).forEach(([name, message]) => {
        const input = formEl.elements[name];
        if (!input) return;
        paint(input, message);
        if (!firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) firstInvalid.focus();
      return Boolean(firstInvalid);
    },
    clear() {
      names.forEach((name) => {
        const input = formEl.elements[name];
        if (input) paint(input, null);
      });
    },
  };
}
