import { loadLocale, getLocale, supportedLocales, t } from '../i18n/i18n.js';
import { applyTheme, getTheme, themeModes } from '../theme/theme.js';
import { createEl } from '../utils/dom.js';

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
  const select = createEl('select', { title: t('theme.label') });
  themeModes().forEach((mode) => select.add(new Option(t(`theme.${mode}`), mode, false, mode === getTheme())));
  select.addEventListener('change', (event) => applyTheme(event.target.value));
  return select;
}
