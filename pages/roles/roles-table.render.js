import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { formatDateOnly } from '../../js/utils/format-date.js';
import { rowActionsCell } from '../../js/components/action-buttons.js';

export const ROLE_COLUMNS = [
  { key: 'roles.name', field: 'name' },
  { key: 'roles.description' },
  { key: 'common.createdAt', field: 'createdAt' },
  { key: 'common.updatedAt', field: 'updatedAt' },
  { key: 'common.actions' },
];

export const ROLE_FILTER_FIELDS = [
  { field: 'name', labelKey: 'roles.name', type: 'text' },
  { field: 'description', labelKey: 'roles.description', type: 'text' },
  { field: 'isSystemRole', labelKey: 'roles.system', type: 'boolean' },
  { field: 'createdAt', labelKey: 'common.createdAt', type: 'date' },
];

function buildRow(role, {
  onEdit, onDelete, canEdit = true, canDeleteRow = true, selectionCellFor,
}) {
  const link = createEl('a', {
    href: `/pages/roles/role-detail.html?id=${role.id}`,
    textContent: tData('systemRoles', role.name),
  });

  const actionsCell = role.isSystemRole
    ? createEl('td', { className: 'cell-actions' }, [
      createEl('span', { className: 'detail-empty', textContent: t('roles.system') }),
    ])
    : rowActionsCell([
      {
        labelKey: 'common.edit', icon: 'pencil', onSelect: () => onEdit(role), disabled: !canEdit,
      },
      {
        labelKey: 'common.delete', icon: 'trash', variant: 'danger', onSelect: () => onDelete(role), disabled: !canDeleteRow,
      },
    ]);

  const selectionCell = selectionCellFor && selectionCellFor(role);

  return createEl('tr', {}, [
    ...(selectionCell ? [selectionCell] : []),
    createEl('td', {}, [link]),
    createEl('td', { textContent: role.description || '' }),
    createEl('td', { textContent: formatDateOnly(role.createdAt) }),
    createEl('td', { textContent: formatDateOnly(role.updatedAt) }),
    actionsCell,
  ]);
}

export function renderRolesTable(tbodyEl, roles, actions) {
  tbodyEl.replaceChildren(...roles.map((role) => buildRow(role, actions)));
}
