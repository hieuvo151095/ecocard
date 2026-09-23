import * as React from 'react';

/** ECO Textarea — multi-line field from the Text field page (Textarea frames). */
export interface TextareaProps {
  label?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  /** Shows the n/max counter when set. */
  maxLength?: number;
  disabled?: boolean;
  error?: boolean;
  message?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare const Textarea: React.FC<TextareaProps>;
export default Textarea;
