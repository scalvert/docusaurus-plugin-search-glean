import { useEffect, useRef, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig, GuestAuthProvider } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';
import { useGleanSDK } from '../../hooks/useGleanSDK';

function SearchBarInner() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();
  const { initializeSDK, cleanup } = useGleanSDK();
  const backend = (options.searchOptions as ModalSearchOptions)?.backend;

  const searchOptions = useMemo(
    () => options.searchOptions as ModalSearchOptions,
    [options.searchOptions],
  );

  const initializeSearch = useCallback(
    async (themeVariant: ThemeVariant = 'light') => {
      if (!containerRef.current) {
        return;
      }

      await initializeSDK(themeVariant, searchOptions, (sdk, finalOptions) => {
        if (containerRef.current) {
          sdk.attach(containerRef.current, finalOptions);
        }
      });
    },
    [initializeSDK, searchOptions],
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

export default function SearchBar() {
  const fallback = (
    <span>
      <SearchButton />
    </span>
  );

  return <BrowserOnly fallback={fallback}>{() => <SearchBarInner />}</BrowserOnly>;
}
