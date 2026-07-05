---
layout: post
title: postMessage targetOrigin bypass via IP normalization
author: ­Mathias Karlsson
date: 2026-07-06
tags: [postmessage, url-parsing, origin-bypass]
profile_picture: /assets/images/avlidienbrunn.jpg
handle: avlidienbrunn
social_links: [https://x.com/avlidienbrunn]
description: "How an integer IP host slips past a subdomain regex and redirects postMessage data to an attacker-controlled origin."
permalink: /research/postmessage-targetorigin-bypass-via-ip-normalization
---

The second argument to `postMessage` controls which origin is allowed to receive the data, the browser runs that value through its URL parser before comparing anything and the parser rewrites some hosts. A host that's a plain number gets read as an IPv4 address and written back in dotted form, so `2130706433` becomes `127.0.0.1`. Hex, octal, and short forms like `127.1` behave the same.

Common origin restrictions can be hacked with this, a page might take a user-controlled origin, check it with a regex like `https?://[^.]+[.]target[.]com` to allow only subdomains of `target.com` then hand it to `postMessage`. The regex runs on the raw string, so `http://2130706433/.target.com` gets through. The `[^.]+` was supposed to match one subdomain label, but a slash isn't a dot, so it eats `2130706433/` and lets `.target.com` cover the rest.

That hands `postMessage` the call:

```js
window.postMessage('message_here', 'http://2130706433/.target.com')
```

That input isn't a subdomain of anything, though. Once parsed, the host is `2130706433`, which normalizes to `127.0.0.1`, and `/.target.com` is just a path that origin checks ignore. The data goes to `http://127.0.0.1`, which the attacker controls.

[@siunam](https://x.com/siunam321) checked the spec and it's all "intended behaviour". 
`postMessage` sends `targetOrigin` through the URL parser, host parsing converts the number to a 32-bit integer, and the serializer prints it back in dotted form.

- [https://url.spec.whatwg.org/#concept-ipv4-parser](https://url.spec.whatwg.org/#concept-ipv4-parser)
- [https://url.spec.whatwg.org/#concept-ipv4-serializer](https://url.spec.whatwg.org/#concept-ipv4-serializer)

> Mathias brought this up in the [#researchers exclusive chat](https://lab.ctbb.show/submit/) and we decided that this is a cool find to post! =)
>
>    *- CTBB*