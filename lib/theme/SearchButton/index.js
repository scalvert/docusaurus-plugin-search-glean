import React from 'react';
import './index.css';
function SearchIcon() {
    return (<svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20">
      <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
export const SearchButton = React.forwardRef(({ ...props }, ref) => {
    return (<button type="button" id="glean-button" className="DocSearch DocSearch-Button" aria-label="Search" {...props} ref={ref}>
      <span className="DocSearch-Button-Container">
        <SearchIcon />
        <span className="DocSearch-Button-Placeholder">Search</span>
      </span>
    </button>);
});
SearchButton.displayName = 'SearchButton';
