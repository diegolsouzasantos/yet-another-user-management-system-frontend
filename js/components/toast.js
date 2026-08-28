import { createEl } from '../utils/dom.js';

const ICONS = { success: '✓', error: '✕' };
let container;

function getContainer() {
  if (!container) {
    container = createEl('div', { className: 'toast-container' });
    document.body.append(container);
  }
  return container;
}

export function showToast(message, variant = 'success') {
  const toast = createEl('div', { className: `toast toast--${variant}`, role: 'status' }, [
    createEl('span', { className: 'toast__icon', textContent: ICONS[variant] || '' }),
    createEl('span', { textContent: message }),
  ]);
  getContainer().append(toast);

  setTimeout(() => toast.classList.add('toast--out'), 3400);
  setTimeout(() => toast.remove(), 3700);
}
