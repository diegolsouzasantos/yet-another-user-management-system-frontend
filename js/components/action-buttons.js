import { iconEl } from '/design-system/icons.js';
import { attachMenu } from '/design-system/menu.js';
import { createEl } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

export function iconButton(iconName, labelKey, { className = 'btn', onClick, title } = {}) {
  const button = createEl('button', { className, type: 'button' });
  if (title) button.title = t(title);
  button.append(iconEl(iconName, { size: 16 }), createEl('span', { textContent: t(labelKey) }));
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

export function decorateButton(buttonOrId, iconName) {
  const button = typeof buttonOrId === 'string' ? document.getElementById(buttonOrId) : buttonOrId;
  if (button && !button.querySelector('.ds-icon')) {
    button.prepend(iconEl(iconName, { size: 16 }));
  }
  return button;
}

export function rowActionsCell(actions) {
  const trigger = createEl('button', { className: 'ds-icon-btn', type: 'button', title: t('common.actions') });
  trigger.setAttribute('aria-label', t('common.actions'));
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.append(iconEl('ellipsis', { size: 18 }));

  attachMenu(trigger, actions.map((action) => ({
    label: t(action.labelKey),
    icon: action.icon,
    variant: action.variant,
    onSelect: action.onSelect,
  })));

  return createEl('td', { className: 'cell-actions' }, [trigger]);
}
