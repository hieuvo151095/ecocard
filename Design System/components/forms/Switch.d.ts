import * as React from 'react';

/** ECO Switch — 40×24 track with a 20px knob (Checked × State × Disabled). */
export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export declare const Switch: React.FC<SwitchProps>;
export default Switch;
