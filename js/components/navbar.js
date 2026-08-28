import { getSession, clearSession } from '../auth/session.js';
import { logout } from '../api/auth.api.js';
import { t } from '../i18n/i18n.js';
import { createEl } from '../utils/dom.js';
import { buildLocaleSelect, buildThemeSelect } from './navbar-controls.js';

async function handleLogout() {
  const { refreshToken } = getSession();
  try { await logout(refreshToken); } catch (error) { clearSession(); }
  clearSession();
  window.location.href = '/pages/login/login.html';
}

export function renderNavbar(navbarEl, actor) {
  const userLabel = createEl('span', {
    className: 'navbar__user',
    textContent: `${actor.user.firstName} ${actor.user.lastName}`,
  });
  const logoutBtn = createEl('button', { className: 'btn', textContent: t('nav.logout') });
  logoutBtn.addEventListener('click', handleLogout);

  navbarEl.replaceChildren(buildThemeSelect(), buildLocaleSelect(), userLabel, logoutBtn);
}
