import * as React from 'react';

export interface DropdownItem { id: string; label: string; icon?: React.ReactNode; disabled?: boolean }

/** ECO Dropdown menu — 328px floating list, 40px option rows (State × Selected × Disabled). */
export interface DropdownMenuProps {
  items?: DropdownItem[];
  selectedId?: string;
  width?: number;
  onSelect?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare const DropdownMenu: React.FC<DropdownMenuProps>;
export default DropdownMenu;
