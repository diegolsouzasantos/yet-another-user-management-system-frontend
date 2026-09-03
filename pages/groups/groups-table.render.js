import { createEl } from '../../js/utils/dom.js';
import { formatDateOnly } from '../../js/utils/format-date.js';
import { rowActionsCell } from '../../js/components/action-buttons.js';

export const GROUP_COLUMNS = [
  { key: 'groups.name', field: 'name' },
  { key: 'groups.description' },
  { key: 'common.createdAt', field: 'createdAt' },
  { key: 'common.updatedAt', field: 'updatedAt' },
  { key: 'common.actions' },
];

export const GROUP_FILTER_FIELDS = [
  { field: 'name', labelKey: 'groups.name', type: 'text' },
  { field: 'description', labelKey: 'groups.description', type: 'text' },
  { field: 'createdAt', labelKey: 'common.createdAt', type: 'date' },
];

function buildRow(group, { onEdit, onDelete }) {
  const link = createEl('a', {
    href: `/pages/groups/group-detail.html?id=${group.id}`,
    textContent: group.name,
  });

  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: group.description || '' }),
    createEl('td', { textContent: formatDateOnly(group.createdAt) }),
    createEl('td', { textContent: formatDateOnly(group.updatedAt) }),
    rowActionsCell([
      { labelKey: 'common.edit', icon: 'pencil', onSelect: () => onEdit(group) },
      { labelKey: 'common.delete', icon: 'trash', variant: 'danger', onSelect: () => onDelete(group) },
    ]),
  ]);
}

export function renderGroupsTable(tbodyEl, groups, actions) {
  tbodyEl.replaceChildren(...groups.map((group) => buildRow(group, actions)));
}
