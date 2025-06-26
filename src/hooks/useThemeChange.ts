import { useEffect, useState } from 'react';
import type { ThemeVariant } from '@gleanwork/web-sdk';

interface ThemeChangeCallback {
  (theme: ThemeVariant): void;
}

export default function useThemeChange(callback: ThemeChangeCallback): ThemeVariant {
  const [theme, setTheme] = useState<ThemeVariant>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';

    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        const newTheme: ThemeVariant = event.newValue;

        setTheme(newTheme);
        callback(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    window.addEventListener('DOMContentLoaded', () => {
      const currentTheme: ThemeVariant =
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
      setTheme(currentTheme);
      callback(currentTheme);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [callback]);

  return theme;
}
