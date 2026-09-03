import { openModal } from '/design-system/modal.js';
import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function openRelationPicker({ title, items, label }) {
  const selected = new Set();
  const sortedItems = [...items].sort((a, b) => label(a).localeCompare(label(b)));

  const search = createEl('input', {
    type: 'text',
    className: 'list-filters__control relation-picker__search',
    placeholder: t('picker.search'),
  });
  const listEl = createEl('div', { className: 'relation-picker__list' });
  const count = createEl('p', { className: 'relation-picker__count detail-empty' });

  function updateCount() {
    count.textContent = selected.size ? t('picker.selected', { count: selected.size }) : '';
  }

  function renderList() {
    const query = search.value.trim().toLowerCase();
    const filtered = query
      ? sortedItems.filter((item) => label(item).toLowerCase().includes(query))
      : sortedItems;

    if (!filtered.length) {
      listEl.replaceChildren(createEl('p', { className: 'detail-empty', textContent: t('common.noResults') }));
      return;
    }

    listEl.replaceChildren(...filtered.map((item) => {
      const checkbox = createEl('input', { type: 'checkbox', checked: selected.has(item.id) });
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selected.add(item.id); else selected.delete(item.id);
        updateCount();
      });
      return createEl('label', { className: 'relation-picker__row' }, [
        checkbox,
        createEl('span', { textContent: label(item) }),
      ]);
    }));
  }

  search.addEventListener('input', renderList);
  renderList();
  updateCount();

  const content = createEl('div', { className: 'relation-picker' }, [search, listEl, count]);

  return openModal({
    title,
    content,
    wide: true,
    confirmLabel: t('common.add'),
    cancelLabel: t('common.cancel'),
  }).then((confirmed) => (confirmed ? [...selected] : null));
}
