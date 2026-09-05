import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { decorateButton, setControlAvailability } from '../../js/components/action-buttons.js';
import { hasPermission } from '../../js/auth/permissions.js';
import { listGroups, removeGroup } from '../../js/api/groups.api.js';
import { renderGroupsTable, GROUP_COLUMNS, GROUP_FILTER_FIELDS } from './groups-table.render.js';
import { initGroupDialog } from './groups-dialog.js';

let list;
let groupDialog;
let canEdit = true;
let canDeleteRow = true;

const onDelete = (group) => confirmAndDelete('groups.confirmDelete', () => removeGroup(group.id))
  .then((done) => done && list.reload());

const renderRows = (rows, extra) => renderGroupsTable(document.getElementById('groups-table-body'), rows, {
  onEdit: (group) => groupDialog.open(group), onDelete, canEdit, canDeleteRow, ...extra,
});

async function init() {
  const actor = await mountShell('/pages/groups/groups.html', 'groups:read');
  if (!actor) return;

  applyI18n();
  decorateButton('create-btn', 'plus');

  canEdit = hasPermission(actor, 'groups:update');
  canDeleteRow = hasPermission(actor, 'groups:delete');
  setControlAvailability('create-btn', hasPermission(actor, 'groups:create'));

  groupDialog = initGroupDialog(() => list.reload());

  list = createSortableList({
    headEl: document.getElementById('groups-table-head'),
    pagingEl: document.getElementById('pagination'),
    filtersEl: document.getElementById('list-filters'),
    toolbarEl: document.getElementById('list-toolbar'),
    selectable: true,
    canDelete: true,
    deleteEnabled: canDeleteRow,
    resourceBasePath: '/groups',
    columns: GROUP_COLUMNS,
    filterFields: GROUP_FILTER_FIELDS,
    defaultField: 'name',
    fetchPage: (params) => listGroups(params).then((res) => ({ rows: res.groups, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
