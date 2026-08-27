import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { renderPagination } from '../../js/components/pagination.js';
import { renderTableHead } from '../../js/components/table-head.js';
import { showToast } from '../../js/components/toast.js';
import { listGroups, removeGroup } from '../../js/api/groups.api.js';
import { renderGroupsTable } from './groups-table.render.js';
import { initGroupDialog } from './groups-dialog.js';

const HEAD_KEYS = ['groups.name', 'groups.description', 'common.actions'];
let page = 1;
let groupDialog;

async function load() {
  const { groups, meta } = await listGroups({ page });
  renderGroupsTable(document.getElementById('groups-table-body'), groups, { onEdit: groupDialog.open, onDelete });
  renderPagination(document.getElementById('pagination'), meta, (next) => { page = next; load(); });
}

async function onDelete(group) {
  if (!window.confirm(t('groups.confirmDelete'))) return;
  await removeGroup(group.id);
  showToast(t('common.delete'));
  load();
}

async function init() {
  const actor = await mountShell('/pages/groups/groups.html', 'groups:read');
  if (!actor) return;

  applyI18n();
  renderTableHead(document.getElementById('groups-table-head'), HEAD_KEYS);
  groupDialog = initGroupDialog(load);

  load();
}

init();
