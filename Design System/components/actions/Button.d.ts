import * as React from 'react';

/**
 * ECO Button — the file's `Button` set (Shape × State × Disabled × Size ×
 * Content type × Type).
 *
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual weight. "soil" is the filled brand button (the file's Type=Soil). */
  type?: 'soil' | 'outline' | 'plain';
  size?: 'small' | 'medium' | 'large';
  /** "round" is the pill (30px radius) variant. */
  shape?: 'default' | 'border' | 'round';
  contentType?: 'text only' | 'leading icon' | 'trailing icon' | 'icon only';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  /** Renders the pressed skin (State=Yes). */
  pressed?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
