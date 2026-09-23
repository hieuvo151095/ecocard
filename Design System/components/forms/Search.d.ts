import * as React from 'react';

/** ECO Search field — 40px search input with leading glyph and clear action. */
export interface SearchProps {
  value?: string;
  placeholder?: string;
  shape?: 'rounded' | 'pill';
  disabled?: boolean;
  /** Force the clear button; defaults to visible whenever value is non-empty. */
  showClear?: boolean;
  leadingIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onClear?: () => void;
  style?: React.CSSProperties;
}
export declare const Search: React.FC<SearchProps>;
export default Search;
