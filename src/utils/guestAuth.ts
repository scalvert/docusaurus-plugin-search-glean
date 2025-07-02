import { createGuestAuthProvider, type AuthTokenDetails, type GuestAuthProvider } from '@gleanwork/web-sdk';
import type { PluginOptions } from '../options';

let provider: GuestAuthProvider | null = null;
let providerBackend: string | undefined;

export function getGuestAuthProvider(
  pluginOptions: PluginOptions,
  backend?: string,
): GuestAuthProvider | null {
  if (!pluginOptions.enableAnonymousAuth || !backend) {
    return null;
  }

  if (!provider || providerBackend !== backend) {
    provider = createGuestAuthProvider({ backend });
    providerBackend = backend;
  }

  return provider;
}

export async function applyGuestAuth<T extends { backend?: string }>(
  pluginOptions: PluginOptions,
  options: T,
): Promise<T & {
  authToken?: AuthTokenDetails;
  onAuthTokenRequired?: () => Promise<AuthTokenDetails>;
}> {
  const guestAuthProvider = getGuestAuthProvider(pluginOptions, options.backend);

  if (!guestAuthProvider) {
    return options;
  }

  try {
    const authToken = await guestAuthProvider.getAuthToken();
    return {
      ...options,
      authToken,
      onAuthTokenRequired: () => guestAuthProvider.getAuthToken(),
    };
  } catch (error) {
    console.error('Failed to get guest auth token:', error);
    return options;
  }
}
