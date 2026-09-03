import { getSession, clearSession } from '../auth/session.js';
import { logout } from '../api/auth.api.js';
import { t } from '../i18n/i18n.js';
import { createEl } from '../utils/dom.js';
import { iconEl } from '/design-system/icons.js';
import { buildPreferencesButton } from './navbar-controls.js';

async function handleLogout() {
  const { refreshToken } = getSession();
  try { await logout(refreshToken); } catch (error) { clearSession(); }
  clearSession();
  window.location.href = '/pages/login/login.html';
}

export function renderNavbar(navbarEl, actor) {
  const profileBtn = createEl('button', { className: 'navbar__user ds-icon-btn', type: 'button', title: t('nav.profile') });
  profileBtn.append(
    iconEl('user', { size: 16 }),
    createEl('span', { textContent: `${actor.user.firstName} ${actor.user.lastName}` }),
  );
  profileBtn.addEventListener('click', () => {
    window.location.href = `/pages/users/user-detail.html?id=${actor.user.id}`;
  });

  const logoutBtn = createEl('button', { className: 'btn btn--sm', type: 'button' });
  logoutBtn.append(iconEl('logout', { size: 16 }), createEl('span', { textContent: t('nav.logout') }));
  logoutBtn.addEventListener('click', handleLogout);

  navbarEl.replaceChildren(buildPreferencesButton(), profileBtn, logoutBtn);
}
