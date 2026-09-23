#!/usr/bin/env python3
"""Validate the Marcus Fleet v34 Superpowers discipline contract."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from path_utils import resolve_agents_root


WORKFLOW_MARKERS: dict[str, tuple[str, ...]] = {
    "workflows/init_brain.md": ("Superpowers V34 Discipline", "clarification"),
    "workflows/bootstrap.md": ("Superpowers V34 Discipline", "baseline"),
    "workflows/update_brain.md": ("Superpowers V34 Discipline", "re-run `/init_brain`"),
    "workflows/planning.md": ("Superpowers V34 Discipline", "clarification-first"),
    "workflows/marcus_specify.md": ("Superpowers V34 Discipline", "Clarification Ledger"),
    "workflows/marcus_clarify.md": ("Superpowers V34 Discipline", "blocking ambiguity"),
    "workflows/marcus_plan.md": ("Superpowers V34 Discipline", "No placeholders"),
    "workflows/marcus_tasks.md": ("Superpowers V34 Discipline", "bite-sized"),
    "workflows/marcus_review.md": ("Superpowers V34 Discipline", "spec compliance", "code quality"),
    "workflows/marcus_rehearse.md": ("Superpowers V34 Discipline", "replayable evidence"),
    "workflows/develop.md": ("Superpowers V34 Discipline", "RED-GREEN-REFACTOR", "root cause"),
    "workflows/quick_fix.md": ("Superpowers V34 Discipline", "root cause", "fresh verification"),
    "workflows/marcus_verify.md": ("Superpowers V34 Discipline", "NO COMPLETION CLAIMS"),
    "workflows/marcus_routecheck.md": ("Superpowers V34 Discipline", "validate_superpowers_discipline.py"),
    "workflows/doc_reconcile.md": ("Superpowers V34 Discipline", "question code reality"),
    "workflows/refactor-planning.md": ("Superpowers V34 Discipline", "systematic debugging"),
    "workflows/design.md": ("Superpowers V34 Discipline", "clarify visual intent"),
    "workflows/mobile_init.md": ("Superpowers V34 Discipline", "clarify platform constraints"),
    "workflows/marcus_init.md": ("Superpowers V34 Discipline", "clarify bootstrap intent"),
}

TEMPLATE_MARKERS: dict[str, tuple[str, ...]] = {
    "templates/spec-template.md": ("## 6. Clarifications", "Clarification Ledger", "Question Back Protocol"),
    "templates/plan-template.md": ("Superpowers V34 Discipline Gates", "No placeholders", "root cause"),
    "templates/tasks-template.md": ("Superpowers V34 Task Discipline", "RED-GREEN-REFACTOR", "spec compliance"),
    "templates/verification-template.md": ("Evidence-before-claim", "NO COMPLETION CLAIMS", "fresh verification"),
    "templates/execution-brief-template.md": ("Superpowers Discipline Snapshot", "clarification", "TDD"),
}

FEATURE_MARKERS: dict[str, tuple[str, ...]] = {
    "spec.md": ("Clarification Ledger", "Question Back Protocol"),
    "plan.md": ("Superpowers V34 Discipline Gates", "No placeholders"),
    "tasks.md": ("Superpowers V34 Task Discipline", "RED-GREEN-REFACTOR", "spec compliance"),
    "verification.md": ("Evidence-before-claim", "NO COMPLETION CLAIMS"),
    "execution-brief.md": ("Superpowers Discipline Snapshot",),
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def check_markers(base: Path, marker_map: dict[str, tuple[str, ...]]) -> list[str]:
    errors: list[str] = []
    for relpath, markers in marker_map.items():
        path = base / relpath
        if not path.exists():
            errors.append(f"Missing file: {relpath}")
            continue
        text = read(path)
        for marker in markers:
            if marker not in text:
                errors.append(f"{relpath}: missing `{marker}`")
    return errors


def check_feature(feature_dir: Path) -> list[str]:
    errors: list[str] = []
    if not feature_dir.exists():
        return [f"Feature workspace not found: {feature_dir}"]
    if not feature_dir.is_dir():
        return [f"Feature workspace is not a directory: {feature_dir}"]
    for filename, markers in FEATURE_MARKERS.items():
        path = feature_dir / filename
        if not path.exists():
            errors.append(f"{feature_dir.name}/{filename}: missing file")
            continue
        text = read(path)
        for marker in markers:
            if marker not in text:
                errors.append(f"{feature_dir.name}/{filename}: missing `{marker}`")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Marcus Fleet v34 Superpowers discipline.")
    parser.add_argument("--root", default=".", help="Project root containing .agents/")
    parser.add_argument("--feature", default="", help="Optional feature workspace to validate.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    agents_root = resolve_agents_root(root)

    errors: list[str] = []
    errors.extend(check_markers(agents_root, WORKFLOW_MARKERS))
    errors.extend(check_markers(agents_root, TEMPLATE_MARKERS))

    if args.feature:
        feature = Path(args.feature)
        if not feature.is_absolute():
            feature = (root / feature).resolve()
        errors.extend(check_feature(feature))

    if errors:
        print("SUPERPOWERS DISCIPLINE VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    print("SUPERPOWERS DISCIPLINE VALIDATION PASSED")
    print("- workflow markers: present")
    print("- template markers: present")
    if args.feature:
        print(f"- feature markers: present in {Path(args.feature)}")


if __name__ == "__main__":
    main()
