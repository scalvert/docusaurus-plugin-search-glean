import React, {useEffect, useRef} from 'react';
import {SearchButton} from '../SearchButton';

declare global {
  interface Window {
    EmbeddedSearch: {
      attach: (element: HTMLElement) => void;
    };
  }
}

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.attach(containerRef.current!);
  }, []);

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
