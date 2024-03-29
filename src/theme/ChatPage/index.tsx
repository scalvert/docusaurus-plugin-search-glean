import React, { useEffect, useRef } from 'react';
import Head from '@docusaurus/Head';
import { usePluginData } from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';

import { useTitleFormatter } from '../../utils';
import { PluginOptions } from '../../options';

export default function ChatPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.renderChat(containerRef.current!, options.chatOptions || {});
  }, [containerRef.current]);

  return (
    <Layout>
      <Head>
        <title>{useTitleFormatter('chat')}</title>
        <meta property="robots" content="noindex, follow" />
      </Head>
      <div
        ref={containerRef}
        style={{
          height: '85vh', // 85% of the viewport height; this is required for the chat to render
          width: '100%',
          position: 'relative',
        }}
      />
    </Layout>
  );
}
