import React, { useEffect, useRef } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

import { SearchButton } from '../SearchButton';
import { PluginOptions } from '../../options';
import { ModalSearchOptions } from '../../types';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };

  useEffect(() => {
    if (!window.EmbeddedSearch) return;

    window.EmbeddedSearch.attach(
      containerRef.current!,
      options.searchOptions as Required<ModalSearchOptions>,
    );
  }, [containerRef.current]);

  return (
    <span ref={containerRef}>
      <SearchButton />
    </span>
  );
}
