export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

function safeParseFilters(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function readListState() {
  const params = new URLSearchParams(window.location.search);
  const state = {};

  if (params.has('page')) state.page = Math.max(1, Number(params.get('page')) || 1);
  if (params.has('limit')) {
    const limit = Number(params.get('limit'));
    if (PAGE_SIZES.includes(limit)) state.limit = limit;
  }
  if (params.has('sort')) state.sort = params.get('sort');
  if (params.has('order')) state.order = params.get('order') === 'desc' ? 'desc' : 'asc';
  if (params.has('filters')) state.filters = safeParseFilters(params.get('filters'));

  return state;
}

export function writeListState({
  page, limit, sort, order, filters,
}) {
  const params = new URLSearchParams(window.location.search);

  if (page && page > 1) params.set('page', String(page)); else params.delete('page');
  if (limit && limit !== DEFAULT_PAGE_SIZE) params.set('limit', String(limit)); else params.delete('limit');
  if (sort) params.set('sort', sort); else params.delete('sort');
  if (order) params.set('order', order); else params.delete('order');
  if (filters && filters.length) params.set('filters', JSON.stringify(filters)); else params.delete('filters');

  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}
