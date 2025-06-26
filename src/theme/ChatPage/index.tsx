import Layout from '@theme/Layout';
import type { ReactNode } from 'react';

import Chat from '../Chat';

export default function ChatPage(): ReactNode {
  return (
    <Layout>
      <Chat />
    </Layout>
  );
}
