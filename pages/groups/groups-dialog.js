import { initCrudDialog } from '../../js/components/crud-dialog.js';
import { fillGroupForm, readGroupForm } from './groups-form.render.js';
import { createGroup, updateGroup } from '../../js/api/groups.api.js';

export function initGroupDialog(onSaved) {
  return initCrudDialog({
    dialogId: 'group-dialog',
    formId: 'group-form',
    createBtnId: 'create-btn',
    cancelBtnId: 'cancel-btn',
    createFn: createGroup,
    updateFn: updateGroup,
    fill: fillGroupForm,
    read: readGroupForm,
    onSaved,
  });
}
