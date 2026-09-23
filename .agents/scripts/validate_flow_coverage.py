#!/usr/bin/env python3
"""Validate flow, screen, and state coverage artifacts for a feature workspace."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


REQUIRED_COVERAGE_FILES = (
    "flow-inventory.md",
    "screen-catalog.md",
    "state-coverage.md",
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate flow & state coverage.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    errors: list[str] = []

    for name in REQUIRED_COVERAGE_FILES:
        filepath = feature_dir / name
        if not filepath.exists():
            errors.append(f"Missing required coverage artifact: {filepath.name}")
        elif not filepath.read_text(encoding="utf-8").strip():
            errors.append(f"Empty coverage artifact: {filepath.name}")

    state_file = feature_dir / "state-coverage.md"
    if state_file.exists():
        content = state_file.read_text(encoding="utf-8")
        mandatory_states = ("initial", "loading", "empty", "populated", "validation-error", "system-error", "success")
        for st in mandatory_states:
            if st not in content:
                errors.append(f"Missing mandatory state state-coverage.md: '{st}'")

    if errors:
        print("FLOW COVERAGE VALIDATION FAILED")
        for err in errors:
            print(f"- {err}")
        sys.exit(1)

    print("FLOW COVERAGE VALIDATION PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- Full flow, screen, and state coverage verified")


if __name__ == "__main__":
    main()
