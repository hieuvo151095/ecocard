# Research Ledger & Domain Synthesis: School Administration Phase 2

**Feature ID:** `028-school-administration-module-phase-2`  
**Status:** DRAFT (Planning Genesis Mode — No Code Generated)

---

## 1. Traceability Ledger

| Source ID | Primary / Secondary | Domain Area | Document Reference | Evidence ID | Supported Claim |
|---|---|---|---|---|---|
| `S024` | Primary | Announcements | `docs_legacy/operating-portal/nha-truong/bang-thong-tin.md` | `E028` | `C027` |
| `S025` | Primary | Polls & Surveys | `docs_legacy/operating-portal/nha-truong/binh-chon.md` | `E029` | `C028` |
| `S026` | Primary | Meal Menus & Safety | `docs_legacy/operating-portal/nha-truong/thuc-don.md` | `E030`, `E031` | `C029`, `C030` |
| `S027` | Primary | Staff Attendance | `docs_legacy/operating-portal/nha-truong/diem-danh-nv.md` | `E032` | `C031` |
| `S028` | Primary | Parent Handbook | `docs_legacy/operating-portal/nha-truong/so-tay-ph.md` | `E033` | `C032` |

---

## 2. Key Insights & Architecture Findings

1. **Dual Announcement Dispatch Path for Menus:** When an administrator publishes a weekly menu with "Gửi thông báo", the system automatically generates an announcement entity in Bảng Thông Tin (`category: 'thuc_don'`, title: `Thực đơn tuần: {startDate} - {endDate}`). This requires loose coupling via foreign keys rather than tight database cascade constraints.
2. **Food Provenance in Vietnamese School Context:** School safety regulations require tracking commercial food providers. The system implements a dual traceability model: formal GS1 GTIN barcodes + batch numbers (for pre-packaged goods) vs internal farm/kitchen stamp codes (for local produce).
3. **High-Throughput Morning Staff Attendance:** Traditional modal confirmation patterns degrade UX when dozens of teachers and support staff clock in within a short 15-minute window. The UX strictly leverages optimistic single-click recording with inline badge editing, while reserving modal dialogs for exceptional status changes (absence requests).
4. **Knowledge Base Tree Ergonomics:** Multi-level hierarchies quickly become unusable on standard screens if unconstrained. Restricting the handbook to a strict 2-tier category depth with single-sibling accordion behavior ensures clear information scent and intuitive navigation.
