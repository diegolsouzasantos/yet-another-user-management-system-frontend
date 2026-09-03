import { t } from '../i18n/i18n.js';
import { showToast } from '../components/toast.js';
import { withLoading } from '../components/loading.js';
import { confirmModal } from '/design-system/modal.js';

export async function confirmAndDelete(messageKey, deleteFn) {
  const confirmed = await confirmModal({
    title: t('common.confirmDeleteTitle'),
    message: t(messageKey),
    confirmLabel: t('common.delete'),
    cancelLabel: t('common.cancel'),
    variant: 'danger',
  });
  if (!confirmed) return false;

  try {
    await withLoading(deleteFn());
    showToast(t('common.deleted'));
    return true;
  } catch (error) {
    showToast(error.message, 'error');
    return false;
  }
}
