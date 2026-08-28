import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

export const USER_COLUMNS = [
  { key: 'users.firstName', field: 'firstName' },
  { key: 'users.email', field: 'email' },
  { key: 'users.role' },
  { key: 'users.owner', field: 'isOwner' },
  { key: 'common.actions' },
];

function buildRow(user, { onEdit, onDelete }) {
  const link = createEl('a', {
    href: `/pages/users/user-detail.html?id=${user.id}`,
    textContent: `${user.firstName} ${user.lastName}`,
  });
  const editBtn = createEl('button', { className: 'btn', textContent: t('common.edit') });
  const deleteBtn = createEl('button', { className: 'btn btn--danger', textContent: t('common.delete') });
  editBtn.addEventListener('click', () => onEdit(user));
  deleteBtn.addEventListener('click', () => onDelete(user));

  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: user.email }),
    createEl('td', { textContent: user.roleName }),
    createEl('td', { textContent: user.isOwner ? t('common.yes') : t('common.no') }),
    createEl('td', {}, [editBtn, deleteBtn]),
  ]);
}

export function renderUsersTable(tbodyEl, users, actions) {
  tbodyEl.replaceChildren(...users.map((user) => buildRow(user, actions)));
}
