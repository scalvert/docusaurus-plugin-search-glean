import { useCallback, useRef } from 'react';
import type { ThemeVariant, ModalSearchOptions, ChatOptions } from '@gleanwork/web-sdk';

import { useGleanConfig, useGuestAuthOptional, applyGuestAuth } from '../utils';

type SDKOptions = ModalSearchOptions | ChatOptions;

export function useGleanSDK() {
  const { options } = useGleanConfig();
  const guestAuth = useGuestAuthOptional();
  const abortControllerRef = useRef<AbortController | null>(null);

  const initializeSDK = useCallback(
    async <T extends SDKOptions>(
      themeVariant: ThemeVariant = 'light',
      sdkOptions: T,
      callback: (
        sdk: typeof import('@gleanwork/web-sdk'),
        finalOptions: T & { themeVariant: ThemeVariant },
      ) => void,
    ) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        const sdk = await import('@gleanwork/web-sdk');

        if (signal.aborted) return;

        let finalOptions = { ...sdkOptions, themeVariant };

        if (guestAuth && !guestAuth.isLoading && guestAuth.authToken.token) {
          const authAppliedOptions = await applyGuestAuth(
            options,
            finalOptions,
            guestAuth.authToken,
            async () => {
              await guestAuth.refreshToken();
              return guestAuth.authToken;
            },
          );
          finalOptions = authAppliedOptions as T & { themeVariant: ThemeVariant };
        }

        if (signal.aborted) return;

        callback(sdk, finalOptions);
      } catch (error) {
        if (!signal.aborted) {
          console.error('Failed to initialize SDK:', error);
        }
      }
    },
    [options, guestAuth],
  );

  const cleanup = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { initializeSDK, cleanup };
}
