import React, { useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

import { SearchButton } from '../SearchButton';
import { PluginOptions } from '../../options';
import { ModalSearchOptions } from '../../types';

const DEFAULT_SEARCH_OPTIONS = {
  dataSourceFilter: ['github'],
};

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const options = usePluginData('docusaurus-plugin-search-glean') as PluginOptions;

  const mergedSearchOptions = {
    ...DEFAULT_SEARCH_OPTIONS,
    ...options.searchOptions,
  } as ModalSearchOptions;

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
