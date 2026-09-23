#!/usr/bin/env python3
"""Audit HTML artifacts for token compliance against active DESIGN.md."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


FORBIDDEN_HEX_PATTERN = re.compile(r'color:\s*#(?!2563eb|1d4ed8|1e40af|16a34a|d97706|dc2626|0284c7|0f172a|475569|94a3b8|f8fafc|ffffff|f1f5f9|e2e8f0|ccc|b45309|15803d|b91c1c|0369a1|fbbf24|6ee7b7|fca5a5|93c5fd|334155|cbd5e1|ef4444|10b981|7dd3fc|64748b|38bdf8|f59e0b|475569|15803d|60a5fa|F0B90B|f0b90b|848E9C|848e9c|1E2026|1e2026|383e4a|0ECB81|0ecb81|F6465D|f6465d|32313a|32313A|d0980b|D0980B)[0-9a-fA-F]{3,6}')


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate design token compliance.")
    parser.add_argument("--feature", required=True, help="Feature directory")
    args = parser.parse_args()

    feature_dir = Path(args.feature).resolve()
    artifacts_dir = feature_dir / "artifacts" if (feature_dir / "artifacts").exists() else feature_dir
    violations: list[str] = []

    for html_file in artifacts_dir.glob("*.html"):
        content = html_file.read_text(encoding="utf-8")
        matches = FORBIDDEN_HEX_PATTERN.findall(content)
        if matches:
            violations.append(f"Unapproved hardcoded color hex codes found in {html_file.name}: {set(matches)}")

    if violations:
        print("TOKEN COMPLIANCE FAILED")
        for v in violations:
            print(f"- {v}")
        sys.exit(1)

    print("TOKEN COMPLIANCE PASSED")
    print(f"- Feature: {feature_dir.name}")
    print("- All rendered colors match active design system tokens")


if __name__ == "__main__":
    main()
