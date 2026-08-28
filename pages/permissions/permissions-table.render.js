import { createEl } from '../../js/utils/dom.js';

export const PERMISSION_COLUMNS = [
  { key: 'permissions.resource', field: 'resource' },
  { key: 'permissions.action', field: 'action' },
  { key: 'permissions.description' },
];

function buildRow(permission) {
  return createEl('tr', {}, [
    createEl('td', { textContent: permission.resource }),
    createEl('td', { textContent: permission.action }),
    createEl('td', { textContent: permission.description || '' }),
  ]);
}

export function renderPermissionsTable(tbodyEl, permissions) {
  tbodyEl.replaceChildren(...permissions.map(buildRow));
}
