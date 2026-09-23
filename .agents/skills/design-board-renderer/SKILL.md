---
name: design-board-renderer
description: Render interactive Figma Canvas design boards (board.html) with Drag & Drop artboards, Mouse Wheel Zooming, dynamic SVG connectors, live component interactivity, and mandatory Design Tokens & System Specs artboard.
---

# Design Board Renderer Skill (`design-board-renderer`)

Use this skill when executing `/design.board` or generating visual design boards.

## Core Rules & Requirements

1. **Light Mode First Mandate**: Render clean, crisp Light Mode surfaces (`#f8fafc` canvas, `#ffffff` cards).
2. **Interactive Figma Canvas Architecture**:
   - Render multiple screen artboards on a dotted grid canvas (`5000px x 5000px`).
   - Include drag handle on every artboard header (`onmousedown="startDragArtboard(...)"`).
   - Add mouse wheel / trackpad pinch zoom listener on canvas viewport.
   - Include SVG flow connector arrows connecting 100% of artboard nodes in sequence that dynamically recalculate Bezier curves when artboards are dragged.
   - Ensure components INSIDE artboards (buttons, search inputs, checkboxes) remain 100% clickable and interactive (`e.stopPropagation()`).
3. **Mandatory Design Tokens & System Specs Artboard**:
   - Every `board.html` MUST include a dedicated **Design Tokens & System Specs Artboard** displaying color swatches, typography rules, touch target guidelines, and active design system binding.
4. **Edge Case & Special Flow Data Mandate**:
   - Render 100% filled realistic data fixtures across all screens (no placeholders or empty slots).
   - Embed dedicated edge-case flow banners (Network Disconnect Retry, Liquidation Risk, KYC Glare Error, Slippage Warning, Security Verification).
5. **Modular Sequential Subagents & Inheritance Architecture (`screens/` + `build_design_board.py`)**:
   - Never force all 20+ detailed screens into a single giant single-pass output prompt (which causes context limit truncations and poor UI rendering).
   - Instead, split generation into dedicated, sequential modular screen files under `.agents/specs/<feature-id>/screens/screen_01.html`, `screen_02.html`, ..., `screen_N.html`. Each module inherits global design tokens while getting 100% token budget for maximum component detail.
   - Run `python3 .agents/scripts/build_design_board.py --feature <feature-path>` to compile all modular screen files into the master `board.html`.
6. **Artifact Output**: Final compiled output must be saved to `.agents/specs/<feature-id>/board.html`.
