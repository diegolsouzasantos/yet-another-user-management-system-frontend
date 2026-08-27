const STORAGE_KEY = 'yaums.sidebarCollapsed';

export function initSidebarToggle(sidebarEl, buttonEl) {
  const collapsed = localStorage.getItem(STORAGE_KEY) === 'true';
  sidebarEl.classList.toggle('sidebar--collapsed', collapsed);

  buttonEl.addEventListener('click', () => {
    const next = !sidebarEl.classList.contains('sidebar--collapsed');
    sidebarEl.classList.toggle('sidebar--collapsed', next);
    localStorage.setItem(STORAGE_KEY, String(next));
  });
}
