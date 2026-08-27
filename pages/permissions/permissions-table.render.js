import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

function buildRow(permission, { onEdit, onDelete }) {
  const editBtn = createEl('button', { className: 'btn', textContent: t('common.edit') });
  const deleteBtn = createEl('button', { className: 'btn btn--danger', textContent: t('common.delete') });
  editBtn.addEventListener('click', () => onEdit(permission));
  deleteBtn.addEventListener('click', () => onDelete(permission));

  return createEl('tr', {}, [
    createEl('td', { textContent: permission.resource }),
    createEl('td', { textContent: permission.action }),
    createEl('td', { textContent: permission.description || '' }),
    createEl('td', {}, [editBtn, deleteBtn]),
  ]);
}

export function renderPermissionsTable(tbodyEl, permissions, actions) {
  tbodyEl.replaceChildren(...permissions.map((permission) => buildRow(permission, actions)));
}
