import { initCrudDialog } from '../../js/components/crud-dialog.js';
import { fillUserForm, readUserForm } from './users-form.render.js';
import { createUser, updateUser } from '../../js/api/users.api.js';

export function initUserDialog(onSaved) {
  return initCrudDialog({
    dialogId: 'user-dialog',
    formId: 'user-form',
    createBtnId: 'create-btn',
    cancelBtnId: 'cancel-btn',
    createFn: createUser,
    updateFn: updateUser,
    fill: fillUserForm,
    read: readUserForm,
    onSaved,
  });
}
