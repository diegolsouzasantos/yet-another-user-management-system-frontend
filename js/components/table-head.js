import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function renderTableHead(rowEl, keys) {
  rowEl.replaceChildren(...keys.map((key) => createEl('th', { textContent: t(key) })));
}
