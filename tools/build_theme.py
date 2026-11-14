#!/usr/bin/env python3
"""Build the single Blogger theme.xml from ordered XML source fragments.

Usage:
  python tools/build_theme.py
  python tools/build_theme.py --check
"""
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parents[1]
PARTS = [
    ROOT / "src/parts/00-document-start.xml",
    ROOT / "src/parts/10-head.xml",
    ROOT / "src/parts/20-body.xml",
    ROOT / "src/parts/21-header-navigation.xml",
    ROOT / "src/parts/22-homepage-signature.xml",
    ROOT / "src/parts/23-content-layout.xml",
    ROOT / "src/parts/24-sidebar-layout.xml",
    ROOT / "src/parts/24-footer-and-close.xml",
]
OUTPUT = ROOT / "theme.xml"


def assemble() -> str:
    missing = [str(path.relative_to(ROOT)) for path in PARTS if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing source fragment(s): " + ", ".join(missing))
    # No separators are inserted: fragment concatenation preserves original bytes.
    return "".join(path.read_text(encoding="utf-8") for path in PARTS)


def main() -> int:
    parser = argparse.ArgumentParser(description="Assemble modular Blogger XML.")
    parser.add_argument("--check", action="store_true",
                        help="verify theme.xml matches the assembled source without writing")
    args = parser.parse_args()
    generated = assemble()
    if args.check:
        if not OUTPUT.is_file():
            print("FAIL: theme.xml does not exist; run the build first.", file=sys.stderr)
            return 1
        current = OUTPUT.read_text(encoding="utf-8")
        if current != generated:
            print("FAIL: theme.xml is out of date. Run: python tools/build_theme.py",
                  file=sys.stderr)
            return 1
        print("OK: theme.xml matches all source fragments.")
        return 0
    OUTPUT.write_text(generated, encoding="utf-8", newline="")
    print(f"Built {OUTPUT.relative_to(ROOT)} ({len(generated):,} characters).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
