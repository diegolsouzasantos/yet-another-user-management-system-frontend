export function fillGroupForm(formEl, group) {
  formEl.reset();
  formEl.elements.name.value = group ? group.name : '';
  formEl.elements.description.value = group ? group.description || '' : '';
}

export function readGroupForm(formEl) {
  return Object.fromEntries(new FormData(formEl));
}
