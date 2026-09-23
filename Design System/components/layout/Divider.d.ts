import * as React from 'react';

/** ECO Divider — 1px hairline or 8px thick rule, horizontal or vertical. */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'thick';
  style?: React.CSSProperties;
}
export declare const Divider: React.FC<DividerProps>;
export default Divider;
