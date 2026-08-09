---
layout: default
title: Submit Research - Critical Thinking Bug Bounty Podcast
permalink: /submit/
---
<style>
    .submit-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        text-align: left;
        animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .submit-header {
        text-align: center;
        margin-bottom: 50px;
    }

    .skip-link {
        display: inline-block;
        color: var(--blue);
        font-size: 0.95em;
        margin-bottom: 10px;
        text-decoration: none;
        animation: skipBlink 1.6s ease-in-out infinite;
    }

    .skip-link:hover {
        color: var(--text);
        animation: none;
        text-decoration: underline;
    }

    @keyframes skipBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
    }

    .submit-header h1 {
        font-size: 2.4em;
        margin: 0 0 15px 0;
        color: var(--text);
    }

    .submit-header .tagline {
        color: var(--subtext0);
        font-size: 1.05em;
        line-height: 1.6;
        max-width: 640px;
        margin: 0 auto;
    }

    .section-title {
        font-size: 1.3em;
        color: var(--blue);
        margin: 0 0 20px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-default);
    }

    .section-title::before {
        content: "// ";
        color: var(--overlay0);
    }

    .perks-list {
        list-style: none;
        padding: 0;
        margin: 0 0 50px 0;
    }

    .perks-list li {
        position: relative;
        padding: 8px 0 8px 28px;
        color: var(--subtext1);
        font-size: 1em;
        line-height: 1.6;
    }

    .perks-list li::before {
        content: "›";
        position: absolute;
        left: 4px;
        top: 8px;
        color: var(--blue);
        font-weight: 600;
    }

    .perks-list li strong {
        color: var(--blue);
    }

    .perks-list li .note {
        display: block;
        color: var(--overlay2);
        font-size: 0.9em;
        margin-top: 4px;
    }

    .info-block {
        background-color: var(--mantle);
        padding: 25px 30px;
        border-radius: 6px;
        margin-bottom: 50px;
        line-height: 1.7;
        border: 1px solid var(--border-subtle);
    }

    .info-block p {
        margin: 0 0 12px 0;
        color: var(--subtext1);
    }

    .info-block p:last-child {
        margin-bottom: 0;
    }

    .info-block strong {
        color: var(--blue);
    }

    .payouts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 30px;
    }

    .payout {
        background-color: var(--mantle);
        padding: 20px;
        border-radius: 6px;
        border: 1px solid var(--border-subtle);
        position: relative;
        transition: all 0.25s ease;
        display: flex;
        flex-direction: column;
    }

    .payout:hover {
        border-color: var(--blue);
        transform: translateY(-2px);
        box-shadow: 0 0 20px var(--blue-tint);
    }

    .payout-tag {
        font-size: 0.75em;
        color: var(--overlay2);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
    }

    .payout-label {
        font-size: 1em;
        color: var(--subtext1);
        margin-bottom: 12px;
    }

    .payout-sub {
        color: var(--overlay1);
        font-size: 0.85em;
    }

    .payout-amount {
        font-size: 1.4em;
        color: var(--blue);
        font-weight: 600;
        margin-top: auto;
    }

    .budget-note {
        background-color: var(--crust);
        border-left: 3px solid var(--red);
        padding: 15px 20px;
        border-radius: 4px;
        color: var(--subtext0);
        font-size: 0.95em;
        margin-bottom: 50px;
    }

    .format-block {
        background-color: var(--mantle);
        padding: 25px 30px;
        border-radius: 6px;
        margin-bottom: 50px;
        line-height: 1.7;
        border: 1px solid var(--border-subtle);
    }

    .format-block > p {
        margin: 0 0 12px 0;
        color: var(--subtext1);
    }

    .format-block strong {
        color: var(--blue);
    }

    .fm-code {
        position: relative;
        margin: 20px 0;
    }

    .format-block pre {
        margin: 0;
        font-size: 0.9em;
        line-height: 1.6;
        white-space: pre;
        padding-right: 90px;
    }

    /* Code blocks are always dark on this site, in every theme —
       so this button styles off the code tokens, not the surfaces. */
    .fm-copy {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: var(--code-border);
        color: var(--code-text);
        border: 1px solid var(--code-border);
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.75em;
        padding: 4px 10px;
        cursor: pointer;
        opacity: 0.85;
        transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }

    .fm-copy:hover,
    .fm-copy:focus-visible {
        opacity: 1;
        border-color: var(--blue);
    }

    .fm-copy.copied {
        background-color: var(--blue);
        border-color: var(--blue);
        color: var(--on-accent);
        opacity: 1;
    }

    .format-block pre .fm-c {
        color: var(--overlay1);
    }

    .format-block pre .fm-k {
        color: var(--blue);
    }

    .exclusivity-callout {
        position: relative;
        background-color: color-mix(in srgb, var(--red) var(--alpha-callout), var(--mantle));
        border: 1px solid var(--red);
        border-radius: 6px;
        padding: 25px 30px;
        margin-bottom: 30px;
        box-shadow: 0 0 20px var(--red-tint);
    }

    .exclusivity-badge-wrap {
        text-align: center;
        margin-bottom: 20px;
    }

    .exclusivity-badge {
        display: inline-block;
        background-color: var(--chip-red-bg);
        color: var(--chip-fg);
        font-size: 1.1em;
        font-weight: 700;
        padding: 8px 18px;
        border-radius: 4px;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .exclusivity-callout p.lead {
        font-size: 1.15em;
        color: var(--text);
        line-height: 1.5;
    }

    .exclusivity-callout p.lead strong.t-red {
        color: var(--red);
    }

    .exclusivity-headline {
        font-size: 1.25em;
        color: var(--text);
        margin: 0 0 12px 0;
        line-height: 1.4;
    }

    .exclusivity-headline .highlight {
        color: var(--red);
    }

    .exclusivity-callout p {
        color: var(--subtext0);
        line-height: 1.6;
        margin: 0 0 10px 0;
        font-size: 0.95em;
    }

    .exclusivity-callout p:last-child {
        margin-bottom: 0;
    }

    .exclusivity-callout .examples {
        color: var(--overlay1);
        font-size: 0.85em;
        margin-top: 12px;
        font-style: italic;
    }

    .cta-section {
        text-align: center;
        padding: 40px 20px;
        background-color: var(--mantle);
        border-radius: 8px;
        margin-bottom: 30px;
        border: 1px solid var(--border-subtle);
    }

    .cta-section p {
        color: var(--subtext1);
        margin: 0 0 25px 0;
        line-height: 1.6;
    }

    .cta-button {
        display: inline-block;
        padding: 14px 36px;
        background-color: var(--blue);
        color: var(--on-accent);
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 1.05em;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        border: 1px solid var(--blue);
    }

    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px var(--blue-glow);
    }

    .cta-arrow {
        display: inline-block;
        margin-left: 8px;
        transition: transform 0.25s ease;
    }

    .cta-button:hover .cta-arrow {
        transform: translateX(4px);
    }

    @media (max-width: 600px) {
        .submit-header h1 {
            font-size: 1.8em;
        }
        .info-block {
            padding: 20px;
        }
        .cta-section {
            padding: 30px 15px;
        }
    }
</style>

<div class="submit-container">

    <div class="submit-header">
        <a class="skip-link" href="https://forms.gle/Rjm2Qn8aFn4fSxHp8" target="_blank" rel="noopener">// already read this? <span class="t-red">skip</span> to the form →</a>
        <h1>Sup, hackers!</h1>
        <p class="tagline">
            We're opening up the Critical Thinking Research Team to more people.
            That means we're putting money on the table for hackers who want to publish research with us.
        </p>
    </div>

    <h2 class="section-title">What's in it for you</h2>
    <ul class="perks-list">
        <li>Some cash</li>
        <li>Extra distribution for your work</li>
        <li>Your name + research shouted out on the podcast</li>
        <li>Access to the private <strong>#research</strong> channel in the CTBB Discord</li>
        <li>To submit, upload your research to a drive and share the link with us using the form below.
            <span class="note">Markdown file (.md) with front matter — details below.</span></li>
    </ul>

    <h2 class="section-title">Payouts</h2>
    <div class="payouts">
        <div class="payout">
            <div class="payout-tag">Our main focus</div>
            <div class="payout-label">Micro research<br><span class="payout-sub">under 8 paragraphs</span></div>
            <div class="payout-amount">$20 – $50</div>
        </div>
        <div class="payout">
            <div class="payout-tag">Long-form</div>
            <div class="payout-label">Full write-ups<br><span class="payout-sub">1k – 5k words</span></div>
            <div class="payout-amount">$100 – $250</div>
        </div>
        <div class="payout">
            <div class="payout-tag">Deep dive</div>
            <div class="payout-label">Mega research<br><span class="payout-sub">5k+ words</span></div>
            <div class="payout-amount">$500</div>
        </div>
        <div class="payout">
            <div class="payout-tag">Bug</div>
            <div class="payout-label">Bug write-ups</div>
            <div class="payout-amount">$20 – $50</div>
        </div>
    </div>

    <div class="info-block">
        <p>Our main focus is <strong>micro research</strong>. Cool techniques, novel tricks hackers should know.</p>
        <p>If it's interesting, it gets published, and we'll cover it on the pod.</p>
    </div>

    <h2 class="section-title">Format</h2>
    <div class="format-block">
        <p>One small favor: send it as <strong>markdown</strong> (<strong>.md</strong>) with front matter on top.</p>
        <div class="fm-code">
            <button type="button" class="fm-copy" id="fm-copy-btn" aria-label="Copy front matter template">Copy</button>
<pre id="fm-template"><span class="fm-c">---</span>
<span class="fm-k">layout:</span> post
<span class="fm-k">title:</span> Title for the post
<span class="fm-k">author:</span> Researcher's Name
<span class="fm-k">date:</span> YYYY-MM-DD
<span class="fm-k">tags:</span> [comma, separated, tags]
<span class="fm-k">image:</span> /thumbnail.png (this is optional)
<span class="fm-k">profile_picture:</span> /assets/images/yourHandle.jpg
<span class="fm-k">handle:</span> YourHandle
<span class="fm-k">social_links:</span> [https://x.com/researcher, https://researchersSite.com/]

<span class="fm-k">description:</span> "A short description of what the research is about"
<span class="fm-k">permalink:</span> /research/link-you-want
<span class="fm-c">---</span>
</pre>
        </div>
        <p>Fill in whatever you know and leave the rest — we'll handle the paths, permalink and thumbnail on our end.</p>
    </div>

    <div class="exclusivity-callout">
        <div class="exclusivity-badge-wrap">
            <span class="exclusivity-badge">⚠ !important</span>
        </div>
        <p class="lead">We ask for <strong class="t-red">30 days of exclusivity</strong> on our Research Page, just so we can flex on the pod that these techniques dropped here first. So upload it to a Drive and send us the link to it using the form below, do <strong>not</strong> host it on your blog/medium/anywhere easily reachable.</p>
        <p>We used to ask for perpetual exclusivity, but your personal site/blog shouldn't be held back. So for the first 30 days, don't post it anywhere else. After that, feel free to publish it on your own pages too!</p>
    </div>

    <div class="cta-section">
        <p>We have some incredible hackers on the Research Team already.<br>If you think you'd like to join them — let's go.</p>
        <a href="https://forms.gle/Rjm2Qn8aFn4fSxHp8" class="cta-button" target="_blank" rel="noopener">
            Submit your research<span class="cta-arrow">→</span>
        </a>
    </div>

</div>

<script>
(function () {
    var btn = document.getElementById('fm-copy-btn');
    var tpl = document.getElementById('fm-template');
    if (!btn || !tpl) return;

    var resetTimer;

    function flash(label) {
        btn.textContent = label;
        btn.classList.add('copied');
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    }

    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        return ok;
    }

    btn.addEventListener('click', function () {
        var text = tpl.textContent;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                flash('Copied!');
            }, function () {
                flash(fallbackCopy(text) ? 'Copied!' : 'Press Ctrl+C');
            });
        } else {
            flash(fallbackCopy(text) ? 'Copied!' : 'Press Ctrl+C');
        }
    });
})();
</script>
