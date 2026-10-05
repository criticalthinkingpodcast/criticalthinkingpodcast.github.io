---
layout: post
title: Challenge - Not just another XSS (lab)
author: Macabely
date: 2026-10-04
tags: [challenge, csp, xss, client-side]
profile_picture: /assets/images/macabely.jpg
handle: macabely
social_links: [https://x.com/Macabely97021]
description: "Get XSS working on Chrome in this challenge. Writeup follows."
permalink: /research/challenge-not-just-another-xss
---

```
Content-Security-Policy: script-src 'none'
```

**URL**: [https://not-just-another-xss.chall.lab.ctbb.show/](https://not-just-another-xss.chall.lab.ctbb.show/)

Get Cross-Site Scripting (XSS) to pop an `alert(origin)` on this page, working on Chrome. That's it, good luck.  
Oh, and before you go spin up your recon pipeline, please don't because fuzzing is **not** needed.

Try not to share solutions too publicly. A writeup follows this post soon.
