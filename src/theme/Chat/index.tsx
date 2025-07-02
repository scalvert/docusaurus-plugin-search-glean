import { type ReactNode, useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import GleanWebSDK, { type ThemeVariant } from '@gleanwork/web-sdk';

import { PluginOptions } from '../../options';
import useThemeChange from '../../hooks/useThemeChange';
import { applyGuestAuth } from '../../utils';

export default function ChatPage(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };

  const initializeChat = async (themeVariant: ThemeVariant = 'light') => {
    if (!containerRef.current) {
      return;
    }

    let chatOptions = { ...(options.chatOptions || {}), themeVariant };
    chatOptions = await applyGuestAuth(options, chatOptions);

    GleanWebSDK.renderChat(containerRef.current, chatOptions);
  };

  const initialTheme = useThemeChange((theme) => {
    void initializeChat(theme);
  });

  useEffect(() => {
    void initializeChat(initialTheme);
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
