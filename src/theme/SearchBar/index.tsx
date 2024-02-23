import React, { useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { SearchButton } from '../SearchButton';
import { ThemeConfig } from '../../types';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { siteConfig } = useDocusaurusContext();
  const {
    glean: { searchOptions },
  } = siteConfig.themeConfig as ThemeConfig;

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.attach(containerRef.current!, searchOptions);
  }, [containerRef.current]);

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
