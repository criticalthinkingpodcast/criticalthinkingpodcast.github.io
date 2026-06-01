---
layout: post
title: WAF Bypasses via h2 framing
author: Diyan Apostolov
date: 2026-06-01
tags: [Proxies, WAFBypasses]
profile_picture: /assets/images/fsi.jpg
handle: fsi
social_links: [https://x.com/thefosi]
description: "How HTTP/2’s multi-frame architecture allows attackers to bypass WAFs by exploiting timing delays, protocol translation flaws, and incomplete body inspection across various reverse proxies"
permalink: /research/h2-WAF-Bypasses
---

# HTTP/2 WAF Bypass: A Black-Box Methodology

## Introduction

Modern web infrastructure relies heavily on reverse proxies and Web Application Firewalls (WAFs) to protect backend services. These components sit at the edge of the network, terminating client connections and inspecting traffic before it reaches the application. They enforce security policies: blocking malicious request bodies, restricting HTTP methods, filtering dangerous URL patterns, and more.

But there is a fundamental assumption baked into most of these architectures: the request arrives as a complete, atomic unit. Headers come first, then the body, and the WAF sees both before making a decision. This assumption holds true for HTTP/1.1, where the entire request flows through a single TCP stream in a predictable order.

HTTP/2 breaks this assumption.

In HTTP/2, a request is split across multiple binary frames. The HEADERS frame carries the method, path, and headers. The DATA frame carries the body. These frames can arrive at different times, on different streams, with arbitrary delays between them. When a reverse proxy receives an H2 request and needs to make a security decision, it faces a choice: wait for the entire request to arrive, or make a decision based on what it has right now.

Some proxies choose to act immediately. And that is where the bypass lives.

This article documents a black-box methodology for identifying and exploiting HTTP/2 WAF bypasses across six popular reverse proxies. Rather than starting from the configuration files, we approach each target the way an external attacker would: fingerprint the proxy, identify the WAF architecture, and then select the appropriate attack technique.

The results vary significantly across proxies. Five of the six have at least one exploitable bypass - Nginx with libmodsecurity3 is the only exception. The differences come down to architectural decisions: how the proxy translates between H2 and H1, when it triggers WAF inspection, and whether the WAF runs in-process or out-of-process.

### The H2-to-H1 Translation Problem

Most backend applications and many WAF engines speak HTTP/1.1 internally. When a reverse proxy accepts an HTTP/2 connection from a client, it typically needs to translate the request into HTTP/1.1 before forwarding it to the backend. This translation is where things get interesting.

In HTTP/2, the familiar concepts of HTTP/1.1 are represented differently. There is no request line like `GET /path HTTP/1.1`. Instead, the method, path, scheme, and authority are carried as **pseudo-headers** - special headers prefixed with a colon:

```
:method     = GET
:path       = /index.html
:scheme     = https
:authority  = example.com
```

The proxy must reconstruct an HTTP/1.1 request line from these pseudo-headers. It must decide which pseudo-header becomes the `Host` header, which one forms the path in the request line, and how to handle pseudo-headers that don't have a direct HTTP/1.1 equivalent (like `:scheme` and `:protocol`).

Different proxies make different choices in this translation, and those choices create bypass opportunities.

### WAF Architecture: In-Process vs. Out-of-Process

How the WAF is integrated with the proxy matters enormously for HTTP/2 security.

**In-process WAFs** (like Apache + mod_security, or Caddy + Coraza) run as modules inside the proxy itself. They see the request at the same time the proxy does. When the proxy has the complete request, the WAF has the complete request. There is no timing gap.

**Out-of-process WAFs** (like HAProxy + Coraza via SPOE, or Envoy + ext_authz) run as separate services. The proxy sends request data to the WAF over an internal protocol, waits for a verdict, and then decides whether to forward or block. This architecture introduces a critical question: *at what point does the proxy send the request data to the WAF?*

If the proxy sends the data when headers arrive - before the body is available - the WAF makes its decision based on incomplete information. If the body arrives later and contains malicious content, the WAF has already said "allow." The proxy has committed to forwarding the request, and the malicious body sails through uninspected.

**ForwardAuth** (like Traefik + ForwardAuth, or Caddy + forward_auth) is designed for **authentication**, not WAF functionality. The proxy sends a sub-request to an auth service containing only the request headers - because that is where authentication data lives (Authorization headers, cookies, session tokens). The body is not forwarded because ForwardAuth was never designed to inspect it. This is correct behavior for authentication. The problem arises when organizations deploy ForwardAuth as their *only* security middleware and expect it to also act as a WAF. Any body-based security rule added to the auth service is blind - not because of a bug, but because the architecture was never intended for body inspection.

### ALPN and Protocol Negotiation

Application-Layer Protocol Negotiation (ALPN) is a TLS extension that allows the client and server to agree on which application protocol to use during the TLS handshake. A server that wants to accept only HTTP/1.1 can advertise `http/1.1` in its ALPN list and omit `h2`.

In theory, this should prevent HTTP/2 connections. In practice, some proxies will accept HTTP/2 regardless of what they advertised in ALPN. The proxy's internal multiplexer detects the HTTP/2 connection preface (the magic string `PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`) at the byte level and activates the HTTP/2 handler, ignoring the ALPN agreement entirely.

This matters because administrators who believe they have disabled HTTP/2 may be unknowingly exposing their infrastructure to all of the H2-specific attacks described below.

### Extended CONNECT and RFC 8441

RFC 8441 defines the Extended CONNECT method for HTTP/2. It was designed to enable WebSocket connections over H2 streams by adding a `:protocol` pseudo-header to the CONNECT method. When a proxy sees an Extended CONNECT, it is supposed to treat it as an upgrade request - similar to how HTTP/1.1 handles `Connection: upgrade`.

The interesting part is what happens during H2-to-H1 translation. Some proxies convert an Extended CONNECT into a regular GET with an `Upgrade` header. This means that a method ACL that blocks CONNECT will never see it - the method has already been converted to GET before the ACL is evaluated.

### SecRule REQUEST_BODY and the JSON Content-Type Gap

ModSecurity and Coraza (its Go-based successor) use the `REQUEST_BODY` variable to inspect request bodies. But there is a critical difference between engine versions:

- **mod_security2** (Apache): `REQUEST_BODY` is only populated when the request body is parsed as `application/x-www-form-urlencoded`. If the body arrives with `Content-Type: application/json`, the `REQUEST_BODY` variable is empty.
- **libmodsecurity3** (Nginx): `REQUEST_BODY` is populated for **all** content types. The same `SecRule REQUEST_BODY` rule inspects JSON, XML, and any other body regardless of Content-Type.
- **Coraza** (Caddy, HAProxy SPOA): Same behavior as mod_security2 - `REQUEST_BODY` only parses form-urlencoded.

This means that a rule like:

```
SecRule REQUEST_BODY "@contains jsonrpc" "id:2001,phase:2,deny,status:403"
```

Will block `jsonrpc` in a form-urlencoded POST on all engines. But when the Content-Type is changed to `application/json`, the behavior diverges: **mod_security2 and Coraza silently pass the payload** (the variable is empty), while **libmodsecurity3 still blocks it**. This is why Nginx + libmodsecurity3 is immune to the JSON body gap that affects Apache and Caddy.

---

## Step 1: Black-Box Proxy Fingerprinting

Before attacking, we need to know what we are attacking. Each reverse proxy leaks identifying information through response headers, error pages, TLS behavior, and protocol handling. Here is how to identify each one from the outside.

### Check 1: Response Headers on Successful Requests

Send a simple GET request and examine the response headers. Several proxies add distinctive headers:

```bash
curl -sk -D- https://target:443/ -o /dev/null
```

| Header | Value | Identifies |
|--------|-------|------------|
| `server` | `envoy` | **Envoy** |
| `via` | `1.0 Caddy` | **Caddy** |
| `alt-svc` | `h3=":443"; ma=2592000` | **Caddy** (H3 advertisement) |
| `x-envoy-upstream-service-time` | `<ms>` | **Envoy** |
| `server` | `Apache` | **Apache** (on error pages) |
| `server` | `nginx` | **Nginx** (on all responses) |

Envoy is the easiest to identify - it always adds `server: envoy` and `x-envoy-upstream-service-time` to responses. Caddy adds `via: 1.0 Caddy` and advertises HTTP/3 via `alt-svc`. Nginx and Apache reveal themselves through the `server` header - Nginx on all responses, Apache primarily on error pages (404, 403).

HAProxy and Traefik are harder - they don't add distinctive proxy headers to successful responses. The backend's `server` header passes through unchanged.

### Check 2: Error Page Signatures

Trigger a 404 or 403 and examine the response body. Each proxy (or its WAF) generates error pages with distinctive formatting:

```bash
curl -sk https://target:443/nonexistent-path-xyz
```

| Error Page Content | Identifies |
|--------------------|------------|
| `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">` | **Apache** classic error format |
| `<center><h1>403 Forbidden</h1></center>` with `server: nginx` | **Nginx** error format |
| `Request forbidden by administrative rules` | **HAProxy** built-in 403 |
| `server: Caddy` on 403 + empty body | **Caddy** + Coraza WAF block |
| JSON `{"error": "blocked by ext_authz: ..."}` | **Envoy** + ext_authz |
| JSON `{"error": "blocked: ..."}` with `server: BaseHTTP` | **Traefik** + ForwardAuth |

The error page is particularly useful for identifying HAProxy - its built-in 403 page contains the text "Request forbidden by administrative rules" which is unique to HAProxy.

### Check 3: TLS Certificate Subject

During the TLS handshake, inspect the server certificate:

```bash
curl -skv https://target:443/ 2>&1 | grep "subject:"
```

Traefik with default configuration uses an auto-generated certificate with `CN=TRAEFIK DEFAULT CERT`. This is a dead giveaway in development/staging environments, though production deployments will have custom certificates.

### Check 4: ALPN Protocol Negotiation

Check which protocols the server advertises and accepts:

```bash
curl -skv --http2 https://target:443/ 2>&1 | grep "ALPN"
```

| ALPN Behavior | Interpretation |
|---------------|----------------|
| Server accepts `h2` | Standard H2 support |
| Server accepts only `http/1.1` but H2 preface works | **HAProxy** - ALPN bypass |
| Server accepts only `http/1.1` and rejects H2 preface | Proper ALPN enforcement |

This is the most distinctive signal for HAProxy: it advertises only `http/1.1` in ALPN but accepts HTTP/2 anyway when the client sends the H2 connection preface. No other tested proxy exhibits this behavior.

### Check 5: Process of Elimination

If checks 1–4 don't produce a definitive match, use elimination:

- **Not Envoy**: no `server: envoy`, no `x-envoy-*` headers
- **Not Caddy**: no `via: Caddy`, no `alt-svc: h3=`
- **Not Nginx**: no `server: nginx` on responses
- **Not Apache**: no `server: Apache` on error pages, no classic Apache HTML format
- **Not HAProxy**: ALPN accepts `h2` (no forced H2 behavior)
- **Remaining**: likely **Traefik** - an H2-capable proxy with no distinctive response headers

This elimination approach is how the PoC identifies Traefik when it uses a custom certificate instead of the default.

## Step 2: WAF Fingerprinting

Once we know the proxy, we need to understand what WAF is in front and how it inspects requests. This determines which attacks to try.

### Check 1: Path-Based WAF Detection

Send a request to a known-sensitive path and check if it's blocked:

```bash
curl -sk -o /dev/null -w "%{http_code}" https://target:443/.env
```

If the response is 403, the WAF has path-based rules. If 200, the WAF either doesn't check paths or has no path rules configured.

**Finding**: Envoy's ext_authz returned 200 for `/.env` - zero path inspection. The ext_authz service only inspects body content for blocked patterns but has no path-matching logic. This means sensitive files on the backend are directly accessible regardless of the WAF. Note that this does not even require HTTP/2 - it works over plain HTTP/1.1. No protocol tricks needed, just a direct request to the sensitive path.

### Check 2: Body-Based WAF Detection

Send a POST with a known-blocked pattern in two different content types:

```bash
# Form-urlencoded (WAF should block)
curl -sk -o /dev/null -w "%{http_code}" -X POST \
  -d '{"jsonrpc":"2.0"}' \
  -H "Content-Type: application/x-www-form-urlencoded" \
  https://target:443/

# JSON (WAF may not inspect)
curl -sk -o /dev/null -w "%{http_code}" -X POST \
  -d '{"jsonrpc":"2.0"}' \
  -H "Content-Type: application/json" \
  https://target:443/
```

Comparing the two responses reveals the JSON body content-type gap:

| Proxy | form-urlencoded | application/json | Gap? |
|-------|:-:|:-:|:-:|
| HAProxy + Coraza SPOA | 403 | 403 | No |
| Envoy + ext_authz | 403 | 403 | No |
| Traefik + ForwardAuth | 403 | 403 | No |
| Apache + mod_security2 | 403 | **200** | **Yes** |
| Nginx + libmodsecurity3 | 403 | 403 | No |
| Caddy + Coraza | 403 | **200** | **Yes** |

Apache and Caddy use mod_security2/Coraza's `SecRule REQUEST_BODY` which only parses form-urlencoded content - the same malicious string in a JSON body is invisible. Nginx uses libmodsecurity3 which populates `REQUEST_BODY` for all content types, so the same rule catches JSON payloads. Envoy and HAProxy use custom WAF services that do raw string matching regardless of content type.

### Check 3: WAF Block Response Analysis

The 403 response body reveals the WAF engine:

```bash
curl -sk -X POST -d 'cmd=exec' \
  -H "Content-Type: application/x-www-form-urlencoded" \
  https://target:443/
```

| Response Body Pattern | WAF Engine |
|-----------------------|------------|
| `<h1>403 Forbidden</h1>\nRequest forbidden by administrative rules.` | **HAProxy** built-in (Coraza SPOA behind) |
| `{"error": "blocked by ext_authz: ..."}` | **Envoy** ext_authz |
| `{"error": "blocked: ..."}` with `server: BaseHTTP` | **Traefik** ForwardAuth |
| `<h1>Forbidden</h1>` with `server: Apache` | **Apache** mod_security |
| Empty body (content-length: 0) with `server: Caddy` | **Caddy** Coraza |

Each WAF engine has a distinctive block response. Notably, when Caddy's in-process Coraza blocks a request, the response comes from Caddy itself (not the backend), so the `server` header switches from the backend's value to `Caddy`.

### WAF Architecture Summary

| Proxy | WAF Engine | Architecture | Path WAF | Body WAF |
|-------|-----------|:------------:|:--------:|:--------:|
| HAProxy | Coraza SPOA | Out-of-process | Yes | Yes |
| Envoy | ext_authz | Out-of-process | **No** | Yes |
| Traefik | ForwardAuth | ForwardAuth | Yes | **No** (body not forwarded) |
| Apache | mod_security2 | In-process | Yes | Yes |
| Nginx | libmodsecurity3 | In-process | Yes | Yes |
| Caddy | Coraza | In-process | Yes | Yes |

---

## Step 3: Exploitation

With the proxy and WAF identified, we select the appropriate attack technique. Each proxy has a different vulnerability profile.

---

### HAProxy 2.9 + Coraza SPOA - 3 Bypasses

HAProxy is the most vulnerable proxy tested. Three distinct bypass techniques succeed.

#### H2 Accepted Despite ALPN Restriction

The HAProxy configuration explicitly restricts ALPN to HTTP/1.1:

```
bind *:443 ssl crt /path/to/cert.pem alpn http/1.1
```

An administrator reading this configuration would reasonably believe that only HTTP/1.1 connections are accepted. However, HAProxy accepts the HTTP/2 connection anyway.

This happens because HAProxy's H2 multiplexer operates at a layer below ALPN. When the first bytes after the TLS handshake match the HTTP/2 connection preface (`PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`), the H2 mux activates regardless of what was negotiated during TLS. The ALPN setting controls what the server *advertises* to the client, but it does not enforce what the server *accepts*.

```
  ALPN negotiated:   None
  H2 SETTINGS rcvd:  True
  H2 GET /           -> 200

  [VULNERABLE] H2 active despite ALPN=None
```

This finding alone is not directly exploitable. But it is the prerequisite for every subsequent H2-based attack. If HAProxy rejected H2 when ALPN didn't include `h2`, the body timing and Extended CONNECT attacks would not be possible.

**No other tested proxy exhibits this behavior.** Envoy, Traefik, Apache, and Caddy all properly enforce ALPN - when configured for H1 only, they reject the H2 connection preface.

#### Bypass 1: WAF Body Blind Spot (SPOE Timing Gap)

This is the most critical finding. It completely neutralizes the WAF for HTTP/2 request bodies.

HAProxy's SPOE fires the WAF check on `on-frontend-http-request` - the moment headers arrive. For HTTP/1.1, the body is available at this point because headers and body flow through the same TCP stream. For HTTP/2, the HEADERS and DATA frames are separate. The SPOE fires when HEADERS arrives, and `body=req.body` is empty because DATA hasn't arrived yet:

```
Time    HAProxy                         SPOE/Coraza
-----   -----                           -----
T+0ms   Receives HEADERS frame
T+1ms   Fires on-frontend-http-request  ->  body is EMPTY -> ALLOW
T+3ms   Commits to forwarding request
T+500ms Receives DATA frame
T+501ms Forwards body to backend        ->  Coraza sees body -> DENY (TOO LATE)
```

The PoC sends HEADERS, waits 500ms, then sends DATA:

```
  H1 POST body="jsonrpc" (form-urlencoded)   -> 403  (blocked)
  H2 POST body="jsonrpc" (split 500ms)       -> 200  (bypassed)
  H2 POST body="cmd=exec" (split 500ms)      -> 200  (bypassed)
  H2 POST body="169.254"  (split 500ms)      -> 200  (bypassed)
```

What makes this finding deceptive is that **Coraza logs show the detection**. The WAF detected the malicious pattern and flagged it as disruptive. But the verdict arrived after HAProxy committed to forwarding. Security teams monitoring WAF logs see "blocked" while the client received 200 OK.

#### Bypass 2: Body Size Limit Bypass

Even without the timing gap, the SPOE has a body size limit. The `max_request_bytes` configuration (or the equivalent SPOE buffer size) controls how much body data is forwarded to the WAF. Payload placed beyond this boundary is invisible:

```
  Small body (jsonrpc, <64KB)                -> 403  (blocked)
  Large body (jsonrpc past 64KB boundary)    -> 200  (bypassed)
```

The attacker pads the body with 64KB of harmless data, then appends the malicious payload. The WAF only sees the padding.

#### Bypass 3: Extended CONNECT Method Conversion

HAProxy converts Extended CONNECT (RFC 8441) to GET during H2-to-H1 translation:

```
What the attacker sends (H2):        What the backend receives (H1):
  :method    = CONNECT                 Method:  GET
  :protocol  = websocket               Headers: Upgrade: websocket
  :path      = /                       Path:    /
```

Method ACLs that block CONNECT never see it - by the time the ACL evaluates, the method is already GET.

```
  Regular CONNECT (no :protocol)             -> 403  (blocked)
  Extended CONNECT (:protocol=websocket)     -> 200  (bypassed)
```

#### Combined Chain

All three bypasses can be chained into a single request: force H2 despite ALPN, use Extended CONNECT to bypass method ACLs, and delay the DATA frame to bypass body inspection. The request passes through every defense layer and reaches the backend with a malicious body that no security control has inspected.

---

### Envoy 1.32 + ext_authz - 2 Bypasses

Envoy handles the H2 body timing problem correctly - `with_request_body` buffers the body before calling ext_authz. But two other bypasses exist.

#### Bypass 1: No Path Inspection

The ext_authz service receives headers and body content but operates on string matching against the body only. It has zero path-based rules. Every sensitive path on the backend is directly accessible:

```
  /.env                    (environment variables)  -> 200
  /.config/secrets.json    (application secrets)    -> 200
```

This does not require HTTP/2 at all - a plain `curl -sk https://target/.env` over HTTP/1.1 returns the file contents. The attacker does not need to upgrade the protocol or craft any special frames. From a black-box perspective, this is the lowest-hanging fruit: a WAF is present and actively blocking body payloads, but any path on the backend is directly accessible.

#### Bypass 2: Body Size Limit Bypass

The ext_authz configuration specifies:

```yaml
with_request_body:
  max_request_bytes: 65536
  allow_partial_message: true
```

The `allow_partial_message: true` setting means Envoy sends only the first 64KB of the body to ext_authz but forwards the **complete** body to the backend. Payload placed after the 64KB boundary is invisible to the WAF:

```
  Small body (jsonrpc, <64KB)                -> 403  (blocked)
  Large body (jsonrpc past 64KB boundary)    -> 200  (bypassed)
```

This is not a misconfiguration - the Envoy documentation examples use `allow_partial_message: true`, and most production deployments set it this way to avoid breaking large file uploads. The alternative (`allow_partial_message: false`) returns a 413 error for any request body exceeding 64KB, which is too restrictive for most applications.

The fix would require the ext_authz service to reject requests when it receives a partial body, but the ext_authz protocol does not provide a clear signal indicating that the body was truncated.

---

### Traefik v3 + ForwardAuth - 2 Bypasses

Traefik uses ForwardAuth middleware for request validation. ForwardAuth is an authentication mechanism - it sends a sub-request containing the request headers (Authorization, Cookie, etc.) to an auth service for validation. This is by design: ForwardAuth validates *who you are*, not *what you send*.

The security gap appears when ForwardAuth is the **only** middleware protecting the backend. If the auth service also tries to enforce body-based WAF rules, those rules are blind because the body was never meant to be forwarded.

#### Finding 1: ForwardAuth Does Not Inspect Bodies (By Design)

ForwardAuth forwards headers to the auth service. The body is not included - this is expected behavior for an authentication middleware, not a bug:

```
  POST body="jsonrpc" (JSON content-type)    -> 200  (bypassed)
  POST body="cmd=exec" (JSON content-type)   -> 200  (bypassed)
  POST body="169.254"  (JSON content-type)   -> 200  (bypassed)
```

All three malicious body payloads pass through. The ForwardAuth service never sees them because Traefik never sends them. This is not a timing issue or a protocol exploit - it is inherent to the ForwardAuth architecture.

Traefik v3 introduced a `forwardBody` option that optionally forwards the body, but it is not enabled by default and most deployments do not use it.

#### Bypass 2: Path Normalization

Traefik's ForwardAuth checks the `X-Forwarded-Uri` header for path-based rules. The ForwardAuth service receives the raw URL as sent by the client. If the client URL-encodes characters, the ForwardAuth service sees the encoded form while Traefik decodes the path before forwarding to the backend:

```
  /.env                    (direct)              -> 403  (blocked)
  /%2eenv                  (dot encoded)         -> 200  (bypassed)
  /.%65nv                  (e encoded)           -> 200  (bypassed)
  /.e%6ev                  (n encoded)           -> 200  (bypassed)
  /%2e%65%6e%76            (fully encoded)       -> 200  (bypassed)
  /static/..%2f.env        (traversal + encoded) -> 200  (bypassed)
```

The WAF rule matches the literal string `/.env`. The encoded variants `/%2eenv`, `/.%65nv` etc. don't match. But the proxy decodes the URL before forwarding to the backend, so the backend receives `/.env` regardless of how it was encoded by the client.

---

### Apache httpd + mod_security - 1 Bypass

Apache with in-process mod_security2 handles most attack classes well. It correctly handles H2 body timing (in-process buffering), properly normalizes URLs before rule evaluation (all encoded path variants are blocked), and rejects Extended CONNECT. Only one bypass was found - but it is the JSON body gap that Nginx's libmodsecurity3 does not have.

#### Bypass 1: JSON Body Content-Type Gap

mod_security's `SecRule REQUEST_BODY` only parses form-urlencoded bodies. The same payload with `Content-Type: application/json` bypasses body rules:

```
  jsonrpc     form=403  json=200    -> BYPASS
  cmd=exec    form=403  json=400    -> BYPASS
  169.254     form=403  json=403    -> blocked (caught by CRS)
```

Two of three payloads bypass body inspection by changing the Content-Type. The third is caught by a CRS rule that operates independently of content type (the OWASP CRS has IP-address detection rules that work across content types).

This is a well-known limitation of ModSecurity's `REQUEST_BODY` variable, but it remains exploitable in practice because many custom rules use `REQUEST_BODY` for body inspection without understanding that it is content-type dependent.

---

### Caddy + Coraza WAF - 2 Bypasses

Caddy with in-process Coraza correctly handles H2 body timing (the in-process architecture eliminates the timing gap) and rejects Extended CONNECT. But the Coraza WAF engine has the same limitations as when deployed elsewhere.

#### Bypass 1: Path Normalization

Like Traefik, Caddy's Coraza WAF does not normalize URL-encoded paths before rule evaluation. The `SecRule REQUEST_URI "@contains /.env"` rule matches the literal string, but encoded variants pass through:

```
  /.env                    (direct)              -> 403  (blocked)
  /%2eenv                  (dot encoded)         -> 200  (bypassed)
  /.%65nv                  (e encoded)           -> 200  (bypassed)
  /.e%6ev                  (n encoded)           -> 200  (bypassed)
  /%2e%65%6e%76            (fully encoded)       -> 200  (bypassed)
  /static/..%2f.env        (traversal + encoded) -> 200  (bypassed)
```

This is the same Coraza engine used in Traefik's WASM plugin - the URL normalization behavior is a property of the engine, not the proxy.

Contrast with Apache: mod_security decodes URLs before rule evaluation, so all encoded variants are caught. This is a meaningful difference between the two ModSecurity-compatible engines.

#### Bypass 2: JSON Body Content-Type Gap

Same as Apache - `SecRule REQUEST_BODY` only inspects form-urlencoded content:

```
  jsonrpc     form=403  json=200    -> BYPASS
  cmd=exec    form=403  json=200    -> BYPASS
  169.254     form=403  json=200    -> BYPASS
```

All three payloads bypass when sent as JSON. Unlike Apache (where CRS caught the third payload), Caddy's Coraza instance uses custom rules only - the CRS IP-detection rule is not present, so all three pass through.

---

## Summary

### Bypass Matrix

| Proxy | WAF | Body Timing | Body Size | Ext CONNECT | Path Norm | JSON Gap | ForwardAuth | No Path WAF |
|-------|-----|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **HAProxy** | Coraza SPOA | **VULN** | **VULN** | **VULN** | - | - | - | - |
| **Envoy** | ext_authz | - | **VULN** | - | - | - | - | **VULN** |
| **Traefik** | ForwardAuth | - | - | - | **VULN** | - | **VULN** | - |
| **Apache** | mod_security2 | - | - | - | - | **VULN** | - | - |
| **Nginx** | libmodsecurity3 | - | - | - | - | - | - | - |
| **Caddy** | Coraza | - | - | - | **VULN** | **VULN** | - | - |

Nginx is the only proxy with zero bypasses. Every other proxy has at least one.

### Bypass Classes by Architecture

**Out-of-process WAFs** (HAProxy SPOE, Envoy ext_authz) are vulnerable to:
- Body timing attacks (HAProxy only - Envoy buffers correctly)
- Body size limit bypasses (both - the WAF only sees the first N bytes)
- Missing path inspection (Envoy only - ext_authz doesn't check URLs)

**ForwardAuth as WAF** (Traefik) - when used as the only security layer:
- Body is never forwarded (by design - ForwardAuth is for authentication, not body inspection)
- Path normalization gap (auth service sees encoded URL, backend sees decoded)

**In-process WAFs** (Apache mod_security2, Nginx libmodsecurity3, Caddy Coraza):
- JSON content-type gap (`REQUEST_BODY` only parses form-urlencoded) - affects Apache mod_security2 and Caddy Coraza, but **not** Nginx libmodsecurity3 which populates `REQUEST_BODY` for all content types
- Path normalization (Caddy/Coraza only - Apache and Nginx normalize URLs before rule evaluation)
- **Nginx + libmodsecurity3 is the safest configuration tested** - zero bypasses. The in-process architecture eliminates timing gaps, libmodsecurity3 inspects bodies regardless of content type (closing the JSON gap that affects mod_security2), and Nginx normalizes URLs before rule evaluation

### The HAProxy ALPN

The HAProxy ALPN bypass deserves special attention. HAProxy accepts HTTP/2 connections despite advertising only `http/1.1` in ALPN. This is not documented, not configurable, and not expected behavior. Administrators who configure `alpn http/1.1` believe they have disabled HTTP/2. They have not.

This is a finding because:
1. It contradicts HAProxy's documented behavior
2. It cannot be mitigated through configuration
3. It enables every subsequent H2-based attack (body timing, Extended CONNECT)
4. No other tested proxy exhibits this behavior

The ALPN bypass is the enabler. Without it, an attacker cannot reach HAProxy's H2 multiplexer, and the body timing and Extended CONNECT attacks are impossible. With it, HAProxy becomes the most vulnerable proxy in the test - three distinct bypasses, including a complete WAF body neutralization.

# PoC

I have tried to combine it all into a single [PoC](https://gist.github.com/apostolovd/42a91d54ee27c50b46b15166d610b19a) which can be used for further development targeting specific proxy/waf.