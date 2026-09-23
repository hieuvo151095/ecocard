#!/usr/bin/env python3
"""Validate presence and validity of rendered HTML design artifacts."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


REQUIRED_HTML_ARTIFACTS = (
    "board.html",
    "prototype.html",
    "components.html",
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate HTML design artifacts.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    artifacts_dir = feature_dir / "artifacts" if (feature_dir / "artifacts").exists() else feature_dir
    errors: list[str] = []

    for name in REQUIRED_HTML_ARTIFACTS:
        filepath = artifacts_dir / name
        if not filepath.exists():
            errors.append(f"Missing required HTML artifact: {name}")
        elif len(filepath.read_text(encoding="utf-8").strip()) < 100:
            errors.append(f"HTML artifact content too brief or placeholder-only: {name}")
        elif name == "board.html":
            board_content = filepath.read_text(encoding="utf-8")
            if "Design Tokens & System Specs" not in board_content and "System Spec" not in board_content:
                errors.append("board.html missing mandatory Design Tokens & System Specs Artboard")

    if errors:
        print("DESIGN ARTIFACTS VALIDATION FAILED")
        for err in errors:
            print(f"- {err}")
        sys.exit(1)

    print("DESIGN ARTIFACTS VALIDATION PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- HTML artifacts present and reviewable")


if __name__ == "__main__":
    main()
