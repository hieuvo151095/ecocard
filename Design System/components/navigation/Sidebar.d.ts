import * as React from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

/** ECO Sidebar — 200px nav rail (88px collapsed); 40px rows, 48px child indent (Active × Has childrens). */
export interface SidebarProps {
  items?: SidebarItem[];
  activeId?: string;
  collapsed?: boolean;
  onSelect?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
