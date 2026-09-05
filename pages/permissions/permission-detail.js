import { mountShell } from '../../js/components/shell.js';
import { applyI18n, t } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';
import { withLoading } from '../../js/components/loading.js';
import { formatDate } from '../../js/utils/format-date.js';
import { createEl } from '../../js/utils/dom.js';
import { decorateButton } from '../../js/components/action-buttons.js';
import { getPermission } from '../../js/api/permissions.api.js';

const id = new URLSearchParams(window.location.search).get('id');
const byId = (name) => document.getElementById(name);

function metaRow(labelKey, value) {
  return [
    createEl('dt', { textContent: t(labelKey) }),
    createEl('dd', { textContent: value }),
  ];
}

async function load() {
  const { permission } = await withLoading(getPermission(id));
  const resource = tData('resources', permission.resource);
  const action = tData('actions', permission.action);

  byId('detail-title').textContent = `${resource}:${action}`;
  byId('detail-sub').textContent = permission.description || '';

  const rows = [
    ...metaRow('permissions.resource', resource),
    ...metaRow('permissions.action', action),
    ...metaRow('common.createdAt', formatDate(permission.createdAt)),
    ...metaRow('common.updatedAt', formatDate(permission.updatedAt)),
  ];
  byId('detail-meta').replaceChildren(...rows);
}

async function init() {
  const actor = await mountShell('/pages/permissions/permissions.html', 'permissions:read');
  if (!actor) return;
  applyI18n();
  decorateButton('detail-back', 'arrowLeft');
  load();
}

init();
