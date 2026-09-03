import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';
import { iconButton } from './action-buttons.js';

export function createListToolbar({
  el, canDelete, onExport, onDeleteSelected,
}) {
  let count = 0;

  function render() {
    const info = createEl('span', {
      className: 'list-toolbar__count',
      textContent: count ? t('list.selectedCount', { count }) : '',
    });

    const exportBtn = iconButton('download', 'list.exportCsv', { className: 'btn btn--sm', onClick: onExport });

    const children = [info, exportBtn];
    if (canDelete) {
      const deleteBtn = iconButton('trash', 'list.deleteSelected', {
        className: 'btn btn--sm btn--danger', onClick: onDeleteSelected,
      });
      deleteBtn.disabled = count === 0;
      children.push(deleteBtn);
    }

    el.replaceChildren(createEl('div', { className: 'list-toolbar' }, children));
  }

  render();

  return {
    setCount(next) {
      count = next;
      render();
    },
  };
}
