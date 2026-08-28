import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { listRoles, removeRole } from '../../js/api/roles.api.js';
import { renderRolesTable, ROLE_COLUMNS } from './roles-table.render.js';
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
  roleDialog = initRoleDialog(() => list.reload());

  list = createSortableList({
    headEl: document.getElementById('roles-table-head'),
    pagingEl: document.getElementById('pagination'),
    columns: ROLE_COLUMNS,
    defaultField: 'name',
    fetchPage: (params) => listRoles(params).then((res) => ({ rows: res.roles, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
