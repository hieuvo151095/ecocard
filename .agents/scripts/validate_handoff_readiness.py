#!/usr/bin/env python3
"""Validate handoff package readiness for developer / UAT transition."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate handoff package readiness.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    handoff_file = feature_dir / "handoff.md"
    review_file = feature_dir / "review.md"

    if not handoff_file.exists():
        print(f"HANDOFF READINESS FAILED: Missing {handoff_file.name}")
        sys.exit(1)

    if not review_file.exists() or "APPROVED" not in review_file.read_text(encoding="utf-8"):
        print("HANDOFF READINESS FAILED: Design review must be APPROVED before handoff")
        sys.exit(1)

    print("HANDOFF READINESS PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- Handoff package ready; unlocks /develop workflow")


if __name__ == "__main__":
    main()
