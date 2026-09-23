import * as React from 'react';

export interface BottomNavItem { label: string; icon?: React.ReactNode }

/**
 * ECO Bottom navigation (Consumer) — 360×90 tab bar with a notched 60px centre action.
 *
 * @startingPoint section="Navigation" subtitle="Consumer tab bar with centre pay action" viewport="700x160"
 */
export interface BottomNavigationProps {
  /** Four tabs; the centre action sits between items 2 and 3. */
  items?: BottomNavItem[];
  activeIndex?: number;
  centerAction?: BottomNavItem;
  onSelect?: (index: number) => void;
  style?: React.CSSProperties;
}
export declare const BottomNavigation: React.FC<BottomNavigationProps>;
export default BottomNavigation;
