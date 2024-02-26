import React, { useEffect, useRef } from 'react';

import { SearchButton } from '../SearchButton';
import { PluginOptions } from '../../options';
import { ModalSearchOptions } from '../../types';
import { usePluginData } from '../../utils';

const DEFAULT_SEARCH_OPTIONS = {
  dataSourceFilter: ['github'],
};

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const options = usePluginData<PluginOptions>();

  const mergedSearchOptions = {
    ...DEFAULT_SEARCH_OPTIONS,
    ...(options.searchOptions || {}),
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
