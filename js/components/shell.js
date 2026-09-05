import { requireSession } from '../auth/guard.js';
import { loadLocale, t } from '../i18n/i18n.js';
import { applyTheme } from '../theme/theme.js';
import { mountSidebarShell, renderSidebar } from './sidebar/render.js';
import { initSidebarToggle } from './sidebar/toggle.js';
import { renderNavbar } from './navbar.js';
import { showToast } from './toast.js';

let globalErrorHandlingAttached = false;

function attachGlobalErrorHandling() {
  if (globalErrorHandlingAttached) return;
  globalErrorHandlingAttached = true;

  window.addEventListener('unhandledrejection', () => showToast(t('common.unexpectedError'), 'error'));
  window.addEventListener('error', () => showToast(t('common.unexpectedError'), 'error'));
}

export async function mountShell(activeHref, permission) {
  attachGlobalErrorHandling();
  applyTheme();
  await loadLocale();
  const actor = await requireSession(permission);
  if (!actor) return null;

  const sidebarEl = document.getElementById('sidebar');
  const { navEl, toggleEl } = mountSidebarShell(sidebarEl);

  renderSidebar(navEl, actor, activeHref);
  renderNavbar(document.getElementById('navbar'), actor);
  initSidebarToggle(sidebarEl, toggleEl);

  return actor;
}
