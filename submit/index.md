---
layout: default
title: Submit Research - Critical Thinking Bug Bounty Podcast
permalink: /submit/
---
<style>
    ::-webkit-scrollbar {
        width: 8px;
        background: #222;
    }
    ::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    body {
        background-color: #1e1e1e;
        color: #ffffff;
    }

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
        color: #58a6ff;
        font-size: 0.95em;
        margin-bottom: 10px;
        text-decoration: none;
        animation: skipBlink 1.6s ease-in-out infinite;
    }

    .skip-link:hover {
        color: #fff;
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
        color: #ffffff;
    }

    .submit-header .tagline {
        color: #ccc;
        font-size: 1.05em;
        line-height: 1.6;
        max-width: 640px;
        margin: 0 auto;
    }

    .section-title {
        font-size: 1.3em;
        color: #58a6ff;
        margin: 0 0 20px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #333;
    }

    .section-title::before {
        content: "// ";
        color: #555;
    }

    .perks-list {
        list-style: none;
        padding: 0;
        margin: 0 0 50px 0;
    }

    .perks-list li {
        position: relative;
        padding: 8px 0 8px 28px;
        color: #ddd;
        font-size: 1em;
        line-height: 1.6;
    }

    .perks-list li::before {
        content: "›";
        position: absolute;
        left: 4px;
        top: 8px;
        color: #58a6ff;
        font-weight: 600;
    }

    .perks-list li strong {
        color: #58a6ff;
    }

    .perks-list li .note {
        display: block;
        color: #999;
        font-size: 0.9em;
        margin-top: 4px;
    }

    .info-block {
        background-color: #1a1a1a;
        padding: 25px 30px;
        border-radius: 6px;
        margin-bottom: 50px;
        line-height: 1.7;
        border: 1px solid #2a2a2a;
    }

    .info-block p {
        margin: 0 0 12px 0;
        color: #ddd;
    }

    .info-block p:last-child {
        margin-bottom: 0;
    }

    .info-block strong {
        color: #58a6ff;
    }

    .payouts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 30px;
    }

    .payout {
        background-color: #1a1a1a;
        padding: 20px;
        border-radius: 6px;
        border: 1px solid #2a2a2a;
        position: relative;
        transition: all 0.25s ease;
        display: flex;
        flex-direction: column;
    }

    .payout:hover {
        border-color: #58a6ff;
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(88, 166, 255, 0.15);
    }

    .payout-tag {
        font-size: 0.75em;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
    }

    .payout-label {
        font-size: 1em;
        color: #ddd;
        margin-bottom: 12px;
    }

    .payout-amount {
        font-size: 1.4em;
        color: #58a6ff;
        font-weight: 600;
        margin-top: auto;
    }

    .budget-note {
        background-color: #181818;
        border-left: 3px solid #ff5252;
        padding: 15px 20px;
        border-radius: 4px;
        color: #ccc;
        font-size: 0.95em;
        margin-bottom: 50px;
    }

    .exclusivity-callout {
        position: relative;
        background: linear-gradient(135deg, #2a1414 0%, #1a1a1a 100%);
        border: 1px solid #ff5252;
        border-radius: 6px;
        padding: 25px 30px;
        margin-bottom: 30px;
        box-shadow: 0 0 20px rgba(255, 82, 82, 0.1);
    }

    .exclusivity-badge-wrap {
        text-align: center;
        margin-bottom: 20px;
    }

    .exclusivity-badge {
        display: inline-block;
        background-color: #ff5252;
        color: #0f0f0f;
        font-size: 1.1em;
        font-weight: 700;
        padding: 8px 18px;
        border-radius: 4px;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .exclusivity-callout p.lead {
        font-size: 1.15em;
        color: #ffffff;
        line-height: 1.5;
    }

    .exclusivity-headline {
        font-size: 1.25em;
        color: #ffffff;
        margin: 0 0 12px 0;
        line-height: 1.4;
    }

    .exclusivity-headline .highlight {
        color: #ff5252;
    }

    .exclusivity-callout p {
        color: #ccc;
        line-height: 1.6;
        margin: 0 0 10px 0;
        font-size: 0.95em;
    }

    .exclusivity-callout p:last-child {
        margin-bottom: 0;
    }

    .exclusivity-callout .examples {
        color: #888;
        font-size: 0.85em;
        margin-top: 12px;
        font-style: italic;
    }

    .cta-section {
        text-align: center;
        padding: 40px 20px;
        background-color: #1a1a1a;
        border-radius: 8px;
        margin-bottom: 30px;
        border: 1px solid #2a2a2a;
    }

    .cta-section p {
        color: #ddd;
        margin: 0 0 25px 0;
        line-height: 1.6;
    }

    .cta-button {
        display: inline-block;
        padding: 14px 36px;
        background-color: #58a6ff;
        color: #0f0f0f;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 1.05em;
        transition: all 0.25s ease;
        border: 1px solid #58a6ff;
    }

    .cta-button:hover {
        background-color: transparent;
        color: #58a6ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(88, 166, 255, 0.25);
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
        <a class="skip-link" href="https://forms.gle/Rjm2Qn8aFn4fSxHp8" target="_blank" rel="noopener">// already read this? <span style="color:#ff5252;">skip</span> to the form →</a>
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
        <li>To submit, upload your research to a drive and share the link with us using the form below.</li>
    </ul>

    <h2 class="section-title">Payouts</h2>
    <div class="payouts">
        <div class="payout">
            <div class="payout-tag">Our main focus</div>
            <div class="payout-label">Micro research<br><span style="color:#888;font-size:0.85em;">under 8 paragraphs</span></div>
            <div class="payout-amount">$20 – $50</div>
        </div>
        <div class="payout">
            <div class="payout-tag">Long-form</div>
            <div class="payout-label">Full write-ups<br><span style="color:#888;font-size:0.85em;">1k – 5k words</span></div>
            <div class="payout-amount">$100 – $250</div>
        </div>
        <div class="payout">
            <div class="payout-tag">Deep dive</div>
            <div class="payout-label">Mega research<br><span style="color:#888;font-size:0.85em;">5k+ words</span></div>
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

    <div class="exclusivity-callout">
        <div class="exclusivity-badge-wrap">
            <span class="exclusivity-badge">⚠ !important</span>
        </div>
        <p class="lead">We ask for <strong style="color:#ff5252;">30 days of exclusivity</strong> on our Research Page, just so we can flex on the pod that these techniques dropped here first.</p>
        <p>We used to ask for perpetual exclusivity, but your personal site/blog shouldn't be held back. So for the first 30 days, don't post it anywhere else. After that, feel free to publish it on your own pages too!</p>
    </div>

    <div class="cta-section">
        <p>We have some incredible hackers on the Research Team already.<br>If you think you'd like to join them — let's go.</p>
        <a href="https://forms.gle/Rjm2Qn8aFn4fSxHp8" class="cta-button" target="_blank" rel="noopener">
            Submit your research<span class="cta-arrow">→</span>
        </a>
    </div>

</div>
