import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { hasPermission } from '../../js/auth/permissions.js';
import { wireRelation } from '../../js/components/detail-relations.js';
import { withLoading } from '../../js/components/loading.js';
import { iconButton, decorateButton } from '../../js/components/action-buttons.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import * as roles from '../../js/api/roles.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';
import { initRoleDialog } from './roles-dialog.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const permLabel = (permission) => `${tData('resources', permission.resource)}:${tData('actions', permission.action)}`;

let actor;
let roleDialog;

function onDeleteRole(role) {
  confirmAndDelete('roles.confirmDelete', () => roles.removeRole(role.id)).then((done) => {
    if (done) setTimeout(() => { window.location.href = '/pages/roles/roles.html'; }, 900);
  });
}

function renderDetailActions(role) {
  const container = byId('detail-actions');
  if (role.isSystemRole) {
    container.replaceChildren();
    return;
  }

  const editBtn = iconButton('pencil', 'common.edit', { className: 'btn btn--sm', onClick: () => roleDialog.open(role) });
  const deleteBtn = iconButton('trash', 'common.delete', {
    className: 'btn btn--sm btn--danger', onClick: () => onDeleteRole(role),
  });

  editBtn.disabled = !hasPermission(actor, 'roles:update');
  deleteBtn.disabled = !hasPermission(actor, 'roles:delete');
  if (editBtn.disabled) editBtn.title = t('common.noPermission');
  if (deleteBtn.disabled) deleteBtn.title = t('common.noPermission');

  container.replaceChildren(editBtn, deleteBtn);
}

async function load() {
  const [{ role }, { permissions }] = await withLoading(Promise.all([
    roles.getRole(id), listPermissions({ limit: 100 }),
  ]));
  byId('detail-title').textContent = tData('systemRoles', role.name);
  byId('detail-sub').textContent = role.isSystemRole ? t('roles.readOnly') : role.description || '';
  renderDetailActions(role);

  wireRelation({
    listEl: byId('perms-list'), addEl: byId('perms-add'), owned: role.permissions, catalog: permissions,
    label: permLabel, readOnly: role.isSystemRole, reload: load, addTitleKey: 'relations.addPermissions',
    href: (permission) => `/pages/permissions/permission-detail.html?id=${permission.id}`,
    add: (permIds) => roles.grantRolePermissions(id, permIds), remove: (permId) => roles.revokeRolePermission(id, permId),
  });
}

async function init() {
  actor = await mountShell('/pages/roles/roles.html', 'roles:read');
  if (!actor) return;
  applyI18n();
  decorateButton('detail-back', 'arrowLeft');
  roleDialog = initRoleDialog(() => load());
  load();
}

init();
