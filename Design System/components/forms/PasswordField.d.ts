import * as React from 'react';

/** ECO Password — masked field with reveal toggle and rule checklist (Password page). */
export interface PasswordRule { label: string; met?: boolean }
export interface PasswordFieldProps {
  label?: string;
  value?: string;
  revealed?: boolean;
  disabled?: boolean;
  error?: boolean;
  message?: string;
  rules?: PasswordRule[];
  onChange?: (value: string) => void;
  onToggle?: () => void;
  style?: React.CSSProperties;
}
export declare const PasswordField: React.FC<PasswordFieldProps>;
export default PasswordField;
