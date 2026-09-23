import * as React from 'react';

/**
 * ECO Sheet — bottom sheet (360 wide, 8px top radius) or centre sheet (Nav action × content type).
 *
 */
export interface SheetProps {
  open?: boolean;
  placement?: 'bottom' | 'center';
  title?: string;
  description?: string;
  /** Drag handle on bottom sheets. */
  handle?: boolean;
  navAction?: 'close' | 'back' | 'none';
  children?: React.ReactNode;
  /** Usually a ButtonBar. */
  footer?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare const Sheet: React.FC<SheetProps>;
export default Sheet;
