import React, { useEffect, useRef } from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

import './index.css';
import { useTitleFormatter } from '../../utils';

export default function ChatPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.renderChat(containerRef.current!, {});
  }, [containerRef.current]);

  return (
    <Layout>
      <Head>
        <title>{useTitleFormatter('chat')}</title>
        {/*
         We should not index search pages
          See https://github.com/facebook/docusaurus/pull/3233
        */}
        <meta property="robots" content="noindex, follow" />
      </Head>
      <div
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      />
    </Layout>
  );
}
