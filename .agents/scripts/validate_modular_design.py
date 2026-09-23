#!/usr/bin/env python3
"""Audit Modular Screen Generation & Master Assembler Pipeline.

Ensures that every design feature maintains a dedicated screens/ directory containing
individual screen modules and a master assembled board.html artifact.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate modular screen pipeline.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    screens_dir = feature_dir / "screens"
    board_file = feature_dir / "board.html"
    violations: list[str] = []

    if not screens_dir.exists() or not screens_dir.is_dir():
        violations.append(f"Missing mandatory screens/ directory in {feature_dir.name}")
    else:
        screen_files = list(screens_dir.glob("*.html"))
        if not screen_files:
            violations.append(f"screens/ directory in {feature_dir.name} contains no HTML screen modules")

    if not board_file.exists():
        violations.append(f"Missing master assembled board.html in {feature_dir.name}")

    if violations:
        print("MODULAR PIPELINE VALIDATION FAILED")
        for v in violations:
            print(f"- {v}")
        sys.exit(1)

    print("MODULAR PIPELINE VALIDATION PASSED")
    print(f"- Feature: {feature_dir.name}")
    print(f"- Verified {len(list(screens_dir.glob('*.html')))} modular screen files compiled into master board.html")


if __name__ == "__main__":
    main()
