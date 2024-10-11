import { useEffect, useRef } from 'react';
import GleanWebSDK, { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();

  const initializeSearch = (themeVariant: ThemeVariant = 'light') => {
    if (containerRef.current) {
      GleanWebSDK.attach(containerRef.current, {
        ...(options.searchOptions as Required<ModalSearchOptions>),
        themeVariant,
      });
    }
  };

  const initialTheme = useThemeChange((theme) => {
    initializeSearch(theme);
  });

  useEffect(() => {
    initializeSearch(initialTheme);
  });

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
