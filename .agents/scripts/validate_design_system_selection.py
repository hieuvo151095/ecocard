#!/usr/bin/env python3
"""Validate that feature has a valid active design system binding (design-context.md)."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from path_utils import resolve_agents_root


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate active design system selection.")
    parser.add_argument("--root", default=".", help="Project root")
    parser.add_argument("--feature", required=True, help="Path to feature directory")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    agents_root = resolve_agents_root(root)
    feature_dir = Path(args.feature).resolve()

    context_file = feature_dir / "design-context.md"
    if not context_file.exists():
        print(f"DESIGN SYSTEM SELECTION FAILED: Missing {context_file}")
        sys.exit(1)

    content = context_file.read_text(encoding="utf-8")
    if "active_design_system" not in content or "Active Design System" not in content:
        print(f"DESIGN SYSTEM SELECTION FAILED: Unbound active design system in {context_file}")
        sys.exit(1)

    print("DESIGN SYSTEM SELECTION PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- Active design system bound successfully")


if __name__ == "__main__":
    main()
