---
layout: post
title: Abusing libmagic﹕ Inconsistencies That Lead to Type Confusion
author: Hamid Sj
date: 2025-10-06
tags: [cspt, xss, file-upload, chain, confusion]
image: /research/articles/ArticleNo4/thumbnail.png
profile_picture: /assets/images/hamidsj.jpg
handle: hamidsj
social_links: [https://linktr.ee/hamedsj5]

description: "Exploring libmagic’s inconsistencies in JSON detection and type confusion. A research note on file uploads, misclassification, and security risks."
permalink: /research/libmagic-inconsistencies-that-lead-to-type-confusion
---

I was re-checking Doyensec’s CSPT → file-upload writeup and noticed their example payloads weren’t behaving the same for me: uploads that used to slip through now got stopped. That made me dig into how `file`/libmagic actually decides a file is JSON. Turns out `file` only looks at the start of a file and has a hard stop for JSON nesting. In `src/is_json.c` there’s this check:

```c
/* Avoid recursion */
if (lvl > 500) {
    DPRINTF("Too many levels", uc, *ucp);
    return 0;
}
```

So if a JSON is nested past ~500 levels, libmagic gives up calling it JSON and treats it like plain text. I wrote a tiny generator to test this — a 10-level JSON shows up as `JSON data`, a 501-level file shows up as `ASCII text`. If I then put valid PDF bytes (`%PDF-1.x ... %%EOF`) near the front of that deep JSON, `file` starts calling it a **PDF**. That’s the trick: make the detector think it’s a PDF so the upload follows PDF-processing codepaths (renderers, converters, indexers) that might expose XSS or other sinks.

Generator I used (save as `nested-json.py`):

```python
#!/usr/bin/env python3
import json, argparse

def generate_nested_json(depth, width=1):
    if depth <= 0:
        return "terminal_value"
    result = {}
    for i in range(width):
        key = f"level{depth}" if width == 1 else f"level{depth}_{i}"
        result[key] = generate_nested_json(depth - 1, width)
    return result

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("depth", type=int)
    p.add_argument("-w","--width", type=int, default=1)
    p.add_argument("-o","--output")
    args = p.parse_args()
    out = args.output or f"nested_{args.depth}.json"
    with open(out,"w") as f:
        json.dump(generate_nested_json(args.depth, args.width), f, indent=2)
    print("wrote", out)
```

Example head of the file I tested (501-level JSON with a PDF header embedded):

```json
{
  "_pdf_content": "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n...%%EOF",
  "level501": {
    "level500": {
      "level499": {
        ...
```

A quick cheat-sheet of common stacks and their usual nesting limits:

| Language  |                           Common library |
| --------- | ---------------------------------------: |
| C / C++   | libmagic / `file` — detector guard ≈ 500 |
| Java      |      Jackson — ~1000 (version-dependent) |
| .NET / C# |      System.Text.Json / Newtonsoft — ~64 |
| Python    |         built-in `json` — low by default |
| Go        |     `encoding/json` — very large (stack) |
| Rust      |      `serde_json` — ~128 practical limit |
| Node.js   |   `JSON.parse` (V8) — thousands (engine) |

Different ecosystems rely on different file-type checkers — some are just wrappers around `libmagic` and inherit its quirks, while others use their own standalone implementations with separate limits:

**Libmagic wrappers (inherit `file` behavior):**

* C / C++ (native)
* Perl
* Ruby
* PHP (`finfo`)
* Python (`python-magic`)
* Go (`magicmime`)

**Non-Libmagic wrappers (standalone implementations):**

* JavaScript (Node.js)
* Java (Apache Tika)
* .NET / C#
* Rust


One more practical note: `file` also gets shaky on very large files — in my tests files > ~10 MB were unreliable. Since many uploads have size limits, making giant files isn’t always possible. That’s why the deep-nesting trick is useful: it’s small-ish in bytes but large in structure, so it often bypasses type-sniffers without hitting size limits.

Note on versions and limits —
The recursion guard (lvl > 500) shown above is part of the upstream file/libmagic source (src/is_json.c). The current upstream release is libmagic 5.46, which includes the behavior and fixes discussed here.

Most language bindings and wrappers (like python-magic, PHP’s finfo, or Go’s magicmime) are built directly on top of libmagic and typically track the latest upstream version, so they inherit these changes automatically once updated.

However, the standalone file command bundled with operating systems often lags behind. For example, Ubuntu and macOS still ship file 5.41 in their default installations, where the JSON detector stops at around 10 nesting levels instead of ~500. In other words, the trick behaves differently depending on whether you’re testing against the system file binary or a newer libmagic build.

In short: wrappers tend to stay current with upstream (5.46+), while OS-level file tools may still reflect older limits from 5.41.

Links:

* Doyensec writeup: [https://blog.doyensec.com/2025/01/09/cspt-file-upload.html](https://blog.doyensec.com/2025/01/09/cspt-file-upload.html)
* `file` repo: [https://github.com/file/file](https://github.com/file/file)
* `file` magic DB: [https://github.com/file/file/tree/master/magic/Magdir](https://github.com/file/file/tree/master/magic/Magdir)
* `is_json.c`: [https://github.com/file/file/blob/master/src/is_json.c](https://github.com/file/file/blob/master/src/is_json.c)

