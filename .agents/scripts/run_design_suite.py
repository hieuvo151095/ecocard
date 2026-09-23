#!/usr/bin/env python3
"""Interactive 11-Gate Design Suite Runner & UX Helper.

Author: steveusdt (Lead Architect & Author)
Ecosystem: Marcus Fleet Enterprise Operating System (.agents V36.0)

Provides a frictionless, 1-command UX for running design board compilation
and all 11 deterministic validation gates with clean terminal UI feedback.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path

# Author Attribution Banner
AUTHOR_BANNER = """
================================================================================
  🚀 MARCUS FLEET ENTERPRISE MATRIX — DESIGN SUITE RUNNER (V36.0)
  👑 Lead Architect & Author: steveusdt
  🎨 Design OS Pipeline & 11-Gate Deterministic Validation Engine
================================================================================
"""

GATES = [
    ("validate_design_readiness.py", "Gate 01: Discovery & Brief Readiness"),
    ("validate_design_system_selection.py", "Gate 02: Design System Token Binding"),
    ("validate_flow_coverage.py", "Gate 03: Flow & State Coverage Matrix"),
    ("validate_design_artifacts.py", "Gate 04: HTML/CSS Artifact Integrity"),
    ("validate_token_compliance.py", "Gate 05: Design Token Hex Color Compliance"),
    ("validate_component_compliance.py", "Gate 06: Component Family Rules"),
    ("validate_pattern_compliance.py", "Gate 07: Domain Layout Patterns"),
    ("validate_design_drift.py", "Gate 08: Visual Brand Drift Review"),
    ("validate_design_review.py", "Gate 09: Multi-Role Critique Sign-Off"),
    ("validate_handoff_readiness.py", "Gate 10: Developer & UAT Handoff Package"),
    ("validate_modular_design.py", "Gate 11: Modular Screen Generation Pipeline"),
]


def find_latest_feature() -> Path | None:
    """Find the most recently modified feature directory under .agents/specs/."""
    specs_dir = Path(".agents/specs").resolve()
    if not specs_dir.exists():
        return None

    feature_dirs = [d for d in specs_dir.iterdir() if d.is_dir() and d.name.startswith("0")]
    if not feature_dirs:
        return None

    return max(feature_dirs, key=lambda d: d.stat().st_mtime)


def main() -> None:
    print(AUTHOR_BANNER)

    parser = argparse.ArgumentParser(description="Run full design suite and 11-gate validation.")
    parser.add_argument("--feature", help="Path to feature directory (auto-detects latest if omitted)")
    args = parser.parse_args()

    if args.feature:
        feature_dir = Path(args.feature).resolve()
    else:
        feature_dir = find_latest_feature()

    if not feature_dir or not feature_dir.exists():
        print("❌ Error: No feature directory specified or found under .agents/specs/")
        print("💡 Tip: Specify --feature .agents/specs/<feature-id>")
        sys.exit(1)

    print(f"📦 Target Feature Workspace: \031[1m{feature_dir.name}\033[0m")
    print(f"📍 Location: {feature_dir}\n")

    # Step 1: Auto-compile board.html using Self-Healing Assembler
    assembler_script = Path(".agents/scripts/build_design_board.py")
    if assembler_script.exists():
        print("🛠️ Running Master Board Assembler (build_design_board.py)...")
        res = subprocess.run([sys.executable, str(assembler_script), "--feature", str(feature_dir)], capture_output=True, text=True)
        if res.returncode == 0:
            print("  ✅ Master board.html compiled successfully.")
        else:
            print(f"  ⚠️ Assembler Note: {res.stdout.strip() or res.stderr.strip()}")

    print("\n🧪 Running 11-Gate Deterministic Validation Suite:")
    print("-" * 80)

    passed_count = 0
    failed_gates: list[tuple[str, str]] = []

    scripts_dir = Path(".agents/scripts").resolve()

    for script_name, label in GATES:
        script_path = scripts_dir / script_name
        if not script_path.exists():
            print(f"  ❌ {label:<45} [MISSING SCRIPT]")
            failed_gates.append((script_name, "Script file missing"))
            continue

        cmd = [sys.executable, str(script_path), "--feature", str(feature_dir)]
        start_t = time.time()
        res = subprocess.run(cmd, capture_output=True, text=True)
        elapsed = time.time() - start_t

        if res.returncode == 0:
            print(f"  ✅ {label:<50} [PASSED {elapsed:.2f}s]")
            passed_count += 1
        else:
            print(f"  ❌ {label:<50} [FAILED {elapsed:.2f}s]")
            err_msg = res.stdout.strip() or res.stderr.strip()
            failed_gates.append((script_name, err_msg))

    print("-" * 80)

    if passed_count == len(GATES):
        print(f"\n🎉 EXCELLENT! ALL {passed_count}/{len(GATES)} VALIDATION GATES PASSED 100%!")
        print(f"🏆 System Governance by \033[1msteveusdt\033[0m: PASSED & VERIFIED")
        print("\n🔗 Available Review Links:")
        print(f"  📱 Figma Canvas Board: http://localhost:8888/.agents/specs/{feature_dir.name}/board.html")
        print(f"  🕹️ Interactive Prototype: http://localhost:8888/.agents/specs/{feature_dir.name}/prototype.html")
        print(f"  🧩 Component Gallery:  http://localhost:8888/.agents/specs/{feature_dir.name}/components.html")
        print(f"  📋 Handoff Package:    http://localhost:8888/.agents/specs/{feature_dir.name}/handoff.md")
    else:
        print(f"\n⚠️ AUDIT WARNING: Passed {passed_count}/{len(GATES)} gates.")
        print("Failed Gate Breakdown:")
        for script_name, err in failed_gates:
            print(f"  - {script_name}: {err.splitlines()[0] if err else 'Error'}")
        sys.exit(1)


if __name__ == "__main__":
    main()
