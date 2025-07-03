import { useEffect, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type { ThemeVariant } from '@gleanwork/web-sdk';

interface ThemeChangeCallback {
  (theme: ThemeVariant): void;
}

export default function useThemeChange(callback: ThemeChangeCallback): ThemeVariant {
  // Always start with a deterministic value so SSR and first client render match
  const [theme, setTheme] = useState<ThemeVariant>('light');

  const isBrowser = useIsBrowser();

  // After hydration, read persisted theme and notify the caller
  useEffect(() => {
    if (!isBrowser) return;

    const savedTheme = localStorage.getItem('theme');
    const currentTheme: ThemeVariant = savedTheme === 'dark' ? 'dark' : 'light';

    setTheme(currentTheme);
    callback(currentTheme);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        const newTheme: ThemeVariant = event.newValue;
        setTheme(newTheme);
        callback(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [callback, isBrowser]);

  return theme;
}
