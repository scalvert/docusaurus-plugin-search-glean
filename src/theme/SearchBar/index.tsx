import { useEffect, useRef } from 'react';

import { SearchButton } from '../SearchButton';
import { PluginOptions } from '../../options';
import { ModalSearchOptions, ThemeVariant } from '../../types';
import useThemeChange from '../../hooks/useThemeChange';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();

  const initializeSearch = (themeVariant: ThemeVariant = 'light') => {
    if (window.EmbeddedSearch && containerRef.current) {
      window.EmbeddedSearch.attach(containerRef.current, {
        ...(options.searchOptions as Required<ModalSearchOptions>),
        themeVariant,
      });
    }
  };

  useEffect(() => {
    initializeSearch();
  }, []);

  useThemeChange((colorMode) => {
    initializeSearch(colorMode);
  });

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
