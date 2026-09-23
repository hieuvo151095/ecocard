import * as React from 'react';

/** ECO Radio button — 20px circle in a 24px hit area (Checked × State × Disabled). */
export interface RadioProps {
  checked?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  name?: string;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export declare const Radio: React.FC<RadioProps>;
export default Radio;
