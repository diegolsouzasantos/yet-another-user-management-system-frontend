import { renderTableHead } from './table-head.js';
import { renderPagination } from './pagination.js';
import { withLoading } from './loading.js';
import { createSortState, toggleSort } from '../utils/sort-state.js';

export function createSortableList({
  headEl, pagingEl, columns, defaultField, defaultDir, fetchPage, renderRows,
}) {
  const sort = createSortState(defaultField, defaultDir);
  let page = 1;

  function onSort(field) {
    toggleSort(sort, field);
    page = 1;
    load();
  }

  async function load() {
    renderTableHead(headEl, columns, sort, onSort);
    const { rows, meta } = await withLoading(fetchPage({ page, sort: sort.field, order: sort.dir }));
    renderRows(rows);
    renderPagination(pagingEl, meta, (next) => { page = next; load(); });
  }

  return { load, reload: load };
}
