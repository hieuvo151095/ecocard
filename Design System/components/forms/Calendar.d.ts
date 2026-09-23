import * as React from 'react';

/**
 * ECO Calendar — 328×386 date picker (Header nav × Type: single / range / month-year / time-only).
 */
export interface CalendarProps {
  month?: string;
  /** Days in the displayed month. */
  days?: number;
  /** Weekday index (0 = Monday) the month starts on. */
  startDow?: number;
  /** Selected day numbers; two entries render a range when type="range". */
  selected?: number[];
  disabledDays?: number[];
  type?: 'single' | 'range';
  onSelect?: (day: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  style?: React.CSSProperties;
}
export declare const Calendar: React.FC<CalendarProps>;
export default Calendar;
