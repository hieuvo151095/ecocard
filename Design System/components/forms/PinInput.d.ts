import * as React from 'react';

/** ECO PIN — 40px cells (4 or 6) with dot masking, from the PIN page. */
export interface PinInputProps {
  length?: number;
  value?: string;
  /** Mask entered digits as 8px dots (secret PIN input). */
  secret?: boolean;
  state?: 'empty' | 'focus' | 'typing' | 'filled';
  disabled?: boolean;
  error?: boolean;
  style?: React.CSSProperties;
}
export declare const PinInput: React.FC<PinInputProps>;
export default PinInput;
