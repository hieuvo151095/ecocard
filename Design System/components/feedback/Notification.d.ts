import * as React from 'react';

/** ECO Notification pop-up — centred 16px-radius card with a divided action row (Notification pop up × Simple). */
export interface NotificationProps {
  open?: boolean;
  title?: string;
  body?: string;
  /** 128px illustration above the body. */
  image?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  style?: React.CSSProperties;
}
export declare const Notification: React.FC<NotificationProps>;
export default Notification;
