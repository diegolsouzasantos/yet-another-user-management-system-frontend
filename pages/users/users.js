import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { decorateButton, setControlAvailability } from '../../js/components/action-buttons.js';
import { hasPermission } from '../../js/auth/permissions.js';
import { listUsers, removeUser } from '../../js/api/users.api.js';
import { listRoles } from '../../js/api/roles.api.js';
import { listGroups } from '../../js/api/groups.api.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { renderUsersTable, USER_COLUMNS, USER_FILTER_FIELDS } from './users-table.render.js';
import { fillRoleOptions } from './users-form.render.js';
import { initUserDialog } from './users-dialog.js';

let list;
let userDialog;
let canEdit = true;
let canDeleteRow = true;

const onDelete = (user) => confirmAndDelete('users.confirmDelete', () => removeUser(user.id))
  .then((done) => done && list.reload());

const renderRows = (rows, extra) => renderUsersTable(document.getElementById('users-table-body'), rows, {
  onEdit: (user) => userDialog.open(user), onDelete, canEdit, canDeleteRow, ...extra,
});

async function init() {
  const actor = await mountShell('/pages/users/users.html', 'users:read');
  if (!actor) return;

  applyI18n();
  decorateButton('create-btn', 'plus');

  canEdit = hasPermission(actor, 'users:update');
  canDeleteRow = hasPermission(actor, 'users:delete');
  setControlAvailability('create-btn', hasPermission(actor, 'users:create'));

  const [{ roles }, { groups }] = await Promise.all([
    listRoles({ limit: 100 }),
    listGroups({ limit: 100 }).catch(() => ({ groups: [] })),
  ]);
  fillRoleOptions(document.getElementById('user-form').elements.roleId, roles);
  userDialog = initUserDialog(() => list.reload());

  list = createSortableList({
    headEl: document.getElementById('users-table-head'),
    pagingEl: document.getElementById('pagination'),
    filtersEl: document.getElementById('list-filters'),
    toolbarEl: document.getElementById('list-toolbar'),
    selectable: true,
    canDelete: true,
    deleteEnabled: canDeleteRow,
    resourceBasePath: '/users',
    columns: USER_COLUMNS,
    filterFields: USER_FILTER_FIELDS,
    filterOptions: {
      roles: roles.map((role) => ({ value: role.id, label: tData('systemRoles', role.name) })),
      groups: groups.map((group) => ({ value: group.id, label: group.name })),
    },
    defaultField: 'firstName',
    fetchPage: (params) => listUsers(params).then((res) => ({ rows: res.users, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
