import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

function buildRow(user, { onEdit, onDelete }) {
  const editBtn = createEl('button', { className: 'btn', textContent: t('common.edit') });
  const deleteBtn = createEl('button', { className: 'btn btn--danger', textContent: t('common.delete') });
  editBtn.addEventListener('click', () => onEdit(user));
  deleteBtn.addEventListener('click', () => onDelete(user));

  return createEl('tr', {}, [
    createEl('td', { textContent: `${user.firstName} ${user.lastName}` }),
    createEl('td', { textContent: user.email }),
    createEl('td', { textContent: user.roleName }),
    createEl('td', { textContent: user.isOwner ? t('common.yes') : t('common.no') }),
    createEl('td', {}, [editBtn, deleteBtn]),
  ]);
}

export function renderUsersTable(tbodyEl, users, actions) {
  tbodyEl.replaceChildren(...users.map((user) => buildRow(user, actions)));
}
