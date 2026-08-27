import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function renderPagination(el, meta, onPageChange) {
  const prevBtn = createEl('button', { className: 'btn', textContent: '<', disabled: meta.page <= 1 });
  const nextBtn = createEl('button', { className: 'btn', textContent: '>', disabled: meta.page >= meta.totalPages });
  const label = createEl('span', { textContent: t('common.page', { page: meta.page, total: meta.totalPages || 1 }) });

  prevBtn.addEventListener('click', () => onPageChange(meta.page - 1));
  nextBtn.addEventListener('click', () => onPageChange(meta.page + 1));

  el.replaceChildren(prevBtn, label, nextBtn);
}
