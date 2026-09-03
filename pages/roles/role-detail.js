import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { wireRelation } from '../../js/components/detail-relations.js';
import { withLoading } from '../../js/components/loading.js';
import * as roles from '../../js/api/roles.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const permLabel = (permission) => `${tData('resources', permission.resource)}:${tData('actions', permission.action)}`;

async function load() {
  const [{ role }, { permissions }] = await withLoading(Promise.all([
    roles.getRole(id), listPermissions({ limit: 100 }),
  ]));
  byId('detail-title').textContent = tData('systemRoles', role.name);
  byId('detail-sub').textContent = role.isSystemRole ? t('roles.readOnly') : role.description || '';

  wireRelation({
    listEl: byId('perms-list'), addEl: byId('perms-add'), owned: role.permissions, catalog: permissions,
    label: permLabel, readOnly: role.isSystemRole, reload: load, addTitleKey: 'relations.addPermissions',
    add: (permIds) => roles.grantRolePermissions(id, permIds), remove: (permId) => roles.revokeRolePermission(id, permId),
  });
}

async function init() {
  const actor = await mountShell('/pages/roles/roles.html', 'roles:read');
  if (!actor) return;
  applyI18n();
  load();
}

init();
