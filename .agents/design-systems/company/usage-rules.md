# Design System Usage & Escalation Rules

## 1. Compliance Tiers

### Tier 1: Token Binding (Mandatory)
All colors, font sizes, line heights, margins, paddings, border radii, and box shadows MUST map directly to defined tokens in `tokens.json`. Arbitrary pixel values (e.g. `margin: 17px`, `color: #3b5998`) are compliance violations.

### Tier 2: Component Reuse (Mandatory)
Use existing component families from `components.md`. Do not re-implement custom HTML structures for standard patterns (e.g. custom select menus or floating cards).

### Tier 3: Layout Patterns (Standard)
Adhere to standard layout patterns from `patterns.md`. Any structural deviation requires an entry in `exception-register.md`.

---

## 2. Change Request & Escalation Policy

1. **Feature Exception**: Logged in `exception-register.md` for local, single-feature deviations. Does not bump design system version.
2. **System Extension**: Submitted via `design-system-change-request.md` when introducing new reusable tokens or components. Requires reviewer sign-off and semantic version bump.
