import * as React from 'react';

/** ECO Overlay — the scrim behind sheets and notifications (40% black; 70% for image/media overlays). */
export interface OverlayProps {
  visible?: boolean;
  strength?: 'scrim' | 'strong';
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare const Overlay: React.FC<OverlayProps>;
export default Overlay;
