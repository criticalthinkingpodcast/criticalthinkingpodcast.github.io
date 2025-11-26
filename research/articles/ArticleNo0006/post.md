---
layout: post
title: Unicode surrogates conversion to (simplified) replacement characters
author: Krzysztof Balas
date: 2025-11-10
tags: [unicode, utf, normalization]
profile_picture: /assets/images/zerodaykb.jpg
handle: zerodaykb
social_links: [https://x.com/zerodaykb, https://zerodaykb.pl]
description: "A case for question-mark smuggle: using Unicode surrogates to bypass input validation with replacement character fallback."
permalink: /research/unicode-surrogates-to-replacement-characters
---

Hello hackers. 👋

**TLDR**

I was able to bypass strong validation with unicode surrogates that some parsers treat as simple question mark - ?.

You can use probably any of low or high surrogates. I used: `\udc2a`.

---
**Background**


There are some databases where using wildcard characters can pose security risks. There was an endpoint where I could get users data if I knew their: birthday, last name and zip code. For some reason it was unauthenticated functionality.

The body looked like this:

```
{
  "birthdate": "2000-01-01",
  "lastname": "Doe",
  "zipcode": "1011A"
}
```

Response:

```
{
    "email": "john@doe.com",
    "accountNumber": "123456",
    "something": "more"
}
```


After finding first bug in this endpoint they fixed allowed characters and the fix was pretty good:
- no special characters allowed
- no URL encoding allowed
- no unicode versions of special characters allowed

Only some unicodes were allowed.

-------
**The bug**

2 months passed by after the fix...

I was riding my bike on my indoor bike trainer and watching some talk regarding unicode normalization bugs and I had this enlightenment moment - unicode truncation!

I jumped off my bike and played with the endpoint to cause error:

```
{
  "birthdate": "2000-01-01",
  "lastname": "\uffff",
  "zipcode": "a"
}
```
Response:

```
{
    "errors": [{
        "message": "Received 503 status code [...] 
        GET http://internal.api/customers?zipcode=a&birthdate=2000-01-01&lastname=%EF%BF%BF"
    }]
}
```

Interesting. In this error you can see that unicode got translated into UTF-8. What if I could smuggle anything to hit the internal API with %3f character? Is there something like that even possible?

I opened shazzer [website](https://shazzer.co.uk/unicode-table?fromTo=0x2a&highlightsFromTo=) and started testing endpoint manually.
When I reached unicode surrogates I finally bypassed it:

```
{
  "birthdate": "2000-01-01",
  "lastname": "D\udc2a\udc2a",
  "zipCode": "1\udc2a\udc2a\udc2a\udc2a"
}
```
-------------
Explanation:

It's not unicode truncation but something different. UTF-8 parsers can't properly display unicode surrogates ([https://jrgraphix.net/r/Unicode/DC00-DFFF](https://jrgraphix.net/r/Unicode/DC00-DFFF)) which are often used in emojis with low and high surrogate pair.

All you get when you try to display them is unicode replacement character: [https://www.compart.com/en/unicode/U+FFFD](https://www.compart.com/en/unicode/U+FFFD).

Some parsers apparently go one step further and simplify replacement character to a question mark (?) and that's why the vulnerability was caused.

From what I know I would name 2 databases where "?" can be used as a wildcard:
- solr
- elasticsearch 

----
Takeaways:

- test for wildcards - there are plenty of them in various DBs
- if question mark is blocked and you need it in your chain - try unicode surrogates

Although the bug was related to database systems I believe this trick can be useful in more places.

Good luck! Happy hacking.