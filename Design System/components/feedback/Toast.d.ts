import * as React from 'react';

/** ECO Toast bar — 328px transient message (Type=Neutral | Informative | Positive | Negative). */
export interface ToastProps {
  message?: string;
  type?: 'neutral' | 'informative' | 'positive' | 'negative';
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const Toast: React.FC<ToastProps>;
export default Toast;
