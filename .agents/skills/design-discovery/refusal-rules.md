# Refusal & Gatekeeper Rules (`refusal-rules.md`)

> **MANDATE**: `design-discovery` acts as a strict GATEKEEPER. Rendering any visual UI artifact (`board.html`, `prototype.html`, `components.html`) before discovery passes is STRICTLY FORBIDDEN.

---

## 1. Hard Refusal Triggers

An agent MUST STOP execution and issue a `clarification-request.md` if ANY of the 5 Mandatory Discovery Fields are missing, empty, or placeholder-only in `design-brief.md`:

1. **`business_goal` Missing**: The request describes UI elements without stating why the feature exists or what problem it solves.
2. **`primary_user` Missing**: Unclear who will interact with the screen.
3. **`primary_flow` Missing**: Unclear what steps the user takes to accomplish their task.
4. **`constraints` Missing**: Missing platform, business rules, or technical limits.
5. **`approval_criteria` Missing**: Unclear how stakeholders will verify acceptance.

---

## 2. Refusal Response Format

When refusing to proceed to rendering, emit `clarification-request.md` using the following exact structure:

```markdown
# 🛑 DESIGN DISCOVERY GATEKEEPER: CLARIFICATION REQUIRED

The feature request cannot proceed to visual rendering because required brief context is ambiguous or incomplete.

### Missing Critical Inputs
- [ ] **`business_goal`**: Unspecified business goal or KPI target.
- [ ] **`primary_flow`**: Unclear user flow steps.

### Clarification Questions (Batch 1 of 1)
1. [Question from category 1]
2. [Question from category 3]
3. [Question from category 8]

**Next Action**: Please reply to the questions above. Once answered, `/design` will populate `design-brief.md`, validate readiness, and proceed to design system binding.
```
