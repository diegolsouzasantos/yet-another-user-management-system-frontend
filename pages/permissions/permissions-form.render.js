export function fillPermissionForm(formEl, permission) {
  formEl.reset();
  formEl.elements.resource.value = permission ? permission.resource : '';
  formEl.elements.action.value = permission ? permission.action : '';
  formEl.elements.description.value = permission ? permission.description || '' : '';
}

export function readPermissionForm(formEl) {
  return Object.fromEntries(new FormData(formEl));
}
