type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

const readStored = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

const writeStored = (theme: Theme): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage blocked (private mode, etc.) — fall back to in-memory only
  }
};

const apply = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  document.dispatchEvent(new Event('themechange'));
};

export const initThemeToggle = (root: HTMLElement): void => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-theme-button]');
  const sync = (active: Theme): void => {
    apply(active);
    writeStored(active);
    buttons.forEach((btn) => {
      const value = btn.dataset.themeButton as Theme | undefined;
      btn.setAttribute('aria-pressed', value === active ? 'true' : 'false');
    });
  };

  const initial: Theme = readStored()
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  sync(initial);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.themeButton as Theme | undefined;
      if (isTheme(next)) {
        sync(next);
      }
    });
  });
};
