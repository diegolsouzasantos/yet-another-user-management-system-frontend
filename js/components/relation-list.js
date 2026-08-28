import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function renderRelationList(listEl, items, { label, onRemove, readOnly }) {
  if (!items.length) {
    listEl.replaceChildren(createEl('li', { className: 'detail-empty', textContent: t('common.noResults') }));
    return;
  }

  listEl.replaceChildren(...items.map((item) => {
    const row = createEl('li', {}, [createEl('span', { textContent: label(item) })]);
    if (!readOnly) {
      const button = createEl('button', { className: 'btn btn--danger', textContent: t('common.remove') });
      button.addEventListener('click', () => onRemove(item));
      row.append(button);
    }
    return row;
  }));
}

function pickerNodes(options, label, onAdd, reset) {
  const select = createEl('select');
  options.forEach((option) => select.add(new Option(label(option), option.id)));
  const confirm = createEl('button', { className: 'btn btn--primary', textContent: t('common.add') });
  const cancel = createEl('button', { className: 'btn', textContent: t('common.cancel') });
  confirm.addEventListener('click', () => select.value && onAdd(select.value));
  cancel.addEventListener('click', reset);
  return [select, confirm, cancel];
}

export function renderAddControl(containerEl, options, { label, onAdd, readOnly }) {
  containerEl.replaceChildren();
  if (readOnly || !options.length) return;

  const trigger = createEl('button', {
    className: 'btn btn--icon btn--primary', textContent: '+', title: t('common.add'),
  });
  const reset = () => containerEl.replaceChildren(trigger);
  trigger.addEventListener('click', () => {
    containerEl.replaceChildren(...pickerNodes(options, label, onAdd, reset));
  });
  reset();
}
