import { useEffect, useRef } from 'react';

import { SearchButton } from '../SearchButton';
import { ModalSearchOptions } from '../../types';
import { useGleanConfig } from '../../utils';

export default function SearchBarWrapper() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { options } = useGleanConfig();

  useEffect(() => {
    if (!window.EmbeddedSearch) {
      return;
    }

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
