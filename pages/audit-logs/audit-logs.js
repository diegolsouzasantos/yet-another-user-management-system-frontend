import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { createSortableList } from '../../js/components/sortable-list.js';
import { listAuditLogs } from '../../js/api/audit-logs.api.js';
import { renderAuditLogsTable, AUDIT_COLUMNS } from './audit-logs-table.render.js';

const renderRows = (rows) => renderAuditLogsTable(document.getElementById('audit-logs-table-body'), rows);

async function init() {
  const actor = await mountShell('/pages/audit-logs/audit-logs.html', 'audit-logs:read');
  if (!actor) return;

  applyI18n();
  const list = createSortableList({
    headEl: document.getElementById('audit-logs-table-head'),
    pagingEl: document.getElementById('pagination'),
    columns: AUDIT_COLUMNS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    fetchPage: (params) => listAuditLogs(params).then((res) => ({ rows: res.auditLogs, meta: res.meta })),
    renderRows,
  });
  list.load();
}

init();
