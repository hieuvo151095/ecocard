# Shared Accessibility Governance (`accessibility.md`)

1. **Contrast Standards**: Body text must achieve minimum 4.5:1 contrast against surface background (WCAG AA). Large text (>=18px) must achieve minimum 3:1.
2. **Keyboard Focus**: Interactive elements must render explicit `2px` focus rings (`--color-interactive-primary`).
3. **Screen Reader ARIA**: Form inputs must bind to `<label>` tags via `id`/`for`. Dynamic alerts must use `aria-live="polite"`.
4. **Reduced Motion**: All CSS transitions must respect `@media (prefers-reduced-motion: reduce)`.
