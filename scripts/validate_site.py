#!/usr/bin/env python3
"""Run dependency-free integrity checks for the static website."""

import ast
import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent.parent


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.local_references = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        element_id = attributes.get("id")
        if element_id:
            self.ids.append(element_id)

        if tag == "script" and attributes.get("src"):
            self.local_references.append(attributes["src"])
        elif tag == "link" and attributes.get("rel") == "stylesheet":
            self.local_references.append(attributes.get("href", ""))
        elif tag == "img" and attributes.get("src"):
            self.local_references.append(attributes["src"])


def is_local_reference(value):
    parsed = urlparse(value)
    return value and not parsed.scheme and not value.startswith("#")


def main():
    errors = []
    html_path = ROOT / "index.html"
    parser = SiteParser()

    try:
        parser.feed(html_path.read_text())
    except Exception as error:
        errors.append(f"index.html is not valid HTML: {error}")

    duplicate_ids = [
        element_id
        for element_id, count in Counter(parser.ids).items()
        if count > 1
    ]
    if duplicate_ids:
        errors.append(f"duplicate HTML ids: {', '.join(duplicate_ids)}")

    missing = [
        reference
        for reference in parser.local_references
        if is_local_reference(reference) and not (ROOT / reference).exists()
    ]
    if missing:
        errors.append(f"missing local references: {', '.join(sorted(set(missing)))}")

    try:
        json.loads((ROOT / "data" / "stats.json").read_text())
    except Exception as error:
        errors.append(f"data/stats.json is invalid: {error}")

    for script in sorted((ROOT / "scripts").glob("*.py")):
        try:
            ast.parse(script.read_text())
        except SyntaxError as error:
            errors.append(f"{script.relative_to(ROOT)} has a syntax error: {error}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("OK: HTML, local references, stats JSON, and Python scripts are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
