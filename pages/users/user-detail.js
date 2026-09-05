import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { hasPermission } from '../../js/auth/permissions.js';
import { wireRelation, confirmRemoval } from '../../js/components/detail-relations.js';
import { renderAddControl } from '../../js/components/relation-list.js';
import { withLoading } from '../../js/components/loading.js';
import { showToast } from '../../js/components/toast.js';
import { iconButton } from '../../js/components/action-buttons.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { createEl } from '../../js/utils/dom.js';
import { formatDate } from '../../js/utils/format-date.js';
import { iconEl } from '/design-system/icons.js';
import * as users from '../../js/api/users.api.js';
import { listRoles } from '../../js/api/roles.api.js';
import { listGroups } from '../../js/api/groups.api.js';
import { listPermissions } from '../../js/api/permissions.api.js';
import { initOwnerTransferSection } from './owner-transfer.js';
import { fillRoleOptions } from './users-form.render.js';
import { initUserDialog } from './users-dialog.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);
const groupLabel = (group) => group.name;
const permLabel = (permission) => `${tData('resources', permission.resource)}:${tData('actions', permission.action)}`;

let actor;
let can;
let userDialog;

function renderBack() {
  if (!can('users:read')) return;
  const link = createEl('a', { className: 'btn btn--sm', href: '/pages/users/users.html' });
  link.append(iconEl('arrowLeft', { size: 16 }), createEl('span', { textContent: t('common.back') }));
  byId('detail-back').replaceChildren(link);
}

function onDeleteUser(user) {
  confirmAndDelete('users.confirmDelete', () => users.removeUser(user.id)).then((done) => {
    if (done) setTimeout(() => { window.location.href = '/pages/users/users.html'; }, 900);
  });
}

function renderDetailActions(user) {
  const editBtn = iconButton('pencil', 'common.edit', { className: 'btn btn--sm', onClick: () => userDialog.open(user) });
  const deleteBtn = iconButton('trash', 'common.delete', {
    className: 'btn btn--sm btn--danger', onClick: () => onDeleteUser(user),
  });

  editBtn.disabled = !can('users:update');
  deleteBtn.disabled = !can('users:delete');
  if (editBtn.disabled) editBtn.title = t('common.noPermission');
  if (deleteBtn.disabled) deleteBtn.title = t('common.noPermission');

  byId('detail-actions').replaceChildren(editBtn, deleteBtn);
}

function metaRow(labelKey, value) {
  return [
    createEl('dt', { textContent: t(labelKey) }),
    createEl('dd', { textContent: value }),
  ];
}

function renderMeta(user) {
  const rows = [
    ...metaRow('users.email', user.email),
    ...metaRow('users.role', tData('systemRoles', user.roleName)),
    ...metaRow('users.status', user.isActive ? t('users.active') : t('users.inactive')),
    ...metaRow('common.createdAt', formatDate(user.createdAt)),
    ...metaRow('common.updatedAt', formatDate(user.updatedAt)),
  ];
  if (user.deletedAt) rows.push(...metaRow('users.deletedAt', formatDate(user.deletedAt)));
  byId('detail-meta').replaceChildren(...rows);
}

function sourceBadges(sources) {
  return sources.map((source) => createEl('span', {
    className: `ds-badge ds-badge--${source}`,
    textContent: t(`users.source.${source}`),
  }));
}

function renderPermissions(user, catalog, reload) {
  const canRevoke = can('permissions:revoke');
  const rows = user.permissions.map((permission) => {
    const link = createEl('a', {
      href: `/pages/permissions/permission-detail.html?id=${permission.id}`,
      textContent: permLabel(permission),
    });
    const cells = [
      createEl('td', {}, [link]),
      createEl('td', {}, sourceBadges(permission.sources)),
    ];
    const actionCell = createEl('td', { className: 'cell-actions' });
    if (canRevoke && permission.sources.includes('direct')) {
      const remove = createEl('button', { className: 'btn btn--sm btn--danger', type: 'button' });
      remove.append(iconEl('trash', { size: 16 }), createEl('span', { textContent: t('common.remove') }));
      remove.addEventListener('click', async () => {
        if (!await confirmRemoval(permLabel(permission))) return;
        try {
          await withLoading(users.revokeUserPermission(id, permission.id));
          showToast(t('common.removed'));
          reload();
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
      actionCell.append(remove);
    }
    cells.push(actionCell);
    return createEl('tr', {}, cells);
  });

  if (!rows.length) {
    rows.push(createEl('tr', {}, [
      createEl('td', { className: 'detail-empty', colSpan: 3, textContent: t('common.noResults') }),
    ]));
  }
  byId('perms-body').replaceChildren(...rows);

  const effectiveIds = new Set(user.permissions.map((permission) => permission.id));
  renderAddControl(byId('perms-add'), catalog.filter((permission) => !effectiveIds.has(permission.id)), {
    label: permLabel,
    readOnly: !can('permissions:grant'),
    pickerTitle: t('relations.addPermissions'),
    onAdd: async (permIds) => {
      try {
        await withLoading(users.grantUserPermissions(id, permIds));
        showToast(t('common.added'));
        reload();
      } catch (error) {
        showToast(error.message, 'error');
      }
    },
  });
}

async function load() {
  const [{ user }, groupList, permissionList] = await withLoading(Promise.all([
    users.getUser(id),
    listGroups({ limit: 100 }).catch(() => ({ groups: [] })),
    listPermissions({ limit: 200 }).catch(() => ({ permissions: [] })),
  ]));

  byId('detail-title').textContent = `${user.firstName} ${user.lastName}`;
  byId('detail-sub').textContent = `${user.email} — ${tData('systemRoles', user.roleName)}`;

  renderMeta(user);
  renderDetailActions(user);

  const ownerSection = byId('owner-section');
  if (user.id === actor.user.id && user.isOwner) {
    ownerSection.hidden = false;
    initOwnerTransferSection(byId('owner-transfer'), actor);
  } else {
    ownerSection.hidden = true;
  }

  wireRelation({
    listEl: byId('groups-list'),
    addEl: byId('groups-add'),
    owned: user.groups,
    catalog: groupList.groups,
    label: groupLabel,
    reload: load,
    readOnly: !can('users:update'),
    addTitleKey: 'relations.addGroups',
    href: (group) => `/pages/groups/group-detail.html?id=${group.id}`,
    add: (groupIds) => users.addUserGroups(id, groupIds),
    remove: (groupId) => users.removeUserGroup(id, groupId),
  });

  renderPermissions(user, permissionList.permissions, load);
}

async function init() {
  actor = await mountShell('/pages/users/users.html', null);
  if (!actor) return;

  can = (permission) => hasPermission(actor, permission);
  const isSelf = id === actor.user.id;
  if (!isSelf && !can('users:read')) {
    window.location.href = '/pages/home/home.html';
    return;
  }

  applyI18n();
  renderBack();

  const { roles } = await listRoles({ limit: 100 }).catch(() => ({ roles: [] }));
  fillRoleOptions(document.getElementById('user-form').elements.roleId, roles);
  userDialog = initUserDialog(() => load());

  load();
}

init();
