const STORAGE_KEY = 'yaums.theme';
const MODES = ['system', 'light', 'dark'];

export function getTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return MODES.includes(stored) ? stored : 'system';
}

export function applyTheme(mode = getTheme()) {
  const resolved = MODES.includes(mode) ? mode : 'system';
  document.documentElement.setAttribute('data-theme', resolved);
  localStorage.setItem(STORAGE_KEY, resolved);
}

export function themeModes() {
  return MODES;
}
