import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { hasPermission } from '../../js/auth/permissions.js';
import { wireRelation } from '../../js/components/detail-relations.js';
import { withLoading } from '../../js/components/loading.js';
import { iconButton, decorateButton } from '../../js/components/action-buttons.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import * as groups from '../../js/api/groups.api.js';
import { listUsers } from '../../js/api/users.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';
import { initGroupDialog } from './groups-dialog.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const userLabel = (user) => `${user.firstName} ${user.lastName}`;
const permLabel = (permission) => `${tData('resources', permission.resource)}:${tData('actions', permission.action)}`;

let actor;
let groupDialog;

function onDeleteGroup(group) {
  confirmAndDelete('groups.confirmDelete', () => groups.removeGroup(group.id)).then((done) => {
    if (done) setTimeout(() => { window.location.href = '/pages/groups/groups.html'; }, 900);
  });
}

function renderDetailActions(group) {
  const editBtn = iconButton('pencil', 'common.edit', { className: 'btn btn--sm', onClick: () => groupDialog.open(group) });
  const deleteBtn = iconButton('trash', 'common.delete', {
    className: 'btn btn--sm btn--danger', onClick: () => onDeleteGroup(group),
  });

  editBtn.disabled = !hasPermission(actor, 'groups:update');
  deleteBtn.disabled = !hasPermission(actor, 'groups:delete');
  if (editBtn.disabled) editBtn.title = t('common.noPermission');
  if (deleteBtn.disabled) deleteBtn.title = t('common.noPermission');

  byId('detail-actions').replaceChildren(editBtn, deleteBtn);
}

async function load() {
  const [{ group }, userList, permissionList] = await withLoading(Promise.all([
    groups.getGroup(id), listUsers({ limit: 100 }), listPermissions({ limit: 100 }),
  ]));
  byId('detail-title').textContent = group.name;
  byId('detail-sub').textContent = group.description || '';
  renderDetailActions(group);

  wireRelation({
    listEl: byId('users-list'), addEl: byId('users-add'), owned: group.users, catalog: userList.users,
    label: userLabel, reload: load, addTitleKey: 'relations.addUsers',
    href: (user) => `/pages/users/user-detail.html?id=${user.id}`,
    add: (userIds) => groups.addGroupUsers(id, userIds), remove: (userId) => groups.removeGroupUser(id, userId),
  });
  wireRelation({
    listEl: byId('perms-list'), addEl: byId('perms-add'), owned: group.permissions, catalog: permissionList.permissions,
    label: permLabel, reload: load, addTitleKey: 'relations.addPermissions',
    href: (permission) => `/pages/permissions/permission-detail.html?id=${permission.id}`,
    add: (permIds) => groups.grantGroupPermissions(id, permIds), remove: (permId) => groups.revokeGroupPermission(id, permId),
  });
}

async function init() {
  actor = await mountShell('/pages/groups/groups.html', 'groups:read');
  if (!actor) return;
  applyI18n();
  decorateButton('detail-back', 'arrowLeft');
  groupDialog = initGroupDialog(() => load());
  load();
}

init();
