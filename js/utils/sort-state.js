export function createSortState(field, dir = 'asc') {
  return { field, dir };
}

export function toggleSort(sort, field) {
  if (sort.field === field) {
    sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sort.field = field;
    sort.dir = 'asc';
  }
  return sort;
}
