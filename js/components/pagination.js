import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function renderPagination(el, meta, onPageChange, pageSize) {
  const prevBtn = createEl('button', { className: 'btn btn--sm', textContent: '<', disabled: meta.page <= 1 });
  const nextBtn = createEl('button', {
    className: 'btn btn--sm', textContent: '>', disabled: meta.page >= meta.totalPages,
  });
  const label = createEl('span', { textContent: t('common.page', { page: meta.page, total: meta.totalPages || 1 }) });

  prevBtn.addEventListener('click', () => onPageChange(meta.page - 1));
  nextBtn.addEventListener('click', () => onPageChange(meta.page + 1));

  const children = [prevBtn, label, nextBtn];

  if (pageSize) {
    const select = createEl('select', { className: 'pagination__size' });
    pageSize.sizes.forEach((size) => select.add(new Option(String(size), String(size), false, size === pageSize.value)));
    select.addEventListener('change', () => pageSize.onChange(Number(select.value)));
    children.push(createEl('label', { className: 'pagination__size-label', textContent: t('list.perPage') }, [select]));
  }

  el.replaceChildren(...children);
}
