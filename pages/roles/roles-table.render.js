import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

function buildActions(role, { onEdit, onDelete }) {
  if (role.isSystemRole) {
    return createEl('span', { textContent: t('roles.system') });
  }

  const editBtn = createEl('button', { className: 'btn', textContent: t('common.edit') });
  const deleteBtn = createEl('button', { className: 'btn btn--danger', textContent: t('common.delete') });
  editBtn.addEventListener('click', () => onEdit(role));
  deleteBtn.addEventListener('click', () => onDelete(role));
  return createEl('span', {}, [editBtn, deleteBtn]);
}

function buildRow(role, actions) {
  return createEl('tr', {}, [
    createEl('td', { textContent: role.name }),
    createEl('td', { textContent: role.description || '' }),
    createEl('td', {}, [buildActions(role, actions)]),
  ]);
}

export function renderRolesTable(tbodyEl, roles, actions) {
  tbodyEl.replaceChildren(...roles.map((role) => buildRow(role, actions)));
}
