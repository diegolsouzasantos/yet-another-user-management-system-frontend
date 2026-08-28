import { renderRelationList, renderAddControl } from './relation-list.js';
import { showToast } from './toast.js';
import { withLoading } from './loading.js';
import { t } from '../i18n/i18n.js';

function missing(catalog, owned) {
  const ownedIds = new Set(owned.map((item) => item.id));
  return catalog.filter((item) => !ownedIds.has(item.id));
}

export function wireRelation({
  listEl, addEl, owned, catalog, label, add, remove, readOnly, reload,
}) {
  const run = async (promise) => {
    try {
      await withLoading(promise);
      showToast(t('common.save'));
      reload();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  renderRelationList(listEl, owned, { label, readOnly, onRemove: (item) => run(remove(item.id)) });
  renderAddControl(addEl, missing(catalog, owned), { label, readOnly, onAdd: (id) => run(add(id)) });
}
