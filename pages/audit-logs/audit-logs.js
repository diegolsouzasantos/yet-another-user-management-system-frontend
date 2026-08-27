import { mountShell } from '../../js/components/shell.js';
import { applyI18n } from '../../js/i18n/i18n.js';
import { renderPagination } from '../../js/components/pagination.js';
import { listAuditLogs } from '../../js/api/audit-logs.api.js';
import { renderAuditLogsTable } from './audit-logs-table.render.js';

let page = 1;

async function load() {
  const { auditLogs, meta } = await listAuditLogs({ page });
  renderAuditLogsTable(document.getElementById('audit-logs-table-body'), auditLogs);
  renderPagination(document.getElementById('pagination'), meta, (next) => { page = next; load(); });
}

async function init() {
  const actor = await mountShell('/pages/audit-logs/audit-logs.html', 'audit-logs:read');
  if (!actor) return;

  applyI18n();
  load();
}

init();
