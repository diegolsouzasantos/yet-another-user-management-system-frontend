import { createEl } from '../../js/utils/dom.js';
import { formatDate } from '../../js/utils/format-date.js';

export const AUDIT_COLUMNS = [
  { key: 'auditLogs.actor' },
  { key: 'auditLogs.entity', field: 'entityType' },
  { key: 'auditLogs.action', field: 'action' },
  { key: 'auditLogs.field' },
  { key: 'auditLogs.oldValue' },
  { key: 'auditLogs.newValue' },
  { key: 'auditLogs.date', field: 'createdAt' },
];

function buildRow(log) {
  const actorLabel = log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : '';
  return createEl('tr', {}, [
    createEl('td', { textContent: actorLabel }),
    createEl('td', { textContent: `${log.entityType} (${log.entityId})` }),
    createEl('td', { textContent: log.action }),
    createEl('td', { textContent: log.fieldName || '' }),
    createEl('td', { textContent: log.oldValue || '' }),
    createEl('td', { textContent: log.newValue || '' }),
    createEl('td', { textContent: formatDate(log.createdAt) }),
  ]);
}

export function renderAuditLogsTable(tbodyEl, logs) {
  tbodyEl.replaceChildren(...logs.map(buildRow));
}
