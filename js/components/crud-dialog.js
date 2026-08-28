import { showToast } from './toast.js';
import { withLoading } from './loading.js';
import { t } from '../i18n/i18n.js';

export function initCrudDialog({
  dialogId, formId, createBtnId, cancelBtnId, createFn, updateFn, fill, read, onSaved,
}) {
  const dialog = () => document.getElementById(dialogId);
  const form = () => document.getElementById(formId);
  let editingId = null;

  document.getElementById(createBtnId).addEventListener('click', () => {
    editingId = null;
    fill(form(), null);
    dialog().showModal();
  });
  document.getElementById(cancelBtnId).addEventListener('click', () => dialog().close());

  form().addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = read(form());
    try {
      await withLoading(editingId ? updateFn(editingId, data) : createFn(data));
    } catch (error) {
      showToast(error.message, 'error');
      return;
    }
    dialog().close();
    showToast(t('common.save'));
    onSaved();
  });

  return {
    open(entity) {
      editingId = entity.id;
      fill(form(), entity);
      dialog().showModal();
    },
  };
}
