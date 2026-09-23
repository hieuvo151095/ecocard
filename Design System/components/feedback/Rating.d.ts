import * as React from 'react';

/** ECO Rating — 5 stars with full / half / no-rate states (Size × Rating value). */
export interface RatingProps {
  /** 0–5, halves allowed. */
  value?: number;
  size?: 'default' | 'large';
  showValue?: boolean;
  style?: React.CSSProperties;
}
export declare const Rating: React.FC<RatingProps>;
export default Rating;
