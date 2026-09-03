import { createEl } from '../utils/dom.js';

export function createSelection(onChange) {
  const ids = new Set();
  const notify = () => onChange(ids.size);

  return {
    has: (id) => ids.has(id),
    size: () => ids.size,
    list: () => [...ids],
    toggle(id, on) {
      const next = on === undefined ? !ids.has(id) : on;
      if (next) ids.add(id); else ids.delete(id);
      notify();
    },
    setMany(list, on) {
      list.forEach((id) => (on ? ids.add(id) : ids.delete(id)));
      notify();
    },
    clear() {
      ids.clear();
      notify();
    },
  };
}

export function selectionCell(id, selection, onToggle) {
  const checkbox = createEl('input', { type: 'checkbox', checked: selection.has(id) });
  checkbox.addEventListener('change', () => {
    selection.toggle(id, checkbox.checked);
    onToggle();
  });
  return createEl('td', { className: 'cell-select' }, [checkbox]);
}

export function selectAllHeader(pageIds, selection, onToggle) {
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selection.has(id));
  const checkbox = createEl('input', { type: 'checkbox', checked: allSelected });
  checkbox.indeterminate = !allSelected && pageIds.some((id) => selection.has(id));
  checkbox.addEventListener('change', () => {
    selection.setMany(pageIds, checkbox.checked);
    onToggle();
  });
  return createEl('th', { className: 'cell-select' }, [checkbox]);
}
