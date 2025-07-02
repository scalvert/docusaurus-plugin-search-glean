import { useEffect, useRef } from 'react';
import type { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig, applyGuestAuth } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();

  const initializeSearch = async (themeVariant: ThemeVariant = 'light') => {
    if (!containerRef.current) {
      return;
    }

    try {
      const { attach } = await import('@gleanwork/web-sdk');

      let searchOptions: ModalSearchOptions = {
        ...(options.searchOptions as Required<ModalSearchOptions>),
        themeVariant,
      };

      searchOptions = await applyGuestAuth(options, searchOptions);

      attach(containerRef.current, searchOptions);
    } catch (error) {
      console.error('Failed to load @gleanwork/web-sdk:', error);
    }
  };

  const initialTheme = useThemeChange((theme) => {
    void initializeSearch(theme);
  });

  useEffect(() => {
    void initializeSearch(initialTheme);
  });

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
