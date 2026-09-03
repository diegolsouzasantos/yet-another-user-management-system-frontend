import { tData } from '../../js/i18n/data-i18n.js';

export function fillRoleOptions(selectEl, roles) {
  selectEl.replaceChildren(...roles.map((role) => new Option(tData('systemRoles', role.name), role.id)));
}

export function fillUserForm(formEl, user) {
  formEl.reset();
  formEl.elements.email.value = user ? user.email : '';
  formEl.elements.firstName.value = user ? user.firstName : '';
  formEl.elements.lastName.value = user ? user.lastName : '';
  formEl.elements.password.required = !user;
  if (user) formEl.elements.roleId.value = user.roleId;
}

export function readUserForm(formEl) {
  const data = Object.fromEntries(new FormData(formEl));
  if (!data.password) delete data.password;
  return data;
}
