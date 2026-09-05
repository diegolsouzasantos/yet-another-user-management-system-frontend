import { iconEl } from './icons.js';

let openMenu = null;

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  children.forEach((child) => child != null && node.append(child));
  return node;
}

function closeOpenMenu() {
  if (!openMenu) return;
  const { node, trigger, onDocClick, onKeydown } = openMenu;
  node.remove();
  document.removeEventListener('click', onDocClick, true);
  document.removeEventListener('keydown', onKeydown, true);
  window.removeEventListener('resize', closeOpenMenu);
  window.removeEventListener('scroll', closeOpenMenu, true);
  openMenu = null;
  if (trigger && typeof trigger.focus === 'function') trigger.focus();
}

function buildItems(items, close) {
  return items.map((item) => {
    if (item.separator) return el('div', { className: 'ds-menu__sep' });
    if (item.node) {
      const wrapper = el('div', { className: 'ds-menu__custom' }, [item.node]);
      if (item.closeOnChange) wrapper.addEventListener('change', () => close());
      return wrapper;
    }
    const button = el('button', {
      type: 'button',
      className: `ds-menu__item${item.variant ? ` ds-menu__item--${item.variant}` : ''}`,
      disabled: Boolean(item.disabled),
      title: item.disabled && item.disabledTitle ? item.disabledTitle : '',
    }, [
      item.icon ? iconEl(item.icon, { size: 16 }) : null,
      el('span', { textContent: item.label }),
    ]);
    if (!item.disabled) {
      button.addEventListener('click', () => {
        close();
        item.onSelect();
      });
    }
    return button;
  });
}

function position(node, trigger) {
  const rect = trigger.getBoundingClientRect();
  node.style.visibility = 'hidden';
  document.body.append(node);
  const menuRect = node.getBoundingClientRect();
  const top = Math.min(rect.bottom + 4, window.innerHeight - menuRect.height - 8);
  const left = Math.max(8, Math.min(rect.right - menuRect.width, window.innerWidth - menuRect.width - 8));
  node.style.top = `${Math.max(8, top)}px`;
  node.style.left = `${left}px`;
  node.style.visibility = '';
}

function focusableItems(node) {
  return [...node.querySelectorAll('.ds-menu__item')].filter((el) => !el.disabled);
}

function moveFocus(node, direction) {
  const focusable = focusableItems(node);
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement);
  const next = (index + direction + focusable.length) % focusable.length;
  focusable[next].focus();
}

export function attachMenu(trigger, items) {
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const wasOpen = openMenu && openMenu.trigger === trigger;
    closeOpenMenu();
    if (wasOpen) return;

    const list = typeof items === 'function' ? items() : items;
    const node = el('div', { className: 'ds-menu', role: 'menu' }, buildItems(list, closeOpenMenu));

    const onDocClick = (evt) => { if (!node.contains(evt.target)) closeOpenMenu(); };
    const onKeydown = (evt) => {
      if (evt.key === 'Escape') { closeOpenMenu(); return; }
      if (evt.key === 'ArrowDown') { evt.preventDefault(); moveFocus(node, 1); }
      if (evt.key === 'ArrowUp') { evt.preventDefault(); moveFocus(node, -1); }
    };

    openMenu = {
      node, trigger, onDocClick, onKeydown,
    };
    position(node, trigger);
    focusableItems(node)[0]?.focus();
    setTimeout(() => {
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKeydown, true);
      window.addEventListener('resize', closeOpenMenu);
      window.addEventListener('scroll', closeOpenMenu, true);
    });
  });
}
