import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';

export const GROUP_COLUMNS = [
  { key: 'groups.name', field: 'name' },
  { key: 'groups.description' },
  { key: 'common.actions' },
];

function buildRow(group, { onEdit, onDelete }) {
  const link = createEl('a', {
    href: `/pages/groups/group-detail.html?id=${group.id}`,
    textContent: group.name,
  });
  const editBtn = createEl('button', { className: 'btn', textContent: t('common.edit') });
  const deleteBtn = createEl('button', { className: 'btn btn--danger', textContent: t('common.delete') });
  editBtn.addEventListener('click', () => onEdit(group));
  deleteBtn.addEventListener('click', () => onDelete(group));

  return createEl('tr', {}, [
    createEl('td', {}, [link]),
    createEl('td', { textContent: group.description || '' }),
    createEl('td', {}, [editBtn, deleteBtn]),
  ]);
}

export function renderGroupsTable(tbodyEl, groups, actions) {
  tbodyEl.replaceChildren(...groups.map((group) => buildRow(group, actions)));
}
