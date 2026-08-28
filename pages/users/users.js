import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { listUsers, removeUser } from '../../js/api/users.api.js';
import { listRoles } from '../../js/api/roles.api.js';
import { renderUsersTable, USER_COLUMNS } from './users-table.render.js';
import { fillRoleOptions } from './users-form.render.js';
import { initUserDialog } from './users-dialog.js';
import { initOwnerTransfer } from './users-transfer.js';

let list;
let userDialog;

const onDelete = (user) => confirmAndDelete('users.confirmDelete', () => removeUser(user.id))
  .then((done) => done && list.reload());

const renderRows = (rows) => renderUsersTable(document.getElementById('users-table-body'), rows, {
  onEdit: (user) => userDialog.open(user), onDelete,
});

async function init() {
  const actor = await mountShell('/pages/users/users.html', 'users:read');
  if (!actor) return;

  applyI18n();
  const { roles } = await listRoles({ limit: 100 });
  fillRoleOptions(document.getElementById('user-form').elements.roleId, roles);
  userDialog = initUserDialog(() => list.reload());
  initOwnerTransfer(actor);

  list = createSortableList({
    headEl: document.getElementById('users-table-head'),
    pagingEl: document.getElementById('pagination'),
    columns: USER_COLUMNS,
    defaultField: 'firstName',
    fetchPage: (params) => listUsers(params).then((res) => ({ rows: res.users, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
