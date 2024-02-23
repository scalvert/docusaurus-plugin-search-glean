export type {
  ThemeVariant,
  ThemeVariantOrAuto,
  ChatCustomizations,
  ModalSearchOptions,
  ChatOptions,
  ThemeConfig,
} from './glean';

import type { ModalSearchOptions, ChatOptions } from './glean';

declare global {
  interface Window {
    EmbeddedSearch: {
      attach: (element: HTMLElement, options: ModalSearchOptions) => void;
      renderChat: (element: HTMLElement, options: ChatOptions) => void;
    };
  }
}
