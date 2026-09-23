# Executable Task Package: ECO Card Portal Module M6 (Đối soát)

This file contains the concrete task ledger for implementing Module M6 following approved planning.

## Superpowers V34 Task Discipline
- Implementation tasks must be bite-sized and include exact file paths.
- Behavior-changing tasks must name the RED-GREEN-REFACTOR path:
  1. write or identify the failing test,
  2. run it and record the expected failure,
  3. implement the minimal fix,
  4. run the passing verification.
- Bugfix tasks must record root cause evidence before any fix.
- Review tasks must run in this order: spec compliance, then code quality.
- If a task cannot satisfy TDD, record the explicit exception and accepted risk.

---

### Phase 1: Foundation & Presentation Shell

- [ ] `T001`: Map ECO Design System 1.0 Tokens and Build Header Shell
  - Owner: benny-frontend-engineer
  - Write Scope: src/styles/tokens.css, src/components/layout/Header.jsx, src/components/layout/SubNav.jsx
  - Verification: Visual match comparison against screenshots with valid token compliance check.
  - Docs: docs/planning/screens.md
  - Sync: Consumes Design System/tokens/ and assets/icons/icon-data.js

- [ ] `T002`: Implement Domain Entities, Pricing Snapshot Store, and State Engine
  - Owner: david-systems-architect
  - Write Scope: src/data/models.js, src/context/PortalContext.jsx, src/data/seedData.js
  - Verification: Unit tests covering group CRUD, period generation, and snapshot serialization.
  - Docs: docs/planning/diagrams.md
  - Sync: Implements data schema defined in data-model.md

### Phase 2: Domain Engine & Sub-Modules

- [ ] `T003`: Build Active Student Scan Engine with 0 VND Blocker Guard
  - Owner: alan-tech-lead
  - Write Scope: src/services/reconciliationCalculator.js
  - Verification: Test threshold calculations, surplus day rounding, and MSG-01 zero-fee error triggering.
  - Docs: docs/prd.md
  - Sync: Enforces business rules BR03, BR06, BR07

- [ ] `T004`: Implement SM1 Group Master Table, Group Drawer, and Branch Drawer
  - Owner: benny-frontend-engineer
  - Write Scope: src/pages/SM1ConfigList.jsx, src/components/sm1/GroupDrawer.jsx, src/components/sm1/BranchDrawer.jsx
  - Verification: Test row expansion, schedule generation, service tariff inputs, and status switches.
  - Docs: docs/planning/screens.md
  - Sync: Consumes PortalContext.jsx state actions

- [ ] `T005`: Implement SM2 Session Master Table, 3-Step Wizard, and Detail Screen
  - Owner: benny-frontend-engineer
  - Write Scope: src/pages/SM2SessionList.jsx, src/components/sm2/CreateSessionModal.jsx, src/pages/SM2SessionDetail.jsx
  - Verification: Test 3-step wizard, zero-fee blocking, service breakdown table, and locked snapshot tab.
  - Docs: docs/planning/screens.md
  - Sync: Implements SM2 specifications and visual screenshots

- [ ] `T006`: Connect State Transitions and Nested Retroactive Session Creation
  - Owner: alan-tech-lead
  - Write Scope: src/services/sessionLifecycle.js, src/components/sm2/TruyThuModal.jsx
  - Verification: Test full lifecycle flow from Draft to Approval, Transmission, Paid, and Truy Thu generation.
  - Docs: docs/planning/flows.md
  - Sync: Enforces business rules BR06, BR07, BR08

### Phase 3: Verification & Quality Assurance

- [ ] `T007`: Pixel-Accuracy Audit Against 17 Screenshots and Final Verification Gate
  - Owner: ada-qa-agent
  - Write Scope: docs/verification.md, docs/memory.md
  - Verification: Run run_required_docs_gates.py and verify zero regressions against screenshots.
  - Docs: docs/verification.md
  - Sync: Validates Constitution Article IV compliance

---

## Parallel Groups

- Group A (Disjoint UI & Storage): `T001` and `T002` can execute in parallel as write scopes (`src/components/layout/` vs `src/data/`) are disjoint.
- Group B (Sub-Module Independence): `T004` (SM1 Views) and `T005` (SM2 Views) can proceed in parallel once core models in `T002` are verified.

---

## Execution Monitoring

- Daily sync on state store contracts and snapshot schema consistency.
- Real-time lint and token compliance validation on component additions.
- Automated gate checks executed upon completion of each phase.

---

## Review Loop Tasks

- [ ] `T008`: Spec and product alignment review round by sophia-product-manager.
  - Owner: sophia-product-manager
  - Write Scope: spec.md
  - Verification: Confirm all user stories and acceptance criteria trace to legacy documentation.
  - Docs: spec.md
  - Sync: Milestone review round 1
- [ ] `T009`: Technical architecture and contracts challenge review by david-systems-architect.
  - Owner: david-systems-architect
  - Write Scope: plan.md, contracts/
  - Verification: Confirm snapshot immutability, data models, and state diagrams are sound.
  - Docs: plan.md
  - Sync: Milestone review round 2
- [ ] `T010`: Final QA verification and acceptance sign-off by ada-qa-agent.
  - Owner: ada-qa-agent
  - Write Scope: verification.md
  - Verification: Confirm all tests pass, gates are satisfied, and recommendation is recorded.
  - Docs: verification.md
  - Sync: Milestone review round 3
