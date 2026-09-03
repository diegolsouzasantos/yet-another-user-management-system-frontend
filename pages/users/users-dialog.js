import { initCrudDialog } from '../../js/components/crud-dialog.js';
import { validators } from '../../js/utils/form-validation.js';
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
    validationRules: {
      email: validators.email,
      password: (value, form) => (
        form.dataset.mode === 'edit' ? validators.optionalPassword(value) : validators.password(value)
      ),
      firstName: validators.requiredText,
      lastName: validators.requiredText,
      roleId: validators.requiredSelect,
    },
  });
}
