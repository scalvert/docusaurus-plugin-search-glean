import React, { useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { SearchButton } from '../SearchButton';
import { ThemeConfig } from '../../types';

const DEFAULT_SEARCH_OPTIONS = {
  dataSourceFilter: ['github'],
};

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { siteConfig } = useDocusaurusContext();
  const {
    glean: { searchOptions },
  } = siteConfig.themeConfig as ThemeConfig;

  const mergedSearchOptions = {
    ...DEFAULT_SEARCH_OPTIONS,
    ...searchOptions,
  };

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.attach(containerRef.current!, mergedSearchOptions);
  }, [containerRef.current]);

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
