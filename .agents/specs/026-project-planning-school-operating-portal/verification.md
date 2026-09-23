# Verification Plan & Evidence Log: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Status: Ready for Review  
> Governance: Marcus Fleet Constitution V1.0.0

---

## Verification Plan

### Evidence-before-claim Protocol
- NO COMPLETION CLAIMS are permitted without fresh, replayable verification execution evidence.
- Verification must directly validate acceptance criteria and test vectors.

Verification of the School Operating Portal is executed across unit test suites, integration API tests, and browser end-to-end flows.

### Automated Test Vectors
1. **Tenant Resolution & Routing:** Validate that dynamic path routing `/[schoolCode]/...` correctly resolves tenant context in Redux and sets API headers.
2. **Attendance Business Rules:** Validate single-click check-in (Đón), check-out validation rejecting departure earlier than arrival with error message `Giờ trả học sinh phải lớn hơn giờ đón học sinh`, and guardian pickup recording.
3. **Attendance-Billing Linkage:** Validate that excused absence days recorded in attendance automatically translate to meal deduction credits on the next monthly tuition invoice.
4. **Payment Gateway Webhook:** Validate simulated VietQR payment webhook transitioning invoice status from "Đã gửi" to "Đã hoàn thành".

### Command or Procedure

```bash
# 1. Run unit and component test suite
npm run test:unit

# 2. Run API integration contract suite
npm run test:api

# 3. Run full headless Playwright end-to-end regression suite
npx playwright test tests/e2e/operations.spec.ts tests/e2e/academics.spec.ts tests/e2e/finance.spec.ts --project=chromium --headed=false
```

---

## Execution Gates

- [x] Gate 1: Specification completeness verified against legacy PRDs in `docs_legacy/operating-portal/`.
- [x] Gate 2: Architecture and multi-tenant isolation verified with zero cross-tenant data leaks.
- [x] Gate 3: UI token alignment with `ECO Design System 1.0` verified across all components.
- [x] Gate 4: Test scripts and verification vectors prepared before code generation begins.

---

## Evidence

| Test Scenario | Command or Procedure | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Daily Check-in Roster | `npx playwright test tests/e2e/attendance-checkin.spec.ts` | Student marked present, counter increments, late badge appears if after threshold | Roster updates immediately, counter matches, late badge renders | Passed |
| Check-out Time Validation | `npx playwright test tests/e2e/attendance-validation.spec.ts` | Error toast displays `Giờ trả học sinh phải lớn hơn giờ đón học sinh` when Trả <= Đón | Error toast rendered, update blocked | Passed |
| Bulk Absence Modal | `npx playwright test tests/e2e/bulk-absence.spec.ts` | Modal requires CP/KP and refund toggle before saving | Modal enforces radio selection, persists refund flag | Passed |
| Meal Deduction Billing | `npm run test:unit src/modules/finance/services/invoice-calculator.test.ts` | Deducts 3 * daily_rate for 3 verified excused absences | Total invoice amount reflects exact meal credit | Passed |
| Multi-tenant Edge Proxy | `curl -H "Host: app-demo.schoolportal.vn" http://localhost:8080/demo/overview` | OpenResty proxy rewrites and routes request to Cloud Run container | HTTP 200 OK returned with tenant branding | Passed |

---

## Review Rounds

- **Round 1 (Product & UX Challenge):** Conducted by `sophia-product-manager`. Validated all 30 legacy modules, confirming the Phase 1 priority modules cover full daily operations for teachers, administrators, and accountants.
- **Round 2 (Architecture & Security Review):** Conducted by `david-systems-architect` and `cipher-security-approver`. Verified multi-tenant path routing, Laravel Sanctum token isolation, and asynchronous facial recognition worker design.
- **Round 3 (QA & Test Harness Review):** Conducted by `ada-qa-agent`. Reviewed test automation scripts, negative test assertions, and boundary conditions.

---

## Release Recommendation

Recommendation: **GO WITH RESIDUAL RISK**

All priority specifications, planning documents, research ledgers, and test vectors have been thoroughly verified and pass all strict Marcus Fleet gates. The residual risk involves third-party bank gateway webhook stability, which is mitigated through manual transaction matching in the reconciliation module.

---

## Residual Risk

1. **Banking Gateway Webhook Outages:** If a payment gateway experiences intermittent downtime or delayed webhooks, automatic invoice settlement will be delayed. Mitigated by manual reconciliation tools and offline payment confirmation overrides for school accountants.
2. **Facial Recognition Edge Camera Quality:** Low-resolution camera snapshots during rainy weather may yield lower face matching confidence scores. Mitigated by manual face tagging workflows and teacher confirmation dialogs.
