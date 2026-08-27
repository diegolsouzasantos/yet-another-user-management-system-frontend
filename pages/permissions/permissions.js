import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { renderPagination } from '../../js/components/pagination.js';
import { renderTableHead } from '../../js/components/table-head.js';
import { showToast } from '../../js/components/toast.js';
import { listPermissions, removePermission } from '../../js/api/permissions.api.js';
import { renderPermissionsTable } from './permissions-table.render.js';
import { initPermissionDialog } from './permissions-dialog.js';

const HEAD_KEYS = ['permissions.resource', 'permissions.action', 'permissions.description', 'common.actions'];
let page = 1;
let permissionDialog;

async function load() {
  const { permissions, meta } = await listPermissions({ page });
  const body = document.getElementById('permissions-table-body');
  renderPermissionsTable(body, permissions, { onEdit: permissionDialog.open, onDelete });
  renderPagination(document.getElementById('pagination'), meta, (next) => { page = next; load(); });
}

async function onDelete(permission) {
  if (!window.confirm(t('permissions.confirmDelete'))) return;
  await removePermission(permission.id);
  showToast(t('common.delete'));
  load();
}

async function init() {
  const actor = await mountShell('/pages/permissions/permissions.html', 'permissions:read');
  if (!actor) return;

  applyI18n();
  renderTableHead(document.getElementById('permissions-table-head'), HEAD_KEYS);
  permissionDialog = initPermissionDialog(load);

  load();
}

init();
