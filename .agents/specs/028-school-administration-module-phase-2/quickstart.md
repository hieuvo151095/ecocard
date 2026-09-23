# Quickstart Validation: School Administration Module Phase 2

> Feature ID: `028-school-administration-module-phase-2`

## Local Preconditions

- Required services: Next.js dev server on port 3000 (`npm run dev`).
- Required environment variables: Default local tenant context `schoolCode=demo`.
- Required commands: Node.js 18+ and Python 3.10+.

## Validation Path

1. Run automated unit test suites:
   ```bash
   npm test
   ```
2. Confirm clean compilation:
   ```bash
   npx tsc --noEmit
   ```
3. Verify live HTTP endpoints:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/announcement
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/poll
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/menu
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/staff-attendance
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/handbook
   ```

## Expected Artifacts

- Implementation components under `src/modules/school/` (announcement, poll, menu, staffAttendance, handbook).
- TypeScript data contracts in `src/types/` (announcement, poll, menu, staffAttendance, handbook).
- Business validation engines in `src/utils/`.
- Development ledger notes under `docs/development/`.
- Automated test suites under `tests/unit/`.

## POC Rehearsal

- Smallest end-to-end path:
  1. Open `/announcement/` and verify announcement roster, draft-only editing, preview modal, and bulk deletion warning.
  2. Open `/school/poll/` and verify survey builder, decoupled audience dispatch, live progress bars, and conditional pie chart.
  3. Open `/school/menu/` and verify 8-week horizon, class fallback to school-wide menu, and GTIN traceability parser.
  4. Open `/school/staff-attendance/` and verify rapid 1-click clock-in, 45-day past window, and search-time counter suppression.
  5. Open `/school/handbook/` and verify 2-tier category tree, single-sibling accordion, and cascading deletion confirmation.

## Rollback Check

- Modular route isolation allows unmounting `/announcement/`, `/school/poll/`, `/school/menu/`, `/school/staff-attendance/`, and `/school/handbook/` via navigation configuration without altering master data or operational records.
