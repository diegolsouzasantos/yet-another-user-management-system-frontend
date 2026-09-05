import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

function arrow(active, dir) {
  if (!active) return '';
  return dir === 'desc' ? ' ▼' : ' ▲';
}

function buildHeader(column, sort, onSort) {
  if (!column.field) {
    return createEl('th', { textContent: t(column.key) });
  }

  const active = sort.field === column.field;
  const th = createEl('th', {
    className: 'th--sortable',
    textContent: t(column.key) + arrow(active, sort.dir),
  });
  th.addEventListener('click', () => onSort(column.field));
  return th;
}

export function renderTableHead(rowEl, columns, sort = {}, onSort = () => {}, leadingCell = null) {
  const cells = columns.map((column) => (typeof column === 'string' ? { key: column } : column));
  const headerCells = cells.map((column) => buildHeader(column, sort, onSort));
  rowEl.replaceChildren(...(leadingCell ? [leadingCell, ...headerCells] : headerCells));
}
