import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyGuestAuth } from '../src/utils/guestAuth';
import type { PluginOptions } from '../src/options';

vi.mock('@gleanwork/web-sdk', () => ({
  createGuestAuthProvider: vi.fn(() => ({
    getAuthToken: vi.fn(() => Promise.resolve({
      token: 'test-token',
      expirationTime: Date.now() + 3600000,
    })),
  })),
}));

describe('Guest Authentication', () => {
  const mockOptions: PluginOptions = {
    searchOptions: {},
    chatOptions: {},
    chatPagePath: 'chat',
    enableAnonymousAuth: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('applyGuestAuth', () => {
    it('returns original options when anonymous auth is disabled', async () => {
      const options = { ...mockOptions, enableAnonymousAuth: false };
      const searchOptions = { backend: 'https://example.com' };
      const authToken = { token: 'test', expirationTime: Date.now() + 3600000 };

      const result = await applyGuestAuth(options, searchOptions, authToken);
      expect(result).toEqual(searchOptions);
    });

    it('returns original options when no backend is provided', async () => {
      const searchOptions = {};
      const authToken = { token: 'test', expirationTime: Date.now() + 3600000 };

      const result = await applyGuestAuth(mockOptions, searchOptions, authToken);
      expect(result).toEqual(searchOptions);
    });

    it('returns original options when no auth token is provided', async () => {
      const searchOptions = { backend: 'https://example.com' };

      const result = await applyGuestAuth(mockOptions, searchOptions);
      expect(result).toEqual(searchOptions);
    });

    it('applies auth token when all conditions are met', async () => {
      const searchOptions = { backend: 'https://example.com' };
      const authToken = { token: 'test', expirationTime: Date.now() + 3600000 };
      const onAuthTokenRequired = vi.fn();

      const result = await applyGuestAuth(mockOptions, searchOptions, authToken, onAuthTokenRequired);

      expect(result).toEqual({
        ...searchOptions,
        authToken,
        onAuthTokenRequired,
      });
    });
  });
}); 