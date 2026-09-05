import { renderTableHead } from './table-head.js';
import { renderPagination } from './pagination.js';
import { withLoading } from './loading.js';
import { showToast } from './toast.js';
import { createListFilters } from './list-filters.js';
import { createListToolbar } from './list-toolbar.js';
import { createSelection, selectionCell, selectAllHeader } from './list-selection.js';
import { createSortState, toggleSort } from '../utils/sort-state.js';
import {
  readListState, writeListState, PAGE_SIZES, DEFAULT_PAGE_SIZE,
} from '../utils/list-query-state.js';
import { t } from '../i18n/i18n.js';
import { confirmModal } from '/design-system/modal.js';
import { exportCsv, bulkDelete, triggerDownload } from '../api/list-actions.js';

export function createSortableList({
  headEl, pagingEl, filtersEl, toolbarEl,
  columns, filterFields, filterOptions,
  defaultField, defaultDir, fetchPage, renderRows,
  selectable = false, canDelete = false, deleteEnabled = true, resourceBasePath, idOf = (row) => row.id,
}) {
  const initial = readListState();
  const sort = createSortState(initial.sort || defaultField, initial.order || defaultDir || 'asc');
  let page = initial.page || 1;
  let limit = initial.limit || DEFAULT_PAGE_SIZE;
  let filters = initial.filters || [];
  let rows = [];

  const selection = selectable
    ? createSelection((count) => toolbar && toolbar.setCount(count))
    : null;

  const filterUI = filtersEl && filterFields
    ? createListFilters({
      el: filtersEl,
      fields: filterFields,
      options: filterOptions || {},
      onChange: (next) => { filters = next; page = 1; syncAndLoad(); },
    })
    : null;

  const toolbar = selectable && toolbarEl
    ? createListToolbar({
      el: toolbarEl, canDelete, deleteEnabled, onExport: runExport, onDeleteSelected: runBulkDelete,
    })
    : null;

  function currentParams() {
    const params = { page, limit, sort: sort.field, order: sort.dir };
    if (filters.length) params.filters = JSON.stringify(filters);
    return params;
  }

  function syncAndLoad() {
    writeListState({
      page, limit, sort: sort.field, order: sort.dir, filters,
    });
    return load();
  }

  function onSort(field) {
    toggleSort(sort, field);
    page = 1;
    syncAndLoad();
  }

  // A list is selectable by receiving these two hooks, not by having its
  // rendered markup patched from the outside after the fact.
  function selectionCellFor(row) {
    if (!selection) return null;
    return selectionCell(idOf(row), selection, repaintHeaderOnly);
  }

  function selectionHeaderCell() {
    if (!selection) return null;
    return selectAllHeader(rows.map(idOf), selection, repaintAll);
  }

  function repaintHeaderOnly() {
    renderTableHead(headEl, columns, sort, onSort, selectionHeaderCell());
  }

  function repaintAll() {
    repaintHeaderOnly();
    renderRows(rows, { selectionCellFor });
  }

  async function load() {
    renderTableHead(headEl, columns, sort, onSort, selectionHeaderCell());
    if (filterUI) filterUI.render(filters);

    const result = await withLoading(fetchPage(currentParams()));
    rows = result.rows;
    repaintHeaderOnly();
    renderRows(rows, { selectionCellFor });

    renderPagination(pagingEl, result.meta, (next) => { page = next; syncAndLoad(); }, {
      value: limit,
      sizes: PAGE_SIZES,
      onChange: (next) => { limit = next; page = 1; syncAndLoad(); },
    });
  }

  async function runExport() {
    const params = { sort: sort.field, order: sort.dir };
    if (filters.length) params.filters = JSON.stringify(filters);
    if (selection && selection.size()) params.ids = selection.list().join(',');

    try {
      const result = await withLoading(exportCsv(resourceBasePath, params));
      if (result.emailed) {
        showToast(t('list.exportEmailed', { email: result.email }));
      } else {
        triggerDownload(result.blob, result.filename);
        showToast(t('list.exportDone'));
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function runBulkDelete() {
    if (!selection || !selection.size()) return;
    const ids = selection.list();
    const confirmed = await confirmModal({
      title: t('list.deleteSelectedTitle'),
      message: t('list.deleteSelectedMessage', { count: ids.length }),
      confirmLabel: t('common.delete'),
      cancelLabel: t('common.cancel'),
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      const result = await withLoading(bulkDelete(resourceBasePath, ids));
      selection.clear();
      const removed = result.deleted ? result.deleted.length : ids.length;
      const skipped = result.skipped ? result.skipped.length : 0;
      showToast(skipped ? t('list.bulkDeletePartial', { removed, skipped }) : t('common.deleted'));
      page = 1;
      syncAndLoad();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  return { load, reload: load };
}
