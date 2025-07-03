import { useEffect, useRef, useCallback } from 'react';
import type { ModalSearchOptions, ThemeVariant } from '@gleanwork/web-sdk';

import { SearchButton } from '../SearchButton';
import { useGleanConfig, useGuestAuthOptional, applyGuestAuth, GuestAuthProvider } from '../../utils';
import useThemeChange from '../../hooks/useThemeChange';

function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();
  const guestAuth = useGuestAuthOptional();
  const abortControllerRef = useRef<AbortController | null>(null);

  const initializeSearch = useCallback(async (themeVariant: ThemeVariant = 'light') => {
    if (!containerRef.current) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const { attach } = await import('@gleanwork/web-sdk');
      
      if (signal.aborted) return;

      let searchOptions: ModalSearchOptions = {
        ...(options.searchOptions as Required<ModalSearchOptions>),
        themeVariant,
      };

      if (guestAuth && !guestAuth.isLoading && guestAuth.authToken.token) {
        searchOptions = await applyGuestAuth(
          options,
          searchOptions,
          guestAuth.authToken,
          async () => {
            await guestAuth.refreshToken();
            return guestAuth.authToken;
          },
        );
      }

      if (signal.aborted || !containerRef.current) return;

      attach(containerRef.current, searchOptions);
    } catch (error) {
      if (!signal.aborted) {
        console.error('Failed to initialize search:', error);
      }
    }
  }, [options, guestAuth]);

  const handleThemeChange = useCallback(async (theme: ThemeVariant) => {
    try {
      await initializeSearch(theme);
    } catch (error) {
      console.error('Failed to initialize search on theme change:', error);
    }
  }, [initializeSearch]);

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

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [initializeSearch, initialTheme]);

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}

function SearchBarWithAuth() {
  const { options } = useGleanConfig();
  const backend = (options.searchOptions as ModalSearchOptions)?.backend;

  if (!options.enableAnonymousAuth || !backend) {
    return <SearchBarWrapper />;
  }

  return (
    <GuestAuthProvider pluginOptions={options} backend={backend}>
      <SearchBarWrapper />
    </GuestAuthProvider>
  );
}

export default SearchBarWithAuth;
