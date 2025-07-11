import { useEffect, useRef, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig, GuestAuthProvider } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';
import { useGleanSDK } from '../../hooks/useGleanSDK';
import './index.css';

function SearchBarInner() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { options } = useGleanConfig();
  const { initializeSDK, cleanup } = useGleanSDK();

  const searchOptions = useMemo(
    () => options.searchOptions as ModalSearchOptions,
    [options.searchOptions],
  );

  const initializeSearch = useCallback(
    async (themeVariant: ThemeVariant = 'light') => {
      if (!buttonRef.current) {
        return;
      }

      await initializeSDK(themeVariant, searchOptions, (sdk, finalOptions) => {
        if (buttonRef.current) {
          sdk.attach(buttonRef.current, finalOptions);
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

  return (
    <div className="searchContainer">
      <SearchButton ref={buttonRef} />
    </div>
  );
}

function SearchBarWrapper() {
  const { options } = useGleanConfig();
  const backend = (options.searchOptions as ModalSearchOptions)?.backend;

  if (options.enableAnonymousAuth && backend) {
    return (
      <GuestAuthProvider pluginOptions={options} backend={backend}>
        <SearchBarInner />
      </GuestAuthProvider>
    );
  }

  return <SearchBarInner />;
}

export default function SearchBar() {
  const fallback = (
    <div className="searchContainer">
      <SearchButton />
    </div>
  );

  return <BrowserOnly fallback={fallback}>{() => <SearchBarWrapper />}</BrowserOnly>;
}
