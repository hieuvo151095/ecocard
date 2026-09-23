import * as React from 'react';

/**
 * ECO Text field — 328×56 field with floating label (State × Disabled × Error × Warning).
 */
export interface TextFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  state?: 'empty' | 'focus' | 'typing' | 'filled';
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  warning?: boolean;
  helperText?: string;
  /** Error / warning message; overrides helperText. */
  message?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare const TextField: React.FC<TextFieldProps>;
export default TextField;
