import { createEl, clear } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';
import { tData } from '../i18n/data-i18n.js';
import {
  operatorsFor, defaultOperator, isValidDraft, normalizeDraft, blankValueFor,
  VALUELESS_OPERATORS, MULTI_VALUE_OPERATORS, RANGE_OPERATORS,
} from './filter-model.js';

function optionEl(value, label, selected) {
  return createEl('option', { value, textContent: label, selected: Boolean(selected) });
}

export function createListFilters({ el, fields, options = {}, onChange }) {
  let filters = [];
  let editing = null;

  const fieldMap = new Map(fields.map((field) => [field.field, field]));

  function metaOf(fieldName) {
    return fieldMap.get(fieldName) || null;
  }

  function resolveOptions(meta) {
    if (!meta) return [];
    if (meta.options) return meta.options;
    if (meta.optionsKey && options[meta.optionsKey]) return options[meta.optionsKey];
    return [];
  }

  function optionLabel(meta, value) {
    if (meta && meta.dataNamespace) return tData(meta.dataNamespace, value);
    const found = resolveOptions(meta).find((option) => String(option.value) === String(value));
    return found ? found.label : String(value);
  }

  function chipValueLabel(meta, filter) {
    if (VALUELESS_OPERATORS.includes(filter.operator)) return '';
    if (RANGE_OPERATORS.includes(filter.operator)) {
      return `${filter.value.from} – ${filter.value.to}`;
    }
    if (MULTI_VALUE_OPERATORS.includes(filter.operator)) {
      return filter.value.map((value) => optionLabel(meta, value)).join(', ');
    }
    if (meta && (meta.type === 'relation' || meta.type === 'enum')) {
      return optionLabel(meta, filter.value);
    }
    return String(filter.value);
  }

  function emitChange(next) {
    filters = next;
    editing = null;
    onChange(next.map(normalizeDraft));
  }

  function removeAt(index) {
    emitChange(filters.filter((_, position) => position !== index));
  }

  function startAdd() {
    editing = { index: null, draft: { field: '', operator: '', value: '' } };
    render();
  }

  function startEdit(index) {
    editing = { index, draft: JSON.parse(JSON.stringify(filters[index])) };
    render();
  }

  function applyEditing() {
    if (!isValidDraft(editing.draft)) return;
    const clean = normalizeDraft(editing.draft);
    const next = editing.index === null
      ? [...filters, clean]
      : filters.map((filter, position) => (position === editing.index ? clean : filter));
    emitChange(next);
  }

  function cancelEditing() {
    editing = null;
    render();
  }

  function buildValueControl(meta, draft, onInput) {
    if (!meta) {
      return createEl('input', { className: 'list-filters__control', disabled: true, placeholder: t('filters.value') });
    }
    if (VALUELESS_OPERATORS.includes(draft.operator)) {
      return createEl('span', { className: 'list-filters__hint', textContent: '—' });
    }

    const inputType = meta.type === 'number' ? 'number' : meta.type === 'date' ? 'date' : 'text';

    if (RANGE_OPERATORS.includes(draft.operator)) {
      const from = createEl('input', {
        className: 'list-filters__control list-filters__control--range',
        type: inputType,
        value: (draft.value && draft.value.from) || '',
        placeholder: t('filters.from'),
      });
      const to = createEl('input', {
        className: 'list-filters__control list-filters__control--range',
        type: inputType,
        value: (draft.value && draft.value.to) || '',
        placeholder: t('filters.to'),
      });
      from.addEventListener('input', () => onInput({ from: from.value, to: to.value }));
      to.addEventListener('input', () => onInput({ from: from.value, to: to.value }));
      return createEl('span', { className: 'list-filters__range' }, [from, to]);
    }

    if (meta.type === 'relation' || meta.type === 'enum') {
      const multiple = MULTI_VALUE_OPERATORS.includes(draft.operator);
      const selected = multiple ? (draft.value || []) : [draft.value];
      const select = createEl('select', {
        className: 'list-filters__control',
        multiple,
        ...(multiple ? { size: 4 } : {}),
      }, [
        ...(multiple ? [] : [optionEl('', t('filters.valuePlaceholder'), !draft.value)]),
        ...resolveOptions(meta).map((option) => (
          optionEl(option.value, optionLabel(meta, option.value), selected.map(String).includes(String(option.value)))
        )),
      ]);
      select.addEventListener('change', () => {
        onInput(multiple ? [...select.selectedOptions].map((option) => option.value) : select.value);
      });
      return select;
    }

    const input = createEl('input', {
      className: 'list-filters__control',
      type: inputType,
      value: draft.value == null ? '' : draft.value,
    });
    input.addEventListener('input', () => onInput(input.value));
    return input;
  }

  function buildEditor() {
    const { draft } = editing;
    const meta = metaOf(draft.field);

    const fieldSelect = createEl('select', { className: 'list-filters__control' }, [
      optionEl('', t('filters.fieldPlaceholder'), !draft.field),
      ...fields.map((field) => optionEl(field.field, t(field.labelKey), field.field === draft.field)),
    ]);
    fieldSelect.addEventListener('change', () => {
      draft.field = fieldSelect.value;
      const nextMeta = metaOf(draft.field);
      draft.operator = nextMeta ? defaultOperator(nextMeta.type) : '';
      draft.value = blankValueFor(draft.operator);
      render();
    });

    const operatorSelect = createEl('select', {
      className: 'list-filters__control',
      disabled: !meta,
    }, (meta ? operatorsFor(meta.type) : []).map((operator) => (
      optionEl(operator, t(`filters.op.${operator}`), operator === draft.operator)
    )));
    operatorSelect.addEventListener('change', () => {
      draft.operator = operatorSelect.value;
      draft.value = blankValueFor(draft.operator);
      render();
    });

    const valueControl = buildValueControl(meta, draft, (value) => {
      draft.value = value;
      applyBtn.disabled = !isValidDraft(draft);
    });

    const applyBtn = createEl('button', {
      className: 'btn btn--primary btn--sm',
      type: 'button',
      textContent: t('filters.apply'),
      disabled: !isValidDraft(draft),
    });
    applyBtn.addEventListener('click', applyEditing);

    const cancelBtn = createEl('button', {
      className: 'btn btn--sm', type: 'button', textContent: t('filters.cancel'),
    });
    cancelBtn.addEventListener('click', cancelEditing);

    return createEl('div', { className: 'list-filters__editor' }, [
      fieldSelect, operatorSelect, valueControl, applyBtn, cancelBtn,
    ]);
  }

  function buildChip(filter, index) {
    const meta = metaOf(filter.field);
    const label = [
      t(meta ? meta.labelKey : filter.field),
      t(`filters.op.${filter.operator}`),
      chipValueLabel(meta, filter),
    ].filter(Boolean).join(' ');

    const text = createEl('button', { className: 'list-filters__chip-label', type: 'button', textContent: label });
    text.addEventListener('click', () => startEdit(index));

    const removeBtn = createEl('button', {
      className: 'list-filters__chip-remove',
      type: 'button',
      textContent: '✕',
      title: t('common.remove'),
      'aria-label': t('common.remove'),
    });
    removeBtn.addEventListener('click', () => removeAt(index));

    return createEl('span', { className: 'list-filters__chip' }, [text, removeBtn]);
  }

  function render() {
    clear(el);

    const bar = createEl('div', { className: 'list-filters__bar' });
    filters.forEach((filter, index) => bar.append(buildChip(filter, index)));

    const addBtn = createEl('button', {
      className: 'btn btn--sm', type: 'button', textContent: `+ ${t('filters.add')}`,
    });
    addBtn.addEventListener('click', startAdd);
    bar.append(addBtn);

    if (filters.length) {
      const clearBtn = createEl('button', {
        className: 'btn btn--sm list-filters__clear', type: 'button', textContent: t('filters.clearAll'),
      });
      clearBtn.addEventListener('click', () => emitChange([]));
      bar.append(clearBtn);
    }

    el.append(bar);
    if (editing) el.append(buildEditor());
  }

  return {
    render(next) {
      filters = Array.isArray(next) ? next : [];
      render();
    },
  };
}
