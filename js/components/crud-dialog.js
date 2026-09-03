import { showToast } from './toast.js';
import { withLoading } from './loading.js';
import { t } from '../i18n/i18n.js';
import { attachFormValidation } from '../utils/form-validation.js';

export function initCrudDialog({
  dialogId, formId, createBtnId, cancelBtnId, createFn, updateFn, fill, read, onSaved, validationRules,
}) {
  const dialog = () => document.getElementById(dialogId);
  const form = () => document.getElementById(formId);
  let editingId = null;

  const validator = validationRules ? attachFormValidation(form(), validationRules) : null;

  function openDialog(mode) {
    form().dataset.mode = mode;
    if (validator) validator.clear();
    dialog().showModal();
  }

  document.getElementById(createBtnId).addEventListener('click', () => {
    editingId = null;
    fill(form(), null);
    openDialog('create');
  });
  document.getElementById(cancelBtnId).addEventListener('click', () => dialog().close());

  form().addEventListener('submit', async (event) => {
    event.preventDefault();
    if (validator && !validator.validateAll()) return;

    const wasEditing = Boolean(editingId);
    const data = read(form());
    try {
      await withLoading(wasEditing ? updateFn(editingId, data) : createFn(data));
    } catch (error) {
      if (validator && error.fields && validator.applyServerErrors(error.fields)) return;
      showToast(error.message, 'error');
      return;
    }
    dialog().close();
    showToast(t(wasEditing ? 'common.updated' : 'common.created'));
    onSaved();
  });

  return {
    open(entity) {
      editingId = entity.id;
      fill(form(), entity);
      openDialog('edit');
    },
  };
}
