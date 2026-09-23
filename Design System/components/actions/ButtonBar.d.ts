import * as React from 'react';

/** ECO Button bar — the pinned action footer (Qty × Direction) from the Button bar page. */
export interface ButtonBarProps {
  primaryLabel?: string;
  /** Omit for a single-action bar. */
  secondaryLabel?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  onPrimary?: () => void;
  onSecondary?: () => void;
  style?: React.CSSProperties;
}
export declare const ButtonBar: React.FC<ButtonBarProps>;
export default ButtonBar;
