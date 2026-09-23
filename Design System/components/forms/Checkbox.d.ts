import * as React from 'react';

/** ECO Checkbox — 24px hit area, 20px box, 4px radius (Checked × Type × State × Disabled). */
export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export declare const Checkbox: React.FC<CheckboxProps>;
export default Checkbox;
