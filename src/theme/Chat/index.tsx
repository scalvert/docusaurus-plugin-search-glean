import { type ReactNode, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ThemeVariant, ChatOptions } from '@gleanwork/web-sdk';

import useThemeChange from '../../hooks/useThemeChange';
import { useGleanConfig, GuestAuthProvider } from '../../utils';
import { useGleanSDK } from '../../hooks/useGleanSDK';

export default function ChatPage(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const { options } = useGleanConfig();
  const { initializeSDK, cleanup } = useGleanSDK();
  const backend = (options.chatOptions as ChatOptions)?.backend;

  const chatOptions = useMemo(() => options.chatOptions as ChatOptions, [options.chatOptions]);

  const initializeChat = useCallback(
    async (themeVariant: ThemeVariant = 'light') => {
      if (!containerRef.current) {
        return;
      }

      await initializeSDK(themeVariant, chatOptions, (sdk, finalOptions) => {
        if (containerRef.current) {
          sdk.default.renderChat(containerRef.current, finalOptions);
        }
      });
    },
    [initializeSDK, chatOptions],
  );

  const handleThemeChange = useCallback(
    async (theme: ThemeVariant) => {
      try {
        await initializeChat(theme);
      } catch (error) {
        console.error('Failed to initialize chat on theme change:', error);
      }
    },
    [initializeChat],
  );

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

    return cleanup;
  }, [initializeChat, initialTheme, cleanup]);

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

  if (options.enableAnonymousAuth && !!backend) {
    return (
      <GuestAuthProvider pluginOptions={options} backend={backend}>
        {chatElement}
      </GuestAuthProvider>
    );
  }

  return chatElement;
}
