import { iconEl } from './icons.js';

let openMenu = null;

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  children.forEach((child) => child != null && node.append(child));
  return node;
}

function closeOpenMenu() {
  if (!openMenu) return;
  openMenu.node.remove();
  document.removeEventListener('click', openMenu.onDocClick, true);
  document.removeEventListener('keydown', openMenu.onKeydown, true);
  window.removeEventListener('resize', openMenu.close);
  window.removeEventListener('scroll', openMenu.close, true);
  openMenu = null;
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
    }, [
      item.icon ? iconEl(item.icon, { size: 16 }) : null,
      el('span', { textContent: item.label }),
    ]);
    button.addEventListener('click', () => {
      close();
      item.onSelect();
    });
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

export function attachMenu(trigger, items) {
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const wasOpen = openMenu && openMenu.trigger === trigger;
    closeOpenMenu();
    if (wasOpen) return;

    const list = typeof items === 'function' ? items() : items;
    const close = closeOpenMenu;
    const node = el('div', { className: 'ds-menu', role: 'menu' }, buildItems(list, close));

    const onDocClick = (evt) => { if (!node.contains(evt.target)) close(); };
    const onKeydown = (evt) => { if (evt.key === 'Escape') close(); };

    openMenu = { node, trigger, close, onDocClick, onKeydown };
    position(node, trigger);
    setTimeout(() => {
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKeydown, true);
      window.addEventListener('resize', close);
      window.addEventListener('scroll', close, true);
    });
  });
}
