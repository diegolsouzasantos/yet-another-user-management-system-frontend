import { renderRelationList, renderAddControl } from './relation-list.js';
import { showToast } from './toast.js';
import { withLoading } from './loading.js';
import { t } from '../i18n/i18n.js';
import { confirmModal } from '/design-system/modal.js';

function missing(catalog, owned) {
  const ownedIds = new Set(owned.map((item) => item.id));
  return catalog.filter((item) => !ownedIds.has(item.id));
}

export async function confirmRemoval(name) {
  return confirmModal({
    title: t('relations.removeTitle'),
    message: t('relations.removeMessage', { name }),
    confirmLabel: t('common.remove'),
    cancelLabel: t('common.cancel'),
    variant: 'danger',
  });
}

export function wireRelation({
  listEl, addEl, owned, catalog, label, add, remove, readOnly, reload, addTitleKey, href,
}) {
  const run = async (promise, messageKey) => {
    try {
      await withLoading(promise);
      showToast(t(messageKey));
      reload();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  renderRelationList(listEl, owned, {
    label,
    readOnly,
    href,
    onRemove: async (item) => {
      if (await confirmRemoval(label(item))) run(remove(item.id), 'common.removed');
    },
  });

  renderAddControl(addEl, missing(catalog, owned), {
    label,
    readOnly,
    pickerTitle: addTitleKey ? t(addTitleKey) : undefined,
    onAdd: (ids) => run(add(ids), 'common.added'),
  });
}
