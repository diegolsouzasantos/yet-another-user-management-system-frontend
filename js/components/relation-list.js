import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';
import { iconEl } from '/design-system/icons.js';
import { openRelationPicker } from './relation-picker.js';

function labelledButton(iconName, labelKey, className) {
  const button = createEl('button', { className, type: 'button' });
  button.append(iconEl(iconName, { size: 16 }), createEl('span', { textContent: t(labelKey) }));
  return button;
}

export function renderRelationList(listEl, items, { label, onRemove, readOnly }) {
  if (!items.length) {
    listEl.replaceChildren(createEl('li', { className: 'detail-empty', textContent: t('common.noResults') }));
    return;
  }

  listEl.replaceChildren(...items.map((item) => {
    const row = createEl('li', {}, [createEl('span', { textContent: label(item) })]);
    if (!readOnly) {
      const button = labelledButton('trash', 'common.remove', 'btn btn--sm btn--danger');
      button.addEventListener('click', () => onRemove(item));
      row.append(button);
    }
    return row;
  }));
}

export function renderAddControl(containerEl, options, {
  label, onAdd, readOnly, pickerTitle,
}) {
  containerEl.replaceChildren();
  if (readOnly || !options.length) return;

  const trigger = labelledButton('plus', 'common.add', 'btn btn--sm btn--primary');
  trigger.addEventListener('click', async () => {
    const ids = await openRelationPicker({
      title: pickerTitle || t('common.add'),
      items: options,
      label,
    });
    if (ids && ids.length) onAdd(ids);
  });
  containerEl.replaceChildren(trigger);
}
