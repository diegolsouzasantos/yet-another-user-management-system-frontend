import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { renderPagination } from '../../js/components/pagination.js';
import { renderTableHead } from '../../js/components/table-head.js';
import { showToast } from '../../js/components/toast.js';
import { listRoles, removeRole } from '../../js/api/roles.api.js';
import { renderRolesTable } from './roles-table.render.js';
import { initRoleDialog } from './roles-dialog.js';

const HEAD_KEYS = ['roles.name', 'roles.description', 'common.actions'];
let page = 1;
let roleDialog;

async function load() {
  const { roles, meta } = await listRoles({ page });
  renderRolesTable(document.getElementById('roles-table-body'), roles, { onEdit: roleDialog.open, onDelete });
  renderPagination(document.getElementById('pagination'), meta, (next) => { page = next; load(); });
}

async function onDelete(role) {
  if (!window.confirm(t('roles.confirmDelete'))) return;
  await removeRole(role.id);
  showToast(t('common.delete'));
  load();
}

async function init() {
  const actor = await mountShell('/pages/roles/roles.html', 'roles:read');
  if (!actor) return;

  applyI18n();
  renderTableHead(document.getElementById('roles-table-head'), HEAD_KEYS);
  roleDialog = initRoleDialog(load);

  load();
}

init();
