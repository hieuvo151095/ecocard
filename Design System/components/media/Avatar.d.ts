import * as React from 'react';

/** ECO Avatar — Photo or Initials (Shape circle/rounded × Size 24–72px × Border). */
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  bordered?: boolean;
  style?: React.CSSProperties;
}
export declare const Avatar: React.FC<AvatarProps>;
export default Avatar;
