import * as React from 'react';

/**
 * ECO Navigation bar — 360×56 top bar (Theme × Transparent × Style Text × 2 icon).
 *
 */
export interface NavigationBarProps {
  title?: string;
  subtitle?: string;
  theme?: 'default' | 'brand' | 'reverse';
  transparent?: boolean;
  align?: 'left' | 'center';
  /** Back / close glyph, 24px. */
  leading?: React.ReactNode;
  /** Trailing icon buttons. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const NavigationBar: React.FC<NavigationBarProps>;
export default NavigationBar;
