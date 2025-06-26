import type { ModalSearchOptions, ChatOptions } from '@gleanwork/web-sdk';

declare global {
  interface Window {
    GleanWebSDK: {
      attach: (element: HTMLElement, options: ModalSearchOptions) => void;
      renderChat: (element: HTMLElement, options: ChatOptions) => void;
    };
  }
}

export type { ThemeConfig } from './glean';
