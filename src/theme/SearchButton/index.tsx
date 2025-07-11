import React from 'react';

import './index.css';

function SearchIcon() {
  return (
    <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type DocSearchButtonProps = React.ComponentProps<'input'>;

export const SearchButton = React.forwardRef<HTMLInputElement, DocSearchButtonProps>(
  ({ ...props }, ref) => {
    return (
      <div className="DocSearch DocSearch-Button">
        <input
          type="text"
          id="glean-search-input"
          className="DocSearch-Button-Input"
          placeholder="Search"
          readOnly
          aria-label="Search"
          {...props}
          ref={ref}
        />
        <div className="DocSearch-Button-Icon">
          <SearchIcon />
        </div>
      </div>
    );
  },
);

SearchButton.displayName = 'SearchButton';
