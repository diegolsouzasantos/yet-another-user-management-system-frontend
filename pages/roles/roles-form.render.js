export function fillRoleForm(formEl, role) {
  formEl.reset();
  formEl.elements.name.value = role ? role.name : '';
  formEl.elements.description.value = role ? role.description || '' : '';
}

export function readRoleForm(formEl) {
  return Object.fromEntries(new FormData(formEl));
}
