import { createEl } from '../../js/utils/dom.js';
import { formatDate } from '../../js/utils/format-date.js';
import { tData } from '../../js/i18n/data-i18n.js';

export const AUDIT_COLUMNS = [
  { key: 'auditLogs.actor' },
  { key: 'auditLogs.entity', field: 'entityType' },
  { key: 'auditLogs.action', field: 'action' },
  { key: 'auditLogs.field' },
  { key: 'auditLogs.oldValue' },
  { key: 'auditLogs.newValue' },
  { key: 'auditLogs.date', field: 'createdAt' },
];

export const AUDIT_FILTER_FIELDS = [
  {
    field: 'entityType',
    labelKey: 'auditLogs.entity',
    type: 'enum',
    dataNamespace: 'auditEntities',
    options: [
      { value: 'User', label: 'User' },
      { value: 'Group', label: 'Group' },
      { value: 'Role', label: 'Role' },
      { value: 'Permission', label: 'Permission' },
    ],
  },
  {
    field: 'action',
    labelKey: 'auditLogs.action',
    type: 'enum',
    dataNamespace: 'auditActions',
    options: [
      { value: 'created', label: 'created' },
      { value: 'updated', label: 'updated' },
      { value: 'deleted', label: 'deleted' },
    ],
  },
  { field: 'createdAt', labelKey: 'auditLogs.date', type: 'date' },
];

function buildRow(log) {
  const actorLabel = log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : '';
  return createEl('tr', {}, [
    createEl('td', { textContent: actorLabel }),
    createEl('td', { textContent: `${tData('auditEntities', log.entityType)} (${log.entityId})` }),
    createEl('td', { textContent: tData('auditActions', log.action) }),
    createEl('td', { textContent: log.fieldName || '' }),
    createEl('td', { textContent: log.oldValue || '' }),
    createEl('td', { textContent: log.newValue || '' }),
    createEl('td', { textContent: formatDate(log.createdAt) }),
  ]);
}

export function renderAuditLogsTable(tbodyEl, logs) {
  tbodyEl.replaceChildren(...logs.map(buildRow));
}
