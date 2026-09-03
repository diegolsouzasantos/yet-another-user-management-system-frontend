import { mountShell } from '../../js/components/shell.js';
import { t, applyI18n } from '../../js/i18n/i18n.js';
import { tData } from '../../js/i18n/data-i18n.js';

async function init() {
  const actor = await mountShell('/pages/home/home.html', null);
  if (!actor) return;

  applyI18n();
  document.getElementById('welcome').textContent = t('home.welcome', { name: actor.user.firstName });
  document.getElementById('role-label').textContent = t('home.roleLabel', { role: tData('systemRoles', actor.user.roleName) });
}

init();
