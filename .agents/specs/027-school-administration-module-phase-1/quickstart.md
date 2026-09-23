# Quickstart Validation: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`

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
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/kid
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/teacher
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/class
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/subject
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/grades
   ```

## Expected Artifacts

- Implementation components under `src/modules/school/` (student, teacher, class, subject, grades).
- TypeScript data contracts in `src/types/` (student, teacher, class, subject, grade).
- Business validation engines in `src/utils/`.
- Development ledger notes under `docs/development/`.
- Automated test suites under `tests/unit/`.

## POC Rehearsal

- Smallest end-to-end path:
  1. Open `/school/kid/` and verify student roster, notes modal, and 360° detail hub tabs.
  2. Open `/school/teacher/` and verify faculty list, substring search, and moderation tier badge.
  3. Open `/school/class/` and verify curricular/extracurricular tabs, and deletion restriction on classes with students.
  4. Open `/school/subject/` and verify 4 educational tier tabs, read-only evaluation rubrics, and faculty assignment.
  5. Open `/school/grades/` and verify aggregate cards, class rosters, and reactive instant search.

## Rollback Check

- Feature flag gating or modular component isolation allows disabling newly mounted school administration routes without impacting existing Attendance, Invoicing, or Activity operational workflows.
