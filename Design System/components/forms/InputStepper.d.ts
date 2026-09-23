import * as React from 'react';

/** ECO Input stepper — 128×40 quantity control (Read-only × Shape × Input state × Disabled × Step status). */
export interface InputStepperProps {
  value?: number;
  min?: number;
  max?: number;
  shape?: 'rounded' | 'pill';
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}
export declare const InputStepper: React.FC<InputStepperProps>;
export default InputStepper;
