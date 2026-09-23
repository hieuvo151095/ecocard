# Forbidden Anti-Patterns ("Anti-Slop Rules")

> **Reference Standard**: Derived from Claude Design & Open Design Anti-Slop Guidelines (`jiji262/claude-design-skill` & `Trystan-SA/claude-design-system-prompt`).

## 1. Visual & Aesthetic Anti-Patterns ("Anti-Slop Rules")
* 🚫 **No Generic AI Gradients**: Backgrounds must use flat semantic token surface colors (`--color-bg-canvas`, `--color-bg-surface`). Multi-color linear/radial hero gradients are forbidden.
* 🚫 **No Emojis as Bullet Icons**: Do not use emojis (e.g. 🚀, ⚡, 💡) as list bullets or key point markers in production UI. Use SVG icons or clean bullet styling.
* 🚫 **No CSS Silhouette Placeholders**: Do not render grey CSS box silhouettes or fake wireframe shapes when real assets or SVGs can be rendered.
* 🚫 **No Floating Micro-Card Slop**: Do not break cohesive views into dozens of tiny disconnected floating boxes.
* 🚫 **No Unapproved Fonts**: Custom Google Fonts or decorative script fonts are strictly forbidden.
* 🚫 **No Low Contrast Text**: All text must achieve WCAG AA contrast ($> 4.5:1$ for body text).

## 2. Core Asset & Fact Verification Rules
* 🚫 **No Dummy Lorem Ipsum**: Real feature data, product specs, or verified domain terms must be used instead of dummy text.
* 🚫 **No Asset Misrepresentation**: Branded assets (logos, UI screenshots, product shots) must be preserved as primary elements rather than arbitrary style references.

## 3. Structural & UX Anti-Patterns
* 🚫 **No Missing Loading States**: Never leave a screen blank while fetching data; always display skeleton loader components.
* 🚫 **No Empty Screen Traps**: Empty lists/tables must show an instructive empty state with an actionable primary button.
* 🚫 **No Silent Failure**: Form validation errors must highlight the affected input and show explicit error messages.
