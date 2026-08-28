import { t } from '../i18n/i18n.js';
import { showToast } from '../components/toast.js';
import { withLoading } from '../components/loading.js';

export async function confirmAndDelete(messageKey, deleteFn) {
  if (!window.confirm(t(messageKey))) return false;
  try {
    await withLoading(deleteFn());
    showToast(t('common.delete'));
    return true;
  } catch (error) {
    showToast(error.message, 'error');
    return false;
  }
}
