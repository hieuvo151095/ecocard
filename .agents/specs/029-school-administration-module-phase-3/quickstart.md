# Quickstart Validation: School Administration Module Phase 3

> Feature ID: `029-school-administration-module-phase-3`  

---

## Local Preconditions

- Required services: Next.js dev server on port 3000 (`npm run dev`).
- Required environment variables: Default local tenant context `schoolCode=demo`.
- Required commands: Node.js 18+ and Python 3.10+.

## Validation Path

1. Run automated unit test suites:
   ```bash
   npm test tests/unit/feedback.test.mjs
   npm test tests/unit/calendar.test.mjs
   npm test tests/unit/academicYears.test.mjs
   npm test tests/unit/archive.test.mjs
   npm test
   ```
2. Confirm clean compilation:
   ```bash
   npx tsc --noEmit
   ```
3. Verify live HTTP endpoints:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/feedback
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/calendar
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/academic-year
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/archive
   ```

## Expected Artifacts

- Implementation components under `src/modules/school/` (`feedback`, `calendar`, `academicYear`, `archive`).
- TypeScript data contracts in `src/types/` (`feedback.ts`, `calendar.ts`, `academicYear.ts`, `archive.ts`).
- Business validation engines in `src/utils/` (`feedbackValidation.ts`, `calendarValidation.ts`, `academicYearValidation.ts`, `archiveValidation.ts`).
- Development ledger notes under `docs/development/`.
- Automated test suites under `tests/unit/`.

## POC Rehearsal

- Smallest end-to-end path:
  1. Open `/school/feedback/` and verify status card filtering while retaining independent global counter totals, inline priority editing, discussion thread, and ticket closure modal.
  2. Open `/school/calendar/` and verify 3 view modes (Year, Month, Event list with tear-away cards), semantic category color bands, and single-day event end-date auto-fill.
  3. Open `/school/academic-year/` and verify minimal 3-field form, automatic system-date current badge derivation, non-overlapping term validation, and reactive search.
  4. Open `/school/archive/` and verify student archive listing with withdrawal audit context, alphabetical sorting, student detail view with yellow warning banner, restoration with class continuity check, and two-step permanent deletion confirmation.

## Rollback Check

- Modular route isolation allows unmounting `/school/feedback/`, `/school/calendar/`, `/school/academic-year/`, and `/school/archive/` via navigation configuration without altering master student profiles, attendance records, or billing ledgers.
