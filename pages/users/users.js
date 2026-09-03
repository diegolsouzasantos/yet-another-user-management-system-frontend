import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { confirmAndDelete } from '../../js/utils/confirm-delete.js';
import { decorateButton } from '../../js/components/action-buttons.js';
import { listUsers, removeUser } from '../../js/api/users.api.js';
import { listRoles } from '../../js/api/roles.api.js';
import { listGroups } from '../../js/api/groups.api.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { renderUsersTable, USER_COLUMNS, USER_FILTER_FIELDS } from './users-table.render.js';
import { fillRoleOptions } from './users-form.render.js';
import { initUserDialog } from './users-dialog.js';

let list;
let userDialog;

const onDelete = (user) => confirmAndDelete('users.confirmDelete', () => removeUser(user.id))
  .then((done) => done && list.reload());

const renderRows = (rows) => renderUsersTable(document.getElementById('users-table-body'), rows, {
  onEdit: (user) => userDialog.open(user), onDelete,
});

async function init() {
  const actor = await mountShell('/pages/users/users.html', 'users:read');
  if (!actor) return;

  applyI18n();
  decorateButton('create-btn', 'plus');

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
