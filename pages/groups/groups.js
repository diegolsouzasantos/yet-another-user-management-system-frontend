import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { listGroups, removeGroup } from '../../js/api/groups.api.js';
import { renderGroupsTable, GROUP_COLUMNS } from './groups-table.render.js';
import { initGroupDialog } from './groups-dialog.js';

let list;
let groupDialog;

const onDelete = (group) => confirmAndDelete('groups.confirmDelete', () => removeGroup(group.id))
  .then((done) => done && list.reload());

const renderRows = (rows) => renderGroupsTable(document.getElementById('groups-table-body'), rows, {
  onEdit: (group) => groupDialog.open(group), onDelete,
});

async function init() {
  const actor = await mountShell('/pages/groups/groups.html', 'groups:read');
  if (!actor) return;

  applyI18n();
  groupDialog = initGroupDialog(() => list.reload());

  list = createSortableList({
    headEl: document.getElementById('groups-table-head'),
    pagingEl: document.getElementById('pagination'),
    columns: GROUP_COLUMNS,
    defaultField: 'name',
    fetchPage: (params) => listGroups(params).then((res) => ({ rows: res.groups, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
