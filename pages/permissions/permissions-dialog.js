import { initCrudDialog } from '../../js/components/crud-dialog.js';
import { fillPermissionForm, readPermissionForm } from './permissions-form.render.js';
import { createPermission, updatePermission } from '../../js/api/permissions.api.js';

export function initPermissionDialog(onSaved) {
  return initCrudDialog({
    dialogId: 'permission-dialog',
    formId: 'permission-form',
    createBtnId: 'create-btn',
    cancelBtnId: 'cancel-btn',
    createFn: createPermission,
    updateFn: updatePermission,
    fill: fillPermissionForm,
    read: readPermissionForm,
    onSaved,
  });
}
