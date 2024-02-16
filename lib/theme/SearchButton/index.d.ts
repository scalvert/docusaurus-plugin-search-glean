import React from 'react';
import './index.css';
export type DocSearchButtonProps = React.ComponentProps<'button'>;
export declare const SearchButton: React.ForwardRefExoticComponent<
  Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'ref'
  > &
    React.RefAttributes<HTMLButtonElement>
>;
