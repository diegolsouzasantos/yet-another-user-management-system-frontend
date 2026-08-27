import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { renderPagination } from '../../js/components/pagination.js';
import { renderTableHead } from '../../js/components/table-head.js';
import { showToast } from '../../js/components/toast.js';
import { listUsers, removeUser } from '../../js/api/users.api.js';
import { listRoles } from '../../js/api/roles.api.js';
import { renderUsersTable } from './users-table.render.js';
import { fillRoleOptions } from './users-form.render.js';
import { initUserDialog } from './users-dialog.js';
import { initOwnerTransfer } from './users-transfer.js';

const HEAD_KEYS = ['users.firstName', 'users.email', 'users.role', 'users.owner', 'common.actions'];
let page = 1;
let userDialog;

async function load() {
  const { users, meta } = await listUsers({ page });
  renderUsersTable(document.getElementById('users-table-body'), users, { onEdit: userDialog.open, onDelete });
  renderPagination(document.getElementById('pagination'), meta, (next) => { page = next; load(); });
}

async function onDelete(user) {
  if (!window.confirm(t('users.confirmDelete'))) return;
  await removeUser(user.id);
  showToast(t('common.delete'));
  load();
}

async function init() {
  const actor = await mountShell('/pages/users/users.html', 'users:read');
  if (!actor) return;

  applyI18n();
  renderTableHead(document.getElementById('users-table-head'), HEAD_KEYS);

  const { roles } = await listRoles({ limit: 100 });
  fillRoleOptions(document.getElementById('user-form').elements.roleId, roles);

  userDialog = initUserDialog(load);
  initOwnerTransfer(actor);

  load();
}

init();
