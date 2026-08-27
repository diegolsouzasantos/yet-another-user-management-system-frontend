import { SIDEBAR_LINKS } from './links.js';
import { createEl } from '../../utils/dom.js';
import { t } from '../../i18n/i18n.js';

function canSee(actor, permission) {
  return actor.grantsAll || actor.permissions.includes(permission);
}

function buildLink(link, activeHref) {
  const isActive = link.href === activeHref;
  return createEl('a', {
    href: link.href,
    className: `sidebar__link${isActive ? ' sidebar__link--active' : ''}`,
    textContent: t(link.key),
  });
}

export function mountSidebarShell(sidebarEl) {
  const toggleEl = createEl('button', { className: 'sidebar__toggle', textContent: '☰' });
  const brand = createEl('div', { className: 'sidebar__brand' }, [
    createEl('span', { textContent: 'yaUMS' }),
    toggleEl,
  ]);
  const navEl = createEl('nav', { className: 'sidebar__nav' });

  sidebarEl.replaceChildren(brand, navEl);
  return { navEl, toggleEl };
}

export function renderSidebar(navEl, actor, activeHref) {
  const items = SIDEBAR_LINKS.filter((link) => canSee(actor, link.permission));
  navEl.replaceChildren(...items.map((link) => buildLink(link, activeHref)));
}
