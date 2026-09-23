import * as React from 'react';

/** ECO Date field — TextField with a trailing calendar affordance (Date field page). */
export interface DateFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  message?: string;
  trailingIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare const DateField: React.FC<DateFieldProps>;
export default DateField;
