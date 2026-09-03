import { createEl } from '../../js/utils/dom.js';
import { t } from '../../js/i18n/i18n.js';
import { showToast } from '../../js/components/toast.js';
import { withLoading } from '../../js/components/loading.js';
import { iconEl } from '/design-system/icons.js';
import { confirmModal, openModal } from '/design-system/modal.js';
import { transferOwnership, listUsers } from '../../js/api/users.api.js';

function labelledButton(iconName, label, className) {
  const button = createEl('button', { className, type: 'button' });
  button.append(iconEl(iconName, { size: 16 }), createEl('span', { textContent: label }));
  return button;
}

async function runTransfer(target, container, reset) {
  const proceed = await confirmModal({
    title: t('users.transferConfirmTitle'),
    message: t('users.transferConfirmMessage', { name: `${target.firstName} ${target.lastName}` }),
    confirmLabel: t('common.continue'),
    cancelLabel: t('common.cancel'),
  });
  if (!proceed) return;

  const passwordInput = createEl('input', { type: 'password', className: 'list-filters__control' });
  const content = createEl('div', { className: 'form-field' }, [
    createEl('label', { textContent: t('users.currentPassword') }),
    passwordInput,
  ]);
  const confirmed = await openModal({
    title: t('users.transferPasswordTitle'),
    message: t('users.transferPasswordMessage'),
    content,
    confirmLabel: t('users.transferOwnership'),
    cancelLabel: t('common.cancel'),
  });
  if (!confirmed) return;

  try {
    await withLoading(transferOwnership(target.id, passwordInput.value));
    showToast(t('users.transferDone'));
    setTimeout(() => window.location.reload(), 1200);
  } catch (error) {
    showToast(error.message, 'error');
    reset();
  }
}

export function initOwnerTransferSection(container, actor) {
  const trigger = labelledButton('transfer', t('users.transferOwnership'), 'btn btn--sm');
  const reset = () => container.replaceChildren(trigger);

  trigger.addEventListener('click', async () => {
    let candidates;
    try {
      const { users } = await withLoading(listUsers({ limit: 100 }));
      candidates = users.filter((user) => (
        user.roleName === 'Administrator' && user.id !== actor.user.id && user.isActive
      ));
    } catch (error) {
      showToast(error.message, 'error');
      return;
    }

    if (!candidates.length) {
      showToast(t('users.transferNoCandidates'), 'error');
      return;
    }

    const select = createEl('select', { className: 'list-filters__control' });
    candidates.forEach((user) => select.add(
      new Option(`${user.firstName} ${user.lastName} — ${user.email}`, user.id),
    ));
    const confirmBtn = labelledButton('check', t('common.continue'), 'btn btn--sm btn--primary');
    const cancelBtn = labelledButton('x', t('common.cancel'), 'btn btn--sm');
    cancelBtn.addEventListener('click', reset);
    confirmBtn.addEventListener('click', () => {
      const target = candidates.find((candidate) => candidate.id === select.value);
      if (target) runTransfer(target, container, reset);
    });

    container.replaceChildren(select, confirmBtn, cancelBtn);
  });

  reset();
}
