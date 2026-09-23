# Domain Research & Evidence Synthesis: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Governance: Marcus Fleet V34 Enterprise Architecture

---

## 1. Grounded Domain Sources & Legacy Audit

The specifications and data schemas for this feature package are derived directly from the thorough audit of the live Finviet / SOHA School Operating Portal documented in `docs_legacy/operating-portal/`:

1. **Operations Module Inventory:**
   - Source: `docs_legacy/operating-portal/van-hanh/diem-danh.md`
   - Key Finding: Morning arrival check-in requires sub-second response times. Business rule BR02 strictly dictates that departure time cannot be less than or equal to arrival time, raising validation code MSG01. An advanced gear icon modal (`pickup-button`) allows duty teachers to select from authorized guardians.
   - Source: `docs_legacy/operating-portal/van-hanh/hoat-dong.md`
   - Key Finding: Daily activity feed acts as an educational social wall linking classroom moments to curriculum lesson codes (`#`) and tagging students (`@`) with an administrative moderation workflow.
   - Source: `docs_legacy/operating-portal/van-hanh/thu-vien.md`
   - Key Finding: Automated system albums ("Hoạt động" and "Điểm danh") automatically ingest photos from respective modules, supplemented by facial recognition student tagging.

2. **Academics Module Inventory:**
   - Source: `docs_legacy/operating-portal/hoc-tap/thoi-khoa-bieu.md`
   - Key Finding: Class timetables are structured by morning and afternoon periods, requiring schedule versioning and parent broadcast logs.
   - Source: `docs_legacy/operating-portal/hoc-tap/bai-tap.md`
   - Key Finding: Homework tasks require assignment attachment distribution and student submission status tracking (Submitted, Missing, Graded).
   - Source: `docs_legacy/operating-portal/hoc-tap/diem-danh-gia.md`
   - Key Finding: Gradebook matrices support standardized scoring rubrics across oral, 15-minute, 1-period, midterm, and final examinations.

3. **Finance Module Inventory:**
   - Source: `docs_legacy/operating-portal/tai-chinh/hoc-phi.md`
   - Key Finding: Invoices manage full billing lifecycles with dynamic VietQR payment codes. Crucially, meal fees are dynamically calculated by subtracting verified excused absences recorded in the attendance module.
   - Source: `docs_legacy/operating-portal/tai-chinh/khoan-phi.md` and `quan-ly-hoc-phi.md`
   - Key Finding: Decoupling the master fee catalog from class-specific fee schedules allows schools to customize fee structures per cohort with price overrides.
   - Source: `docs_legacy/operating-portal/tai-chinh/doi-soat.md`
   - Key Finding: Automated reconciliation compares bank gateway transaction batches against internal student fee invoices to audit transaction counts and balances.

---

## 2. Architectural Design Evidence

- **Multi-Tenancy:** Preserved as single codebase with URL path tenant prefixes `/{schoolCode}/...` fronted by OpenResty.
- **Presentation Design:** Adheres strictly to `ECO Design System 1.0` tokens registered in `ECO Design System/readme.md`, incorporating Yellow `#FEC020` brand accent and Blue `#0070CE` primary.
- **Asynchronous AI Pipeline:** Offloading facial recognition to Cloud Run workers resolves the latency constraint identified in Contradiction K001.
