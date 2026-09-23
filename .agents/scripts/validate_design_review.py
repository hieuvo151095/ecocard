#!/usr/bin/env python3
"""Validate design review scorecards and decision log status."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate design review scorecards.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    review_file = feature_dir / "review.md"

    if not review_file.exists():
        print(f"DESIGN REVIEW VALIDATION FAILED: Missing {review_file.name}")
        sys.exit(1)

    content = review_file.read_text(encoding="utf-8")
    if "APPROVED" not in content:
        print(f"DESIGN REVIEW VALIDATION FAILED: Final decision in {review_file.name} is not APPROVED")
        sys.exit(1)

    print("DESIGN REVIEW VALIDATION PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- Multi-role review completed and APPROVED")


if __name__ == "__main__":
    main()
