# Quickstart Validation: Student Management PWA (POC)

> Feature ID: `025-001-student-management-pwa`

## Local Preconditions

- Required services: Modern web browser (Chrome, Safari, Firefox).
- Required environment variables: None (Pure static PWA application).
- Required commands: Python 3 (`python3 -m http.server 8080`) or Node (`npx serve .`).

## Validation Path

1. Run local web server:
   ```bash
   python3 -m http.server 8080
   ```
2. Confirm:
   ```text
   Open http://localhost:8080 in desktop browser.
   Observe iPhone 16 Pro simulator frame centered on screen.
   Test "Điểm danh" tab: Change month filter (T9 - T5).
   Test "Bảng điểm" tab: Click "Học kỳ 1", "Học kỳ 2", "Cả năm".
   ```

## Expected Artifacts

- Files, logs, screenshots, or documents that should exist after validation:
  - `index.html`, `index.css`, `src/`, `manifest.json`, `sw.js`.
- Docs or ledger notes that must be updated before declaring completion:
  - `verification.md` evidence log and root `agents.md`.

## POC Rehearsal

- Smallest end-to-end path to demonstrate:
  1. Open app on desktop browser -> View iPhone 16 Pro simulator frame.
  2. Click "Điểm danh" -> View 96.5% attendance summary & monthly timeline.
  3. Click "Bảng điểm" -> Toggle between Học kỳ 1 (GPA 8.8) and Học kỳ 2 (GPA 9.0).
  4. Resize browser < 768px -> Confirm frame disappears for native mobile view.
- Evidence to capture during rehearsal: Browser screenshot and tab event logs.
- Criteria to stop and revise docs before broader execution: Failure of simulator responsive breakpoint.

## Rollback Check

- To rollback changes, run: `git reset --hard HEAD~1`.
