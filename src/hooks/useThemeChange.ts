import { useEffect } from 'react';
import { useColorMode, ColorMode } from '@docusaurus/theme-common';

interface ThemeChangeCallback {
  (colorMode: ColorMode): void;
}

export default function useThemeChange(callback: ThemeChangeCallback) {
  const { colorMode } = useColorMode();

  useEffect(() => {
    callback(colorMode);
  }, [colorMode, callback]);
}
