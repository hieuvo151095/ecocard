import * as React from 'react';

/** ECO Tooltip — dark 4px-radius hint with 8×4 arrow (Theme × Position: top/bottom/left/right). */
export interface TooltipProps {
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Shows the ✕ close affordance (the file's default). */
  dismissible?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
