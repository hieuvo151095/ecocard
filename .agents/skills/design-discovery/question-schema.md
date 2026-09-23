# Discovery Question Schema (`question-schema.md`)

When a feature request or PRD is ambiguous, `design-discovery` MUST select 5 to 8 targeted questions from the taxonomy categories below (incorporating Claude Design `jiji262/claude-design-skill` & `Trystan-SA/claude-design-system-prompt` standards).

---

## Category 1: Business Goal & Success Metric
* **Default Question**: What is the primary business problem this feature solves, and what measurable KPI or target outcome defines success (e.g., reduce task completion time, increase conversion, decrease user error rate)?

---

## Category 2: Target User Persona & Operational Context
* **Default Question**: Who is the primary end-user (e.g., Back-office ERP Admin, On-call Ops Engineer, Executive C-Suite)? What is their daily environment, technical proficiency, and usage frequency?

---

## Category 3: Primary & Alternate User Flows
* **Default Question**: What is the single most critical step-by-step user path from trigger to completion? What are the key alternate or failure paths that must be supported?

---

## Category 4: Key Business Rules & Validation Constraints
* **Default Question**: What mandatory business validation rules, permission gates, or data integrity boundaries govern this interface?

---

## Category 5: Core Asset & Fact Verification Inventory
* **Default Question**: Are there specific real logos, brand assets, product screenshots, or verified data entity schemas that must be integrated as core structural elements?

---

## Category 6: Platform & Device Priority
* **Default Question**: What is the target platform priority (Desktop-first vs Mobile-first vs Responsive Hybrid)? What screen resolution or viewports are primary?

---

## Category 7: Visual References & Anti-References
* **Default Question**: Are there existing UI reference patterns (internal or external) that embody the desired visual tone? Are there explicit anti-references (patterns to strictly avoid)?

---

## Category 8: Information Density & Layout Preference
* **Default Question**: Should this view lean towards High Density (compact table rows, dense form grid for power users) or Low Density (generous white space, card-based layout for executive summary)?

---

## Category 9: Sign-Off & Approval Criteria
* **Default Question**: Who are the required role-based reviewers (Product Manager, Design Lead, QA Lead), and what specific criteria will grant final sign-off for developer handoff?
