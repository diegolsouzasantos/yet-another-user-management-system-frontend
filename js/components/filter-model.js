export const OPERATORS_BY_TYPE = {
  text: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
  enum: ['eq', 'neq', 'in'],
  relation: ['eq', 'neq', 'in'],
  boolean: ['isTrue', 'isFalse'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  date: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
};

export const VALUELESS_OPERATORS = ['isTrue', 'isFalse'];
export const MULTI_VALUE_OPERATORS = ['in'];
export const RANGE_OPERATORS = ['between'];

export function operatorsFor(type) {
  return OPERATORS_BY_TYPE[type] || [];
}

export function defaultOperator(type) {
  return operatorsFor(type)[0];
}

export function isValidDraft(draft) {
  if (!draft || !draft.field || !draft.operator) return false;
  if (VALUELESS_OPERATORS.includes(draft.operator)) return true;

  if (MULTI_VALUE_OPERATORS.includes(draft.operator)) {
    return Array.isArray(draft.value) && draft.value.length > 0;
  }

  if (RANGE_OPERATORS.includes(draft.operator)) {
    const value = draft.value || {};
    return value.from !== undefined && value.from !== '' && value.to !== undefined && value.to !== '';
  }

  return draft.value !== undefined && draft.value !== null && draft.value !== '';
}

export function normalizeDraft(draft) {
  const base = { field: draft.field, operator: draft.operator };
  if (VALUELESS_OPERATORS.includes(draft.operator)) return base;
  if (RANGE_OPERATORS.includes(draft.operator)) {
    return { ...base, value: { from: draft.value.from, to: draft.value.to } };
  }
  if (MULTI_VALUE_OPERATORS.includes(draft.operator)) {
    return { ...base, value: [...draft.value] };
  }
  return { ...base, value: draft.value };
}

export function blankValueFor(operator) {
  if (RANGE_OPERATORS.includes(operator)) return { from: '', to: '' };
  if (MULTI_VALUE_OPERATORS.includes(operator)) return [];
  return '';
}
