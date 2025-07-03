import { type ReactNode, useEffect, useRef, useCallback } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import GleanWebSDK, { type ThemeVariant, type ChatOptions } from '@gleanwork/web-sdk';

import { PluginOptions } from '../../options';
import useThemeChange from '../../hooks/useThemeChange';
import { useGuestAuthOptional, applyGuestAuth, GuestAuthProvider } from '../../utils';

export default function ChatPage(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };
  const guestAuth = useGuestAuthOptional();
  const abortControllerRef = useRef<AbortController | null>(null);
  const backend = (options.chatOptions as ChatOptions)?.backend;

  const initializeChat = useCallback(async (themeVariant: ThemeVariant = 'light') => {
    if (!containerRef.current) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      let chatOptions = { ...(options.chatOptions || {}), themeVariant };

      if (guestAuth && !guestAuth.isLoading && guestAuth.authToken.token) {
        chatOptions = await applyGuestAuth(
          options,
          chatOptions,
          guestAuth.authToken,
          async () => {
            await guestAuth.refreshToken();
            return guestAuth.authToken;
          },
        );
      }

      if (signal.aborted || !containerRef.current) return;

      GleanWebSDK.renderChat(containerRef.current, chatOptions);
    } catch (error) {
      if (!signal.aborted) {
        console.error('Failed to initialize chat:', error);
      }
    }
  }, [options, guestAuth]);

  const handleThemeChange = useCallback(async (theme: ThemeVariant) => {
    try {
      await initializeChat(theme);
    } catch (error) {
      console.error('Failed to initialize chat on theme change:', error);
    }
  }, [initializeChat]);

  const initialTheme = useThemeChange(handleThemeChange);

  useEffect(() => {
    const initializeOnMount = async () => {
      try {
        await initializeChat(initialTheme);
      } catch (error) {
        console.error('Failed to initialize chat on mount:', error);
      }
    };

    initializeOnMount();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [initializeChat, initialTheme]);

  const chatElement = (
    <div
      ref={containerRef}
      style={{
        height: '85vh',
        width: '100%',
        position: 'relative',
      }}
    />
  );

  if (options.enableAnonymousAuth && backend) {
    return (
      <GuestAuthProvider pluginOptions={options} backend={backend}>
        {chatElement}
      </GuestAuthProvider>
    );
  }

  return chatElement;
}
