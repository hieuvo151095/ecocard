#!/usr/bin/env python3
"""Validate that `/design` has required discovery & readiness inputs."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from path_utils import resolve_agents_root


MANDATORY_BRIEF_FIELDS = (
    "business_goal",
    "primary_user",
    "primary_flow",
    "constraints",
    "approval_criteria",
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate `/design` readiness inputs.")
    parser.add_argument("--root", default=".", help="Project root that contains docs/ and optionally .agents/")
    parser.add_argument("--feature", help="Path to feature workspace containing design-brief.md")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    agents_root = resolve_agents_root(root)
    errors: list[str] = []

    workflow = agents_root / "workflows" / "design.md"
    if not workflow.exists():
        errors.append(f"Missing `/design` workflow: {workflow}")

    if args.feature:
        feature_path = Path(args.feature).resolve()
        brief_path = feature_path / "design-brief.md"
        if not brief_path.exists():
            errors.append(f"Missing required design brief: {brief_path}")
        else:
            content = brief_path.read_text(encoding="utf-8")
            for field in MANDATORY_BRIEF_FIELDS:
                if field not in content:
                    errors.append(f"Missing mandatory field '{field}' in {brief_path}")

    if errors:
        print("DESIGN READINESS FAILED")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    print("DESIGN READINESS PASSED")
    print(f"- Root: {root}")
    print("- Required discovery and readiness inputs are present for `/design`")


if __name__ == "__main__":
    main()
