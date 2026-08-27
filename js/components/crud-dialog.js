import { showToast } from './toast.js';
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
    if (editingId) await updateFn(editingId, data); else await createFn(data);
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
