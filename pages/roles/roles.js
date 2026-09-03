import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { decorateButton } from '../../js/components/action-buttons.js';
import { listRoles, removeRole } from '../../js/api/roles.api.js';
import { renderRolesTable, ROLE_COLUMNS, ROLE_FILTER_FIELDS } from './roles-table.render.js';
import { initRoleDialog } from './roles-dialog.js';

let list;
let roleDialog;

const onDelete = (role) => confirmAndDelete('roles.confirmDelete', () => removeRole(role.id))
  .then((done) => done && list.reload());

const renderRows = (rows) => renderRolesTable(document.getElementById('roles-table-body'), rows, {
  onEdit: (role) => roleDialog.open(role), onDelete,
});

async function init() {
  const actor = await mountShell('/pages/roles/roles.html', 'roles:read');
  if (!actor) return;

  applyI18n();
  decorateButton('create-btn', 'plus');
  roleDialog = initRoleDialog(() => list.reload());

  list = createSortableList({
    headEl: document.getElementById('roles-table-head'),
    pagingEl: document.getElementById('pagination'),
    filtersEl: document.getElementById('list-filters'),
    toolbarEl: document.getElementById('list-toolbar'),
    selectable: true,
    canDelete: true,
    resourceBasePath: '/roles',
    columns: ROLE_COLUMNS,
    filterFields: ROLE_FILTER_FIELDS,
    defaultField: 'name',
    fetchPage: (params) => listRoles(params).then((res) => ({ rows: res.roles, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
