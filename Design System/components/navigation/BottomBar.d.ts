import * as React from 'react';

export interface BottomBarItem { label: string; icon?: React.ReactNode }

/** ECO Bottom bar — plain 68px tab bar (Option first…fourth) with optional home-indicator strip. */
export interface BottomBarProps {
  items?: BottomBarItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  /** Adds the 29px iOS home-indicator area below the bar. */
  homeIndicator?: boolean;
  style?: React.CSSProperties;
}
export declare const BottomBar: React.FC<BottomBarProps>;
export default BottomBar;
