import { loadLocale, getLocale, supportedLocales, t } from '../i18n/i18n.js';
import { applyTheme, getTheme, themeModes } from '../theme/theme.js';
import { createEl } from '../utils/dom.js';
import { iconEl } from '/design-system/icons.js';
import { attachMenu } from '/design-system/menu.js';

function field(labelText, control) {
  return createEl('div', { className: 'ds-field' }, [
    createEl('span', { className: 'ds-field__label', textContent: labelText }),
    control,
  ]);
}

export function buildLocaleSelect() {
  const select = createEl('select');
  supportedLocales().forEach((locale) => select.add(new Option(locale, locale, false, locale === getLocale())));
  select.addEventListener('change', async (event) => {
    await loadLocale(event.target.value);
    window.location.reload();
  });
  return select;
}

export function buildThemeSelect() {
  const select = createEl('select');
  themeModes().forEach((mode) => select.add(new Option(t(`theme.${mode}`), mode, false, mode === getTheme())));
  select.addEventListener('change', (event) => applyTheme(event.target.value));
  return select;
}

export function buildPreferencesButton() {
  const trigger = createEl('button', { className: 'ds-icon-btn', type: 'button', title: t('prefs.title') });
  trigger.setAttribute('aria-label', t('prefs.title'));
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.append(iconEl('sliders', { size: 18 }));

  attachMenu(trigger, () => [
    { node: field(t('theme.label'), buildThemeSelect()), closeOnChange: true },
    { node: field(t('nav.language'), buildLocaleSelect()) },
  ]);

  return trigger;
}
