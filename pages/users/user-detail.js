import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { wireRelation } from '../../js/components/detail-relations.js';
import { withLoading } from '../../js/components/loading.js';
import * as users from '../../js/api/users.api.js';
import { listGroups } from '../../js/api/groups.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const groupLabel = (group) => group.name;
const permLabel = (permission) => `${permission.resource}:${permission.action}`;

async function load() {
  const [{ user }, { groups }, { permissions }] = await withLoading(Promise.all([
    users.getUser(id), listGroups({ limit: 100 }), listPermissions({ limit: 100 }),
  ]));
  byId('detail-title').textContent = `${user.firstName} ${user.lastName}`;
  byId('detail-sub').textContent = `${user.email} — ${user.roleName}`;

  wireRelation({
    listEl: byId('groups-list'), addEl: byId('groups-add'), owned: user.groups, catalog: groups,
    label: groupLabel, reload: load,
    add: (groupId) => users.addUserGroup(id, groupId), remove: (groupId) => users.removeUserGroup(id, groupId),
  });
  wireRelation({
    listEl: byId('perms-list'), addEl: byId('perms-add'), owned: user.permissions, catalog: permissions,
    label: permLabel, reload: load,
    add: (permId) => users.grantUserPermission(id, permId), remove: (permId) => users.revokeUserPermission(id, permId),
  });
}

async function init() {
  const actor = await mountShell('/pages/users/users.html', 'users:read');
  if (!actor) return;
  applyI18n();
  load();
}

init();
