import React, {useEffect, useRef} from 'react';
import {SearchButton} from '../SearchButton';
export default function SearchBarWrapper() {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!window.EmbeddedSearch) return;
    window.EmbeddedSearch.attach(containerRef.current);
  }, []);
  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
