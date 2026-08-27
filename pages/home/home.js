import { mountShell } from '../../js/components/shell.js';
import { t, applyI18n } from '../../js/i18n/i18n.js';

async function init() {
  const actor = await mountShell('/pages/home/home.html', 'home:read');
  if (!actor) return;

  applyI18n();
  document.getElementById('welcome').textContent = t('home.welcome', { name: actor.user.firstName });
  document.getElementById('role-label').textContent = t('home.roleLabel', { role: actor.user.roleName });
}

init();
