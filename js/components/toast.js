import { createEl } from '../utils/dom.js';

let container;

function getContainer() {
  if (!container) {
    container = createEl('div', { className: 'toast-container' });
    document.body.append(container);
  }
  return container;
}

export function showToast(message, variant = 'success') {
  const toast = createEl('div', { className: `toast toast--${variant}`, textContent: message });
  getContainer().append(toast);
  setTimeout(() => toast.remove(), 4000);
}
