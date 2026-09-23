import * as React from 'react';

/** ECO Doc table (Table/Head, Table/Cell, Row/Action, Head/Content) — the 2-column spec-table primitive the file uses on every foundations page (colors, spacing, typography). */
export interface DocTableProps {
  columns?: string[];
  rows?: React.ReactNode[][];
  style?: React.CSSProperties;
}
export declare const DocTable: React.FC<DocTableProps>;
export default DocTable;
