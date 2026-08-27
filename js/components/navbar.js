import { getSession, clearSession } from '../auth/session.js';
import { logout } from '../api/auth.api.js';
import { loadLocale, getLocale, supportedLocales, t } from '../i18n/i18n.js';
import { createEl } from '../utils/dom.js';

async function handleLogout() {
  const { refreshToken } = getSession();
  try { await logout(refreshToken); } catch (error) { clearSession(); }
  clearSession();
  window.location.href = '/pages/login/login.html';
}

function buildLocaleSelect() {
  const select = createEl('select');
  supportedLocales().forEach((locale) => select.add(new Option(locale, locale, false, locale === getLocale())));
  select.addEventListener('change', async (event) => {
    await loadLocale(event.target.value);
    window.location.reload();
  });
  return select;
}

export function renderNavbar(navbarEl, actor) {
  const userLabel = createEl('span', {
    className: 'navbar__user',
    textContent: `${actor.user.firstName} ${actor.user.lastName}`,
  });
  const logoutBtn = createEl('button', { className: 'btn', textContent: t('nav.logout') });
  logoutBtn.addEventListener('click', handleLogout);

  navbarEl.replaceChildren(buildLocaleSelect(), userLabel, logoutBtn);
}
