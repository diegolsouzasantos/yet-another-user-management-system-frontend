import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { listPermissions } from '../../js/api/permissions.api.js';
import { renderPermissionsTable, PERMISSION_COLUMNS, PERMISSION_FILTER_FIELDS } from './permissions-table.render.js';

const renderRows = (rows) => renderPermissionsTable(document.getElementById('permissions-table-body'), rows);

async function init() {
  const actor = await mountShell('/pages/permissions/permissions.html', 'permissions:read');
  if (!actor) return;

  applyI18n();
  const list = createSortableList({
    headEl: document.getElementById('permissions-table-head'),
    pagingEl: document.getElementById('pagination'),
    filtersEl: document.getElementById('list-filters'),
    columns: PERMISSION_COLUMNS,
    filterFields: PERMISSION_FILTER_FIELDS,
    defaultField: 'resource',
    fetchPage: (params) => listPermissions(params).then((res) => ({ rows: res.permissions, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
