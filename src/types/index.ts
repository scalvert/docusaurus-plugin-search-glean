import { ModalSearchOptions, ChatOptions } from '@gleanwork/web-sdk';

declare global {
  interface Window {
    EmbeddedSearch: {
      attach: (element: HTMLElement, options: ModalSearchOptions) => void;
      renderChat: (element: HTMLElement, options: ChatOptions) => void;
    };
  }
}

export type { ThemeConfig } from './glean';
