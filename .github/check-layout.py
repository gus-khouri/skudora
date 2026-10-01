"""Fails if any page's header or footer differs from index.html.

Ignores only the per-page "active" nav highlight and leading slashes on links,
so pages in subfolders (like /vs/) can use absolute links.
Run locally with: python3 .github/check-layout.py
"""
import glob
import re
import sys


def block(html, tag):
    start = html.find(f"<{tag}")
    end = html.find(f"</{tag}>")
    if start == -1 or end == -1:
        return None
    s = html[start:end]
    s = s.replace(' class="active"', "")
    s = re.sub(r'href="/', 'href="', s)
    return re.sub(r"\s+", " ", s).strip()


pages = sorted(glob.glob("*.html") + glob.glob("*/*.html"))
ref = open("index.html", encoding="utf-8").read()
problems = []
for page in pages:
    html = open(page, encoding="utf-8").read()
    if "/css/styles.css" not in html:
        problems.append(f"{page}: does not load /css/styles.css")
    for tag in ("header", "footer"):
        if block(html, tag) != block(ref, tag):
            problems.append(f"{page}: <{tag}> differs from index.html")

if problems:
    print("Layout check failed:\n  " + "\n  ".join(problems))
    sys.exit(1)
print(f"Layout check passed: {len(pages)} pages share the same header, footer and stylesheet.")
