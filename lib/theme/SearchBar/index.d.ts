import React from 'react';
declare global {
  interface Window {
    EmbeddedSearch: {
      attach: (element: HTMLElement) => void;
    };
  }
}
export default function SearchBarWrapper(): React.JSX.Element;
