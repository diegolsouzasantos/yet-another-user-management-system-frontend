import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { formatDateOnly } from '../../js/utils/format-date.js';
import { rowActionsCell } from '../../js/components/action-buttons.js';

export const USER_COLUMNS = [
  { key: 'users.firstName', field: 'firstName' },
  { key: 'users.email', field: 'email' },
  { key: 'users.role' },
  { key: 'users.status' },
  { key: 'common.createdAt', field: 'createdAt' },
  { key: 'common.updatedAt', field: 'updatedAt' },
  { key: 'common.actions' },
];

export const USER_FILTER_FIELDS = [
  { field: 'firstName', labelKey: 'users.firstName', type: 'text' },
  { field: 'lastName', labelKey: 'users.lastName', type: 'text' },
  { field: 'email', labelKey: 'users.email', type: 'text' },
  { field: 'roleId', labelKey: 'users.role', type: 'relation', optionsKey: 'roles' },
  { field: 'groupId', labelKey: 'users.groups', type: 'relation', optionsKey: 'groups' },
  { field: 'isActive', labelKey: 'users.active', type: 'boolean' },
  { field: 'createdAt', labelKey: 'common.createdAt', type: 'date' },
];

function buildRow(user, { onEdit, onDelete }) {
  const link = createEl('a', {
    href: `/pages/users/user-detail.html?id=${user.id}`,
    textContent: `${user.firstName} ${user.lastName}`,
  });

  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: user.email }),
    createEl('td', { textContent: tData('systemRoles', user.roleName) }),
    createEl('td', { textContent: user.isActive ? t('users.active') : t('users.inactive') }),
    createEl('td', { textContent: formatDateOnly(user.createdAt) }),
    createEl('td', { textContent: formatDateOnly(user.updatedAt) }),
    rowActionsCell([
      { labelKey: 'common.edit', icon: 'pencil', onSelect: () => onEdit(user) },
      { labelKey: 'common.delete', icon: 'trash', variant: 'danger', onSelect: () => onDelete(user) },
    ]),
  ]);
}

export function renderUsersTable(tbodyEl, users, actions) {
  tbodyEl.replaceChildren(...users.map((user) => buildRow(user, actions)));
}
