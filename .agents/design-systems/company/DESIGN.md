# Enterprise Company Design System (`DESIGN.md`)

> **Version**: 1.2.0  
> **Status**: Active (Core System)  
> **Scope**: Default Single Source of Visual Truth for all Enterprise UI Features.  
> **Theme Rule**: **LIGHT MODE FIRST MANDATE**. All core enterprise UI components and artifacts MUST strictly default to clean, high-contrast Light Mode (`--color-bg-canvas: #f8fafc`, `--color-bg-surface: #ffffff`).

---

## 1. Identity & Brand Intent

* **Brand Intent**: Clean, authoritative, crisp Light Mode, high-density, precise, enterprise-grade.
* **Product Tone**: Professional, trustworthy, data-dense without visual chaos, anti-decorative.
* **Core Adjectives**: Functional, Structured, Accessible, Responsive, Performant, Crisp Light Mode.

---

## 2. Core Principles

1. **Light Mode First Mandate**: All interfaces must be designed in high-contrast Light Mode with white surface cards and light slate canvases.
2. **Business-First Hierarchy**: Content and functional tasks take priority over aesthetic embellishments.
3. **Dense-but-Clear**: High information density balanced with consistent spatial rhythm and high contrast ($> 4.5:1$).
4. **Systemic Consistency**: 100% of visual tokens, components, and layout patterns must derive from this contract.
5. **Interactive Figma Canvas Rule**: All generated `board.html` artifacts MUST be infinite interactive Figma canvas boards with native drag-and-drop artboards, mouse wheel / trackpad pinch zoom, dynamic SVG flow connectors, and live in-artboard component interactivity.
6. **Mandatory Design Tokens & System Specs Artboard Rule**: Every `board.html` MUST include a dedicated **Design Tokens & System Specs Artboard** displaying color swatches, typography scale, ergonomic touch targets, and system binding status as proof of design system compliance.

---

## 3. Typography Scale & Hierarchy

* **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
* **Monospace Font Family**: "JetBrains Mono", "Fira Code", SFMono-Regular, Consolas, monospace.
* **Base Size**: `14px` (`1rem` in component root).

---

## 4. Semantic Light Mode Color Tokens

### Surface & Background Tokens (Light Mode)
* `--color-bg-canvas`: `#f8fafc` (Light slate canvas)
* `--color-bg-surface`: `#ffffff` (Pure white container card)
* `--color-bg-subtle`: `#f1f5f9` (Hover background, zebra striping)
* `--color-bg-muted`: `#e2e8f0` (Borders, disabled fill)

### Text & Icon Tokens
* `--color-text-primary`: `#0f172a` (High contrast primary text)
* `--color-text-secondary`: `#475569` (Subtle text, label descriptions)
* `--color-text-tertiary`: `#94a3b8` (Placeholder text, disabled state)

### Brand & Interactive Tokens
* `--color-interactive-primary`: `#2563eb` (Primary brand blue)
* `--color-interactive-hover`: `#1d4ed8` (Primary hover)
* `--color-interactive-active`: `#1e40af` (Primary active press)
* `--color-interactive-subtle`: `#eff6ff` (Selected state tint)

---

## 5. Systemic Figma Canvas Engine Contract (`board.html`)

Every `board.html` generated across all features in `.agents` MUST satisfy the following 5 hard technical rules:

1. **Mouse Wheel / Trackpad Pinch Zoom**: Canvas supports `viewport.addEventListener('wheel')` zooming centered around mouse coordinates.
2. **Drag & Drop Artboards**: Each artboard header acts as a drag handle (`onmousedown="startDragArtboard(event, 'artboard-id')"`) allowing artboards to be freely repositioned anywhere on the 5000x5000 canvas.
3. **Dynamic SVG Connectors**: Flow connector arrows recalculate their SVG Bezier curve anchor coordinates live on any artboard reposition event.
4. **Live In-Artboard Interactivity**: Interactive elements (buttons, filter search inputs, checkboxes, modals) INSIDE artboard screen bodies must respond to direct user click/input events without triggering parent canvas drags (`e.stopPropagation()`).
5. **Mandatory System Specs Artboard**: Must feature a dedicated Artboard detailing active color swatches, typography scale, touch spatial targets, and system binding status.
6. **Edge Case & Special Flow Coverage Mandate**: Canvas boards and screen flows MUST automatically fill 100% of data slots with realistic fixtures and render dedicated state simulation banners covering key edge cases (Network Disconnection Alerts, Liquidation Risk Warnings, KYC Glare Resubmit Errors, Slippage Warnings, Security Alerts).
