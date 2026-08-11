---
layout: post
title: From DEF CON Research to Automated Supply Chain Defense, finding npx confusion vulnerabilities  with npxconfuse
author: Muhammad Mukhtar Mahmud
date: 2026-08-11
tags: [ supply chain Security, Security Tooling , RCE , Javascript]
image: /assets/images/cybershaykh.jpg
profile_picture: /assets/images/cybershaykh.jpg
handle: cybershaykh
social_links: [https://x.com/cybershaykh, https://github.com/cybershaykh, https://cybershaykh.github.io]
description: "A primer on the tool npxconfuse used to find unclaimed package names on the npm registry to exploit RCE covering how the npx command behaves and a new method to run unauthorized code that bypasses modern registry security updates. "
permalink: /research/from-defcon-research-to-automated-supply-chain-defense-with-npxconfuse
---

## Executive Summary

Software supply chain security has undergone a rapid evolution over the past five years. From Alex Birsan’s landmark dependency confusion research in 2021 to typosquatting and compromised maintainer accounts, attackers have continuously targeted the trust boundary between package registries and developer tooling.

In May 2026, researchers **Lupin & Holmes** presented a groundbreaking paper at DEF CON 33 titled *"npx Used Confusion and It's Super Effective"*, highlighting a subtle yet devastating vulnerability class inherent to Node.js tool execution: **npx confusion** and **scoped binary name mismatches**.

While Lupin & Holmes established the theoretical framework and identified the systemic resolution flaws in `npx`, defending enterprise environments requires **automation at scale**. To bridge the gap between vulnerability research and proactive defense, I developed [**`npxconfuse`**](https://github.com/cybershaykh/npxconfuse) — an open-source CLI scanner and threat intelligence tool designed to discover unclaimed npm package names across local codebases, GitHub organizations, and public web assets before malicious actors can exploit them.

This article explores the mechanics of npx confusion, breaks down the architecture and novel detection heuristics of `npxconfuse`, details real-world vulnerabilities discovered (including zero-day exposures in major open-source tools like Brave’s MCP server), and outlines a practical methodology for distinguishing real CI/CD execution from automated registry bots.

## 1. Background: The Mechanics of npx Confusion

### 1.1 How `npx` Resolves Executables

Introduced with npm v5.2.0, `npx` is designed to execute Node binaries conveniently without requiring global installation. When a developer or CI pipeline runs `npx <command>`, `npx` follows a deterministic lookup order:

1. **Local Binaries:** Searches `./node_modules/.bin/` relative to the current working directory.  
2. **Environment PATH:** Checks globally installed binaries on the host system.  
3. **npx Cache:** Checks the local `~/.npm/_npx/` cache directory.  
4. **Public Registry Fallback:** If the command is not found locally, `npx` **automatically queries `registry.npmjs.org` for a package matching `<command>`**, downloads it into a temporary directory, and executes its primary binary.

```text
                  ┌─────────────────────────────┐
                  │      npx <command> run      │
                  └──────────────┬──────────────┘
                                 │
                      Is binary in local .bin?
                      ├── YES ──▶ Execute local binary
                      └── NO
                          │
                      Is binary in PATH / Cache?
                      ├── YES ──▶ Execute cached binary
                      └── NO
                          │
                 ┌────────▼──────────────────────────┐
                 │ Query registry.npmjs.org/<command>│
                 └────────┬──────────────────────────┘
                          │
                 Package registered on npm?
                 ├── YES ──▶ Download & Execute
                 └── NO  ──▶ Prompt/Fail (or execute if attacker registers!)
```

### 1.2 The Scoped Binary Mismatch Problem

The most critical variant of this attack stems from a fundamental naming constraint in the npm ecosystem: **scoped package names cannot be used as binary identifiers**.

A scoped package published as `@org-name/my-tool` has a slash (`/`) in its name. However, POSIX and Windows executable names **cannot contain slashes**. Consequently, when an organization defines the `"bin"` field in their `package.json`, they must provide an **unscoped binary name**:

```json
{
  "name": "@mycompany/internal-linter",
  "version": "1.0.0",
  "bin": {
    "mycompany-linter": "dist/cli.js"
  }
}
```

Here lies the architectural mismatch:

- The npm package is registered under the private/protected scope `@mycompany/internal-linter`.  
- The binary name registered in npm's global namespace is `mycompany-linter`.  
- **If `@mycompany` does not separately register the unscoped package `mycompany-linter` on public npm, that package name remains UNCLAIMED (HTTP 404).**

If a developer or CI script invokes `npx mycompany-linter` (or if `npx` falls back due to missing local installation), npm resolves the public, unscoped `mycompany-linter`. An attacker who registers `mycompany-linter` on `npmjs.com` achieves **instant Remote Code Execution (RCE)** on any developer workstation or CI pipeline executing the command.

---

## 2. Building `npxconfuse`: Automating Discovery at Scale

While the theoretical attack model described by Lupin & Holmes is elegant, identifying these vulnerabilities manually across thousands of repositories is intractable. I created **`npxconfuse`** to automate end-to-end vulnerability scanning across enterprise attack surfaces.

### 2.1 Tool Architecture & Pipeline

`npxconfuse` is structured into four distinct modular layers:

```text
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  1. DISCOVERY    │ ──▶ │  2. EXTRACTION   │ ──▶ │  3. ANALYSIS     │
│                  │     │                  │     │                  │
│ • Local FS       │     │ • npx scripts    │     │ • npm registry   │
│ • GitHub API     │     │ • bin fields     │     │ • Severity score │
│ • Web scrape     │     │ • JS imports     │     │ • Owner lookup   │
│ • Direct check   │     │ • dependencies   │     │ • Download stats │
└──────────────────┘     └──────────────────┘     └─────────┬────────┘
                                                            │
                                                            ▼
                                                  ┌──────────────────┐
                                                  │  4. REPORTING    │
                                                  │                  │
                                                  │ • Table / JSON   │
                                                  │ • CSV output     │
                                                  │ • Exit status    │
                                                  └──────────────────┘
```

#### Layer 1: Discovery Engines

- **`scan` (Local Filesystem):** Recursively traverses directories (ignoring `node_modules`, `.git`, `.next`, `dist`), discovering `package.json` manifests and JS bundles (`.js`, `.mjs`, `.cjs`).  
- **`github` (Organization Scanner):** Integrates with the GitHub REST API (supporting public GitHub and GitHub Enterprise) to discover all repositories within an enterprise organization, extracting relevant manifest files directly without requiring full repository clones.  
- **`web` (Web Domain Probe):** Scrapes public web applications to detect exposed `/package.json`, `/package-lock.json`, and client-side JavaScript bundles to extract leaked internal tool references.  
- **`check` (Batch Package Assessor):** Takes raw lists of internal package or binary names and assesses registry claim status.

#### Layer 2: Extraction Layer

Dedicated extractors parse ASTs, regex patterns, and JSON manifests to extract candidate package names:

- **Script Extractor:** Parses `package.json` `"scripts"` for commands containing `npx <name>`, `bunx <name>`, `yarn dlx <name>`, and `pnpm dlx <name>`.  
- **Bin Field Extractor:** Compares scoped package names against their defined `"bin"` keys to identify unscoped binary names.  
- **Dependency Extractor:** Identifies internal/private dependency references (e.g., `file:`, `workspace:`, internal scope mappings) that lack public registry reservations.  
- **Deep JS Bundle Parser:** Parses production JS bundles using regex heuristics to uncover embedded `require()` calls, `import` statements, and bundled `package.json` fragments.

#### Layer 3: Parallel Registry Analyzer

Candidate names are deduplicated and queried concurrently against `https://registry.npmjs.org` with configurable concurrency (defaulting to 20 parallel requests) and configurable HTTP timeouts. The analyzer classifies status as:

- `unclaimed` (HTTP 404)  
- `claimed` (HTTP 200)  
- `private` / `error` (E.g. E403, network errors)

#### Layer 4: Classification & Severity Engine

Findings are categorized into four standardized severity levels:

| Vulnerability Type | Description | Status | Severity |
| :---- | :---- | :---- | :---- |
| **npx Confusion** | `npx <name>` in `package.json` scripts points to an unclaimed public npm package. | `UNCLAIMED` | 🔴 `CRITICAL` |
| **Bin Mismatch** | Scoped package (`@scope/pkg`) exposes an unscoped binary name unclaimed on npm. | `UNCLAIMED` | 🔴 `CRITICAL` |
| **Dependency Confusion** | Internal/private package name is unclaimed on public npm. | `UNCLAIMED` | 🟡 `HIGH` |
| **Name Clash** | Package exists on public npm but is owned by an external third party. | `CLAIMED` | 🟠 `MEDIUM` |

## 3. Real-World Findings & Case Studies

To validate `npxconfuse` in the wild, I conducted security research across prominent open-source projects and major corporate GitHub organizations.

### 3.1 Case Study: Zero-Day RCE in `@brave/brave-search-mcp-server`

During an automated audit of Model Context Protocol (MCP) server implementations, `npxconfuse` flagged a critical **Bin Mismatch** vulnerability in Brave Software’s official repository:

- **Repository:** `github.com/brave/brave-search-mcp-server`  
- **Published Package:** `@brave/brave-search-mcp-server` (v1.2.13)  
- **Vulnerable `package.json`:**

```json
{
  "name": "@brave/brave-search-mcp-server",
  "bin": {
    "brave-search-mcp-server": "dist/index.js"
  }
}
```

#### The Vulnerability

The scoped package `@brave/brave-search-mcp-server` declared `"bin": { "brave-search-mcp-server": "dist/index.js" }`. However, the unscoped package name **`brave-search-mcp-server`** was completely unclaimed on `npmjs.com` (returning `HTTP 404`).

Users configuring Claude Desktop or AI tools following standard MCP instructions frequently execute:

```bash
npx brave-search-mcp-server
```

Because the local environment does not have `@brave/brave-search-mcp-server` pre-installed globally, `npx` falls back to fetching the public package named `brave-search-mcp-server`. An attacker who registered `brave-search-mcp-server` on `npmjs.com` would achieve **immediate RCE on every developer and AI system attempting to start the Brave MCP server**.

#### Responsible Disclosure & PoC Verification

I deployed a harmless proof-of-concept canary package (`brave-search-mcp-server`) with a `postinstall` script sending non-sensitive metadata (hostname, platform, Node version) to a research callback endpoint (`callback-monitor.cyb3rsh4ykh.workers.dev`).

Upon local testing, the callback triggered in under 2 seconds:

```json
{
  "timestamp": "2026-06-03T08:25:13.383Z",
  "pkg": "brave-search-mcp-server",
  "org": "brave",
  "vuln": "bin-mismatch",
  "hostname": "MUHAMMAD",
  "platform": "win32",
  "arch": "x64",
  "node": "v24.12.0",
  "npmEvent": "postinstall"
}
```

**Brave Software was responsibly notified to claim the unscoped namespace but it was closed as informative since it didn't have an impact on brave's own infrastructure. PS: It only affects developers or CI/CD pipelines that pulls the unclaimed package.**

### 3.2 Enterprise Supply Chain Audits: OpenAI, Stripe, Shopify, & Elastic

Large-scale scans using `npxconfuse github <org>` across major technology companies revealed widespread supply chain risk vectors:

1. **OpenAI (`openai/openai-apps-sdk-examples` & `openai-guardrails-js`):**  
   - Discovered dependency confusion risks for localized CSS bundle references (`mapbox-gl.css`, `react-datepicker.css`) declared as direct package names.  
   - Identified binary mismatch collisions for `@openai/guardrails` exposing unscoped binary `guardrails` which was claimed by a third-party developer (`kanyasomchai`).  
2. **Stripe & Shopify:**  
   - Uncovered multiple internal tooling scripts utilizing `npx <custom-tool>` where internal helper scripts relied on unreserved package names.  
3. **Elastic & Replit:**  
   - Uncovered scope-mismatch vulnerabilities in monorepos where sub-packages defined legacy CLI binary aliases that were not registered on npm.

## 4. Verification Methodology: Distinguishing Real Exploitation from Registry Noise

A major challenge in supply chain vulnerability research is **verifying whether an unclaimed package is actively being pulled in real environments**. Simply publishing a package and checking the npm download counter is misleading.

### 4.1 The Registry Noise Problem

The moment a package is published to `npmjs.com`, it is bombarded by automated traffic. Over **95% of initial download activity** consists of background bots rather than authentic targets:

| Source | Category | Behavior & Impact |
| :---- | :---- | :---- |
| **CDN / Mirroring Bots** | jsDelivr, unpkg, npmmirror | Automatically cache every newly published package within seconds. |
| **Security Scanners** | Snyk, Socket.dev, Datadog | Automated analysis sandboxes downloading and analyzing code ASTs. |
| **npm Analytics** | `npmjs.com` download count | Includes all CDN cache misses and bot mirrors. **Never trust raw download metrics.** |

### 4.2 Signal vs. Noise Matrix for Callback Analysis

To confirm authentic execution in developer machines or CI pipelines, research packages must implement **telemetry logging** within `postinstall` hooks or CLI entry points, evaluating incoming callbacks against specific signal criteria:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                         Incoming Callback Event                          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
        Check Environment                        Check Hostname / IP
                 │                                       │
    Contains CI Variables?                    Matches Corporate Range?
    (GITHUB_ACTIONS, CIRCLECI, etc.)          (e.g., github-runner-*)
                 │                                       │
                 ▼                                       ▼
       🟢 AUTHENTIC CI RUNNER                  🟢 AUTHENTIC DEVELOPER
```

#### High-Confidence Signals (Authentic Victim Pull):

- 🟢 **CI Environment Variables & Hostnames:** Callbacks containing `github-runner-*`, `circleci-*`, `jenkins-*`, `gitlab-runner-*`, or `AWS_EXECUTION_ENV`.  
- 🟢 **Corporate Hostnames & Usernames:** System usernames (`whoami`) matching employee naming conventions or corporate workstation domains.  
- 🟢 **Commit-Triggered Alignment:** Callbacks arriving in direct temporal correlation with public Git commits or PR triggers on the target organization's repos.  
- 🟢 **Non-Standard User Agents & Egress IPs:** IP addresses originating from enterprise IP ranges or cloud provider worker instances (AWS EC2, GCP Compute Engine).

#### Low-Confidence Signals (Automated Noise / Ignore):

- 🔴 Hits arriving within **0–5 seconds** of `npm publish` from Fastly, Cloudflare, or AWS IP blocks associated with mirror crawlers.  
- 🔴 User-Agents identifying as `npm/v*`, `node-fetch`, or security scanner user agents.  
- 🔴 Static sandbox hostnames (e.g., `sandbox-eval`, `container-ubuntu-2004`).

## 5. Remediation & Defense Strategies

Securing your organization against npx confusion requires a defense-in-depth approach combining repository hygiene, registry configuration, and CI/CD policy enforcement.

### 5.1 Defense 1: Reserve Unscoped Binary Names

If your organization publishes scoped packages (`@org/pkg`) that expose a binary `foo`, **immediately claim the unscoped package `foo` on public npm**. Publish a placeholder package containing a clear warning:

```json
{
  "name": "foo",
  "version": "1.0.0",
  "description": "Placeholder package reserved to prevent npx confusion attacks. Use @org/pkg instead.",
  "scripts": {
    "preinstall": "node -e \"console.error('ERROR: Use @org/pkg instead of foo'); process.exit(1);\""
  }
}
```

### 5.2 Defense 2: Enforce Explicit Flags in `npx`

Never use naked `npx <command>` in `package.json` scripts or documentation. Instead:

- Explicitly supply the full scoped package name: `npx @org/pkg`  
- Use the `--no` flag to disable automatic public registry fetching if the binary is expected to exist locally:

```bash
npx --no my-internal-tool
```

### 5.3 Defense 3: Configure `.npmrc` Registry Scoping

Ensure all internal scopes are strictly routed to your private artifact registry (e.g., Nexus, Artifactory, AWS CodeArtifact) in your project's `.npmrc`:

```ini
@mycompany:registry=https://private-registry.mycompany.com/npm/
always-auth=true
```

### 5.4 Defense 4: CI/CD Pipeline Scanning with `npxconfuse`

Integrate `npxconfuse` directly into GitHub Actions or GitLab CI pipelines to catch unclaimed names before code reaches production:

```yaml
# .github/workflows/supply-chain-audit.yml
name: Supply Chain Audit
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  npx-confusion-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install npxconfuse
        run: npm install -g npxconfuse
      - name: Scan Repository for Unclaimed Packages
        run: |
          npxconfuse scan . --deep -o json --save findings.json
          # npxconfuse exits with code 2 if CRITICAL or HIGH findings are detected
```

## 6. Future Horizon: The Next Frontiers in Supply Chain Security

Building `npxconfuse` highlighted that executable name resolution confusion is not isolated to `package.json` scripts. My ongoing research roadmap expands this model across adjacent developer ecosystems:

1. **Cross-Ecosystem Command Confusion (npm + PyPI + Cargo + Go):**  
   - Command names declared in PyPI `console_scripts`, Cargo `[[bin]]`, or Go binaries exist in a global developer terminal mental space. If a command is invoked via `npx` on a machine where only the PyPI package is claimed, npm will fetch whatever exists on `npmjs.com`. Multi-registry checks represent the next evolution of `npxconfuse`.  
2. **Devcontainer Feature Poisoning (`.devcontainer/devcontainer.json`):**  
   - VS Code Devcontainers support "Features" referenced by shorthand names. If a repository specifies `"features": { "custom-linter": {} }` and that shorthand npm package is unclaimed, opening the repository in VS Code triggers container builds that pull and execute malicious `postinstall` hooks **with zero user interaction**.  
3. **GitHub Actions Composite Action Dependency Injection:**  
   - Composite actions (`action.yml`) bundling `run: npx <tool>` propagate transitively. A single unclaimed npm package inside a composite action compromises every downstream repository consuming that action across the GitHub Marketplace.

## 7. Conclusion & Resources

The research presented by Lupin & Holmes at DEF CON 33 revealed how subtle resolution defaults in modern developer tooling can transform innocuous scripts into remote code execution vectors. By releasing **`npxconfuse`**, my goal is to equip security teams, developers, and bug bounty researchers with the tooling required to audit and remediate these exposures before adversaries exploit them.

### Try `npxconfuse` Today:

```bash
# Direct execution (no installation required)
npx npxconfuse scan ./my-project --deep

# Scan a GitHub Organization
export GITHUB_TOKEN=ghp_your_token
npxconfuse github your-organization
```

- 📦 **GitHub Repository:** [github.com/cybershaykh/npxconfuse](https://github.com/cybershaykh/npxconfuse)  
- 📄 **DEF CON 33 Paper (Lupin & Holmes):** [npx Used Confusion and It's Super Effective](https://www.landh.tech/blog/20260521-npx-used-confusion-and-its-super-effective/)  
- 🌐 **Author Website:** [cybershaykh.github.io](https://cybershaykh.github.io)

*Feedback, contributions, and security disclosures are welcome via GitHub issues.*  
