import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { wireRelation } from '../../js/components/detail-relations.js';
import { withLoading } from '../../js/components/loading.js';
import * as groups from '../../js/api/groups.api.js';
import { listUsers } from '../../js/api/users.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const userLabel = (user) => `${user.firstName} ${user.lastName}`;
const permLabel = (permission) => `${permission.resource}:${permission.action}`;

async function load() {
  const [{ group }, userList, permissionList] = await withLoading(Promise.all([
    groups.getGroup(id), listUsers({ limit: 100 }), listPermissions({ limit: 100 }),
  ]));
  byId('detail-title').textContent = group.name;
  byId('detail-sub').textContent = group.description || '';

  wireRelation({
    listEl: byId('users-list'), addEl: byId('users-add'), owned: group.users, catalog: userList.users,
    label: userLabel, reload: load,
    add: (userId) => groups.addGroupUser(id, userId), remove: (userId) => groups.removeGroupUser(id, userId),
  });
  wireRelation({
    listEl: byId('perms-list'), addEl: byId('perms-add'), owned: group.permissions, catalog: permissionList.permissions,
    label: permLabel, reload: load,
    add: (permId) => groups.grantGroupPermission(id, permId), remove: (permId) => groups.revokeGroupPermission(id, permId),
  });
}

async function init() {
  const actor = await mountShell('/pages/groups/groups.html', 'groups:read');
  if (!actor) return;
  applyI18n();
  load();
}

init();
