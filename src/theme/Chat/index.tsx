import { type ReactNode, useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import GleanWebSDK, { type ThemeVariant } from '@gleanwork/web-sdk';

import { PluginOptions } from '../../options';
import useThemeChange from '../../hooks/useThemeChange';

export default function ChatPage(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };

  const initializeChat = (themeVariant: ThemeVariant = 'light') => {
    if (containerRef.current) {
      GleanWebSDK.renderChat(containerRef.current, {
        ...(options.chatOptions || {}),
        themeVariant,
      });
    }
  };

  const initialTheme = useThemeChange((theme) => {
    initializeChat(theme);
  });

  useEffect(() => {
    initializeChat(initialTheme);
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: '85vh', // 85% of the viewport height; this is required for the chat to render
        width: '100%',
        position: 'relative',
      }}
    />
  );
}
