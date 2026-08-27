import { initCrudDialog } from '../../js/components/crud-dialog.js';
import { fillRoleForm, readRoleForm } from './roles-form.render.js';
import { createRole, updateRole } from '../../js/api/roles.api.js';

export function initRoleDialog(onSaved) {
  return initCrudDialog({
    dialogId: 'role-dialog',
    formId: 'role-form',
    createBtnId: 'create-btn',
    cancelBtnId: 'cancel-btn',
    createFn: createRole,
    updateFn: updateRole,
    fill: fillRoleForm,
    read: readRoleForm,
    onSaved,
  });
}
