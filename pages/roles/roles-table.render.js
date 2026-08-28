import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

export const ROLE_COLUMNS = [
  { key: 'roles.name', field: 'name' },
  { key: 'roles.description' },
  { key: 'common.actions' },
];

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
  const link = createEl('a', {
    href: `/pages/roles/role-detail.html?id=${role.id}`,
    textContent: role.name,
  });
  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: role.description || '' }),
    createEl('td', {}, [buildActions(role, actions)]),
  ]);
}

export function renderRolesTable(tbodyEl, roles, actions) {
  tbodyEl.replaceChildren(...roles.map((role) => buildRow(role, actions)));
}
