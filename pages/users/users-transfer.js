import { createEl } from '../../js/utils/dom.js';
import { transferOwnership, listUsers } from '../../js/api/users.api.js';
import { showToast } from '../../js/components/toast.js';
import { t } from '../../js/i18n/i18n.js';

function buildDialog() {
  const select = createEl('select', { name: 'targetUserId', required: true });
  const password = createEl('input', { name: 'currentPassword', type: 'password', required: true });
  const cancelBtn = createEl('button', { type: 'button', className: 'btn', textContent: t('common.cancel') });
  const form = createEl('form', { method: 'dialog' }, [
    createEl('div', { className: 'form-field' }, [createEl('label', { textContent: t('users.targetUser') }), select]),
    createEl('div', { className: 'form-field' }, [
      createEl('label', { textContent: t('users.currentPassword') }), password,
    ]),
    createEl('button', { type: 'submit', className: 'btn btn--primary', textContent: t('common.save') }),
    cancelBtn,
  ]);
  const dialog = createEl('dialog', {}, [form]);

  document.body.append(dialog);
  cancelBtn.addEventListener('click', () => dialog.close());
  return { dialog, form, select };
}

async function populateCandidates(selectEl, currentUserId) {
  const { users } = await listUsers({ limit: 100 });
  const candidates = users.filter((user) => user.roleName === 'Administrator' && user.id !== currentUserId);
  selectEl.replaceChildren(...candidates.map((user) => new Option(`${user.firstName} ${user.lastName}`, user.id)));
}

export function initOwnerTransfer(actor) {
  if (!actor.user.isOwner) return;

  const button = document.getElementById('transfer-btn');
  const { dialog, form, select } = buildDialog();

  button.hidden = false;
  button.addEventListener('click', async () => {
    await populateCandidates(select, actor.user.id);
    dialog.showModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    await transferOwnership(data.targetUserId, data.currentPassword);
    showToast(t('common.save'));
    window.location.reload();
  });
}
