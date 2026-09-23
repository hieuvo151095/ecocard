import * as React from 'react';

export interface TabItem { label: string; icon?: React.ReactNode; badge?: boolean }

/** ECO Tab — 45px tabs, 2px blue active underline (Active × Top Icon × Qty × Collapse × Scroll position). */
export interface TabProps {
  items?: TabItem[];
  activeIndex?: number;
  /** Stack the icon above the label (Top Icon=True, 61px tall). */
  topIcon?: boolean;
  onSelect?: (index: number) => void;
  style?: React.CSSProperties;
}
export declare const Tab: React.FC<TabProps>;
export default Tab;
