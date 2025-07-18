import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {
  AuthTokenDetails,
  GuestAuthProvider as SDKGuestAuthProvider,
} from '@gleanwork/web-sdk';
import type { PluginOptions } from '../options';

const initialToken: AuthTokenDetails = {
  expirationTime: 0,
  token: '',
};

interface GuestAuthContextValue {
  authToken: AuthTokenDetails;
  isLoading: boolean;
  error: Error | null;
  refreshToken: () => Promise<void>;
}

const GuestAuthContext = createContext<GuestAuthContextValue | null>(null);

interface GuestAuthProviderProps {
  children: React.ReactNode;
  pluginOptions: PluginOptions;
  backend?: string;
}

export function GuestAuthProvider({ children, pluginOptions, backend }: GuestAuthProviderProps) {
  const [authToken, setAuthToken] = useState<AuthTokenDetails>(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [guestAuthProvider, setGuestAuthProvider] = useState<SDKGuestAuthProvider | null>(null);
  const isBrowser = useIsBrowser();

  const shouldUseGuestAuth = pluginOptions.enableAnonymousAuth && !!backend && isBrowser;

  useEffect(() => {
    const initializeProvider = async () => {
      if (shouldUseGuestAuth) {
        try {
          const { createGuestAuthProvider } = await import('@gleanwork/web-sdk');
          const provider = createGuestAuthProvider({ backend });
          setGuestAuthProvider(provider);
        } catch (error) {
          console.error('Failed to create guest auth provider:', error);
          setGuestAuthProvider(null);
        }
      } else {
        setGuestAuthProvider(null);
      }
    };

    initializeProvider();
  }, [shouldUseGuestAuth, backend]);

  const refreshToken = useCallback(async () => {
    if (!guestAuthProvider) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newToken = await guestAuthProvider.getAuthToken();
      setAuthToken(newToken);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get guest auth token');
      setError(error);
      console.error('Failed to get guest auth token:', error);
    } finally {
      setIsLoading(false);
    }
  }, [guestAuthProvider]);

  useEffect(() => {
    const initializeToken = async () => {
      if (guestAuthProvider) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token on provider change:', error);
        }
      }
    };

    initializeToken();
  }, [guestAuthProvider, refreshToken]);

  const contextValue: GuestAuthContextValue = {
    authToken,
    isLoading,
    error,
    refreshToken,
  };

  return <GuestAuthContext.Provider value={contextValue}>{children}</GuestAuthContext.Provider>;
}

export function useGuestAuth(): GuestAuthContextValue {
  const context = useContext(GuestAuthContext);

  if (!context) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }

  return context;
}

export function useGuestAuthOptional(): GuestAuthContextValue | null {
  return useContext(GuestAuthContext);
}

export async function applyGuestAuth<T extends { backend?: string }>(
  pluginOptions: PluginOptions,
  options: T,
  authToken?: AuthTokenDetails,
  onAuthTokenRequired?: () => Promise<AuthTokenDetails>,
): Promise<
  T & {
    authToken?: AuthTokenDetails;
    onAuthTokenRequired?: () => Promise<AuthTokenDetails>;
  }
> {
  if (!pluginOptions.enableAnonymousAuth || !options.backend || !authToken) {
    return options;
  }

  return {
    ...options,
    authToken,
    onAuthTokenRequired,
  };
}
