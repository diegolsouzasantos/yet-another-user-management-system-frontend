import { createEl } from '../../js/utils/dom.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { formatDateOnly } from '../../js/utils/format-date.js';

export const PERMISSION_COLUMNS = [
  { key: 'permissions.resource', field: 'resource' },
  { key: 'permissions.action', field: 'action' },
  { key: 'permissions.description' },
  { key: 'common.createdAt', field: 'createdAt' },
  { key: 'common.updatedAt', field: 'updatedAt' },
];

export const PERMISSION_FILTER_FIELDS = [
  { field: 'resource', labelKey: 'permissions.resource', type: 'text' },
  { field: 'action', labelKey: 'permissions.action', type: 'text' },
  { field: 'description', labelKey: 'permissions.description', type: 'text' },
];

function buildRow(permission) {
  const link = createEl('a', {
    href: `/pages/permissions/permission-detail.html?id=${permission.id}`,
    textContent: tData('resources', permission.resource),
  });

  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: tData('actions', permission.action) }),
    createEl('td', { textContent: permission.description || '' }),
    createEl('td', { textContent: formatDateOnly(permission.createdAt) }),
    createEl('td', { textContent: formatDateOnly(permission.updatedAt) }),
  ]);
}

export function renderPermissionsTable(tbodyEl, permissions) {
  tbodyEl.replaceChildren(...permissions.map(buildRow));
}
