#!/usr/bin/env python3
"""Instance the site's variable woff2 fonts into static TTFs that librsvg (sharp's rasteriser)
can actually use, so the OG cards render in the REAL Source Serif 4 / Spline Sans Mono — not a
generic system serif. Writes the TTFs + a fonts.conf into the cache dir passed as argv[1].
Run indirectly via `pnpm og` (make-og.ts invokes this once, then points FONTCONFIG_FILE at it).
Needs: fonttools + brotli (dev-only; the generated PNGs are committed, so deploy never runs this)."""
import os
import sys
from fontTools import ttLib
from fontTools.varLib.instancer import instantiateVariableFont

cache = os.path.abspath(sys.argv[1])
os.makedirs(os.path.join(cache, "cache"), exist_ok=True)
B = "node_modules/@fontsource-variable/"


def make(src, axes, family, out):
    f = ttLib.TTFont(src)
    instantiateVariableFont(f, axes, inplace=True)
    nm = f["name"]
    # rename the family so each weight/style resolves under its own unambiguous name
    for nid in (1, 16):
        nm.setName(family, nid, 3, 1, 0x409)
    for nid in (2, 17):
        nm.setName("Regular", nid, 3, 1, 0x409)
    nm.setName(family, 4, 3, 1, 0x409)
    nm.setName(family.replace(" ", ""), 6, 3, 1, 0x409)
    f.flavor = None
    f.save(os.path.join(cache, out))


make(B + "source-serif-4/files/source-serif-4-latin-opsz-normal.woff2", {"wght": 600, "opsz": 48}, "OG Serif", "og-serif.ttf")
make(B + "source-serif-4/files/source-serif-4-latin-opsz-italic.woff2", {"wght": 450, "opsz": 22}, "OG Serif Italic", "og-serif-italic.ttf")
make(B + "spline-sans-mono/files/spline-sans-mono-latin-wght-normal.woff2", {"wght": 470}, "OG Mono", "og-mono.ttf")

with open(os.path.join(cache, "fonts.conf"), "w") as fh:
    fh.write(
        '<?xml version="1.0"?>\n'
        '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n'
        "<fontconfig>\n"
        f"  <dir>{cache}</dir>\n"
        '  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>\n'
        f"  <cachedir>{os.path.join(cache, 'cache')}</cachedir>\n"
        "</fontconfig>\n"
    )
print("og fonts ready:", cache)
