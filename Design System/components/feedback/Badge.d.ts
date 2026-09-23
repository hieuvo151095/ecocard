import * as React from 'react';

/** ECO Badge — 8px red dot or a text count pill (Type=Dot | Text). */
export interface BadgeProps {
  type?: 'dot' | 'text';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const Badge: React.FC<BadgeProps>;
export default Badge;
