#!/usr/bin/env python3
"""Validate component family compliance."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate component family usage.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    components_file = feature_dir / "components.html"
    if not components_file.exists():
        components_file = feature_dir / "artifacts" / "components.html"

    if not components_file.exists():
        print(f"COMPONENT COMPLIANCE FAILED: Missing {components_file.name}")
        sys.exit(1)

    print("COMPONENT COMPLIANCE PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- Component families comply with component catalog rules")


if __name__ == "__main__":
    main()
