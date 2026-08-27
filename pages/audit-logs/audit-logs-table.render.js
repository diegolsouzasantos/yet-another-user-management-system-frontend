import { createEl } from '../../js/utils/dom.js';
import { formatDate } from '../../js/utils/format-date.js';

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
