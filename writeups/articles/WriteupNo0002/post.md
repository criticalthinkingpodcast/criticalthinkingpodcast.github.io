---
layout: post
title: Challenge One - Strange XSS Writeup
author: Nick Copi
date: 2025-11-24
tags: [challenge, xss, javascript, client-side]
profile_picture: /assets/images/7urb0pfp.png
handle: 7urb0
social_links: [https://x.com/7urb01, https://www.turb0.one/]

description: "A writeup on the first strange XSS challenge in this miniseries."
permalink: /writeups/challenge-one-strange-xss
---

This challenge has two pages, a fairly functionless outer page, and an inner page with a postMessage listener that performs some rich hydration of an object before using it to make a mocked post request to a nonexistent API endpoint with a body derived from the message. There is no origin check on the listener, the page is frameable, and there is not much else going on here, so it is clear that the way to achieving the XSS involves framing the inner.html page from an attacker page and sending it crafted messages.


## Understanding the hydration functionality
The inner.html page has the following custom JavaScript to implement a postMessage event handler.
![inner logic](/image1.png)

The message event is passed to a rehydration function that takes a `from` and `to` value from the message data and uses lodash's get method to get a potentially nested property from the event and assign it as a potentially nested value to the `event.data.base` object with lodash's set method. Notably, this is getting a potentially nested value from the event, not event.data. This oversight allows for very interesting behavior. By reading a property from `event.target`, we can read from the global window object of the inner.html page. This allows us to set a wide variety of values on the `event.data.base` object before it gets passed to JSON.stringify later in the code.


## Achieving XSS
There are two crucial pieces here that allow this strange code to lead to XSS. The first being the ability to copy a property from `window` to a nested value on the `event.data.base` object. The second being the call to JSON.stringify on the hydrated version of `event.data.base`.

Per the MDN docs, we can see that JSON.stringify will conditionally call nested or top level toJSON functions on objects being passed to JSON.stringify, potentially even with a controllable string as the first argument in nested cases.

![mdn docs](/image2.png)

This allows us to craft a payload that copies `event.target.eval` to `event.data.base` as a `somejstoexecute.toJSON` property. This will lead to the creation of an object like the following:

![chal 1 hydrated](/image3.png)


This object when passed to JSON.stringify will have its nested toJSON function called with the property name of the parent object, leading to `eval` being called with `alert(origin)`.

## Full payload
A full payload to accomplish this can be seen [here.](https://www.turb0.one/files/8f07105d-599f-4403-be61-3fb3d5994f41/xsschal1minimal/80dd6676-cdc4-40d9-b037-1226a1703b15-solution.html)

![chal 1 poc](/image4.png)

It abuses the postMessage listener to copy `eval` onto the object being stringified in such a way that it gets called as the toJSON function with an attacker controlled string passed as the first argument, leading to XSS.
