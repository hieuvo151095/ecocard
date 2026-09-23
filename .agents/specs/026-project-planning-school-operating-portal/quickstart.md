# Feature Quickstart Guide: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Status: Ready for Review  
> Governance: Marcus Fleet Constitution V1.0.0

---

## Local Preconditions

Before executing or testing the School Operating Portal locally:
1. Ensure Node.js 20+ and npm 10+ are installed.
2. Ensure Docker and Docker Compose are installed if running the local OpenResty gateway and database containers.
3. Verify that environment configuration `.env.local` contains:
   - `NEXT_PUBLIC_APP_NAME="School Operating Portal"`
   - `NEXTAUTH_SECRET="development-secret-key-32-chars-long"`
   - `NEXT_PUBLIC_DEFAULT_SCHOOL_CODE="demo"`
   - `NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"`

---

## Validation Path

Execute the following sequential verification sequence:

```bash
# 1. Install frontend dependencies
npm install

# 2. Run unit and integration tests
npm test

# 3. Build production bundle to verify zero SSR hydration or type errors
npm run build

# 4. Start local development server
npm run dev

# 5. Access the demo school portal in your browser
# URL: http://localhost:3000/demo/class/1/attendance
```

---

## Expected Artifacts

- Next.js web application files under `src/` structured by module:
  - `src/modules/operations/` (Attendance, Activity, Media, Messaging, Reports)
  - `src/modules/academics/` (Timetable, Homework, Gradebook)
  - `src/modules/finance/` (Invoicing, Fee Catalog, Tuition Management, Expenses, Reconciliation)
- Automated Playwright end-to-end test suites under `tests/e2e/`.
- OpenResty reverse proxy configuration under `docker/openresty/nginx.conf`.

---

## POC Rehearsal

Rehearse the primary operational proof-of-concept slice:
1. Open browser to `http://localhost:3000/demo/class/1/attendance`.
2. Locate student "Nguyễn Văn An".
3. Click the "Đón" button: verify that the arrival time updates to the current time and the "Tham dự" counter increments by 1.
4. Attempt to click "Trả" with an earlier timestamp: verify that the system rejects the input and renders toast notification `Giờ trả học sinh phải lớn hơn giờ đón học sinh`.
5. Click the gear icon next to "Trả": verify that the modal opens and lists registered guardians for selection.

---

## Rollback Check

If a deployment or code change introduces a regression:
1. For local testing, revert to the last stable git commit using `git reset --hard HEAD~1`.
2. For Cloud Run staging deployments, route 100% of traffic back to the previous stable revision using:
   ```bash
   gcloud run services update-traffic soha-school-portal-web --to-revisions=PREVIOUS_REVISION=100 --region=asia-southeast1
   ```
3. Verify that the previous revision is serving healthy responses via `curl -I https://app-demo.schoolportal.vn/health`.
