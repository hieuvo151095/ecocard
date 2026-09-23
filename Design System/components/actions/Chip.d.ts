import * as React from 'react';

/** ECO Chip — 32px pill filter / selection token (State × Active × Disabled × Image × Leading icon). */
export interface ChipProps {
  children?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Image URL rendered as a 24px round leading thumbnail. */
  image?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare const Chip: React.FC<ChipProps>;
export default Chip;
