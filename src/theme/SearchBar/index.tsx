import { useEffect, useRef, useCallback } from 'react';
import type { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig, GuestAuthProvider } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';
import { useGleanSDK } from '../../hooks/useGleanSDK';

export default function SearchBar() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();
  const { initializeSDK, cleanup } = useGleanSDK();
  const backend = (options.searchOptions as ModalSearchOptions)?.backend;

  const initializeSearch = useCallback(
    async (themeVariant: ThemeVariant = 'light') => {
      if (!containerRef.current) {
        return;
      }

      await initializeSDK(
        themeVariant,
        options.searchOptions as ModalSearchOptions,
        (sdk, finalOptions) => {
          if (containerRef.current) {
            sdk.attach(containerRef.current, finalOptions);
          }
        },
      );
    },
    [initializeSDK, options.searchOptions],
  );

  const handleThemeChange = useCallback(
    async (theme: ThemeVariant) => {
      try {
        await initializeSearch(theme);
      } catch (error) {
        console.error('Failed to initialize search on theme change:', error);
      }
    },
    [initializeSearch],
  );

  const initialTheme = useThemeChange(handleThemeChange);

  useEffect(() => {
    const initializeOnMount = async () => {
      try {
        await initializeSearch(initialTheme);
      } catch (error) {
        console.error('Failed to initialize search on mount:', error);
      }
    };

    initializeOnMount();

    return cleanup;
  }, [initializeSearch, initialTheme, cleanup]);

  const searchElement = (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );

  if (options.enableAnonymousAuth && backend) {
    return (
      <GuestAuthProvider pluginOptions={options} backend={backend}>
        {searchElement}
      </GuestAuthProvider>
    );
  }

  return searchElement;
}
