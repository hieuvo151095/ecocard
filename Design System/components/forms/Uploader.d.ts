import * as React from 'react';

/** ECO Uploader — 104px dashed drop tile with uploaded preview (State × Disabled). */
export interface UploaderProps {
  state?: 'empty' | 'uploaded';
  /** Image URL shown when state is "uploaded". */
  src?: string;
  disabled?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  onPick?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export declare const Uploader: React.FC<UploaderProps>;
export default Uploader;
