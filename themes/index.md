---
layout: default
title: Themes - Critical Thinking Bug Bounty Podcast
permalink: /themes/
---
<link rel="stylesheet" href="/assets/css/post-toc.css">
<style>
    .themes-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 20px;
        text-align: left;
        animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .themes-header {
        text-align: center;
        margin-bottom: 32px;
    }

    .themes-header h1 {
        font-size: 2.2em;
        margin: 0 0 8px 0;
        color: var(--text);
    }

    .themes-header .tagline {
        color: var(--subtext0);
        font-size: 0.95em;
        margin: 0;
    }

    .section-title {
        font-size: 1.2em;
        color: var(--blue);
        margin: 32px 0 14px 0;
        padding-bottom: 6px;
        border-bottom: 1px solid var(--border-default);
    }

    .section-title::before {
        content: "// ";
        color: var(--overlay0);
    }

    .group-heading {
        color: var(--text);
        margin: 22px 0 10px;
        font-size: 1em;
    }

    .group-heading .group-sub {
        color: var(--overlay2);
        font-size: 0.78em;
        font-weight: 400;
        margin-left: 6px;
    }

    /* ====== Code template ====== */
    .template-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 16px;
    }

    @media (max-width: 800px) {
        .template-grid { grid-template-columns: 1fr; }
    }

    .template-box {
        position: relative;
        background-color: var(--code-bg);
        border: 1px solid var(--code-border);
        border-radius: 6px;
        padding: 38px 18px 16px;
        max-height: 540px;
        overflow: auto;
        min-width: 0;
    }

    .template-label {
        position: absolute;
        top: 10px;
        left: 14px;
        font-size: 0.72em;
        color: var(--blue);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 600;
    }

    .template-box pre {
        margin: 0;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        color: var(--code-text);
        font-size: 0.85em;
        line-height: 1.55;
        font-family: 'Fira Code', monospace;
    }

    .copy-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: var(--surface2);
        color: var(--blue);
        border: 1px solid var(--border-default);
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 0.78em;
        cursor: pointer;
        font-family: 'Fira Code', monospace;
        transition: all 0.2s ease;
    }

    .copy-btn:hover {
        background-color: var(--border-strong);
        color: var(--text);
        border-color: var(--blue);
    }

    .copy-btn.copied {
        background-color: var(--green);
        color: var(--on-accent);
        border-color: var(--green);
    }

    /* ====== Disclosure (collapsible) sections ====== */
    .disclosure {
        margin: 16px 0;
        border: 1px solid var(--border-default);
        border-radius: 6px;
        background-color: var(--mantle);
        overflow: hidden;
    }

    .disclosure > summary {
        list-style: none;
        cursor: pointer;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text);
        font-weight: 600;
        font-size: 0.95em;
        user-select: none;
        transition: background-color 0.15s ease;
    }

    .disclosure > summary::-webkit-details-marker { display: none; }

    .disclosure > summary:hover {
        background-color: var(--surface0);
    }

    .disclosure > summary::before {
        content: "▸";
        color: var(--blue);
        font-size: 0.85em;
        transition: transform 0.2s ease;
        display: inline-block;
        width: 12px;
    }

    .disclosure[open] > summary::before {
        transform: rotate(90deg);
    }

    .disclosure-sub {
        margin-left: auto;
        color: var(--overlay2);
        font-weight: 400;
        font-size: 0.85em;
    }

    .disclosure-body {
        padding: 18px 22px 22px;
        border-top: 1px solid var(--border-subtle);
    }

    /* ====== Token swatches — simple list grid ====== */
    .swatch-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
        margin-bottom: 12px;
    }

    .swatch {
        display: flex;
        align-items: stretch;
        background-color: var(--base);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        overflow: hidden;
    }

    .swatch-chip {
        flex: 0 0 56px;
        min-height: 56px;
        background-image:
            linear-gradient(45deg, rgba(127,127,127,0.15) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(127,127,127,0.15) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(127,127,127,0.15) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(127,127,127,0.15) 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0;
        position: relative;
    }

    .swatch-chip::after {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--swatch-color);
    }

    .swatch-chip.percent {
        background-image: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Fira Code', monospace;
        color: var(--blue);
        font-weight: 600;
    }
    .swatch-chip.percent::after { display: none; }

    .swatch-info {
        flex: 1;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
    }

    .swatch-name {
        font-size: 0.78em;
        color: var(--text);
        word-break: break-all;
        line-height: 1.3;
    }

    .swatch-value {
        font-size: 0.72em;
        color: var(--overlay2);
        margin-top: 3px;
        word-break: break-all;
    }

    /* ====== Token table — base + variations side-by-side ====== */
    .palette-table {
        display: grid;
        gap: 4px;
        margin-bottom: 16px;
        align-items: stretch;
        overflow-x: auto;
    }

    .palette-head {
        font-size: 0.65em;
        color: var(--overlay2);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        padding: 6px 8px;
        text-align: center;
    }

    .palette-head.first { text-align: left; padding-left: 4px; }

    .palette-row-name {
        font-size: 0.82em;
        color: var(--text);
        padding: 0 10px;
        display: flex;
        align-items: center;
        font-family: 'Fira Code', monospace;
        background-color: var(--surface0);
        border-radius: 4px;
        min-height: 56px;
    }

    .palette-cell {
        display: flex;
        flex-direction: column;
        background-color: var(--base);
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
        overflow: hidden;
        min-height: 56px;
    }

    .palette-cell.empty {
        background: transparent;
        border: 1px dashed color-mix(in srgb, var(--border-subtle), transparent 50%);
    }

    .palette-chip {
        flex: 1;
        min-height: 30px;
        background-image:
            linear-gradient(45deg, rgba(127,127,127,0.12) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(127,127,127,0.12) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(127,127,127,0.12) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(127,127,127,0.12) 75%);
        background-size: 10px 10px;
        background-position: 0 0, 0 5px, 5px -5px, -5px 0;
        position: relative;
    }

    .palette-chip::after {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--swatch-color);
    }

    .palette-cell-value {
        font-size: 0.62em;
        color: var(--overlay2);
        padding: 2px 4px;
        text-align: center;
        word-break: break-all;
        background: var(--mantle);
        border-top: 1px solid var(--border-subtle);
        font-family: 'Fira Code', monospace;
        line-height: 1.3;
    }

    /* ====== Demo post ====== */
    .demo-post {
        background-color: var(--base);
        border-radius: 6px;
        padding: 28px 32px;
        line-height: 1.7;
        color: var(--subtext0);
    }

    .demo-post-header {
        text-align: center;
        margin-bottom: 28px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-subtle);
    }

    .demo-post-header h1 {
        font-size: 1.8em;
        color: var(--text);
        margin: 0 0 12px 0;
    }

    .demo-post-meta {
        font-size: 0.85em;
        color: var(--overlay2);
    }

    .demo-post-meta .demo-author {
        color: var(--blue);
        font-weight: 500;
    }

    .demo-post-tags {
        display: inline-flex;
        gap: 5px;
        margin-left: 8px;
    }

    .demo-tag {
        font-size: 0.78em;
        padding: 2px 7px;
        border-radius: 10px;
        background-color: var(--surface2);
        color: var(--blue);
    }

    .demo-post h2 {
        color: var(--text);
        font-size: 1.4em;
        margin: 1.6em 0 0.6em;
    }

    .demo-post h3 {
        color: var(--text);
        font-size: 1.15em;
        margin: 1.4em 0 0.5em;
    }

    .demo-post p {
        margin: 0 0 1em 0;
    }

    /* Inline post links — :not(.demo-button) so this rule doesn't leak
       its border-bottom underline onto button anchors. */
    .demo-post a:not(.demo-button) {
        color: var(--blue);
        text-decoration: none;
        border-bottom: 1px solid var(--blue-tint);
    }

    .demo-post a:not(.demo-button):hover {
        color: var(--text);
        border-bottom-color: var(--text);
    }

    .demo-post strong { color: var(--text); }
    .demo-post em { color: var(--subtext1); font-style: italic; }

    .demo-post code {
        background-color: var(--blue-tint);
        color: var(--blue);
        padding: 1px 6px;
        border-radius: 3px;
        font-size: 0.9em;
        font-family: 'Fira Code', monospace;
    }

    .demo-post pre {
        background-color: var(--code-bg);
        border: 1px solid var(--code-border);
        border-left: 4px solid var(--blue);
        border-radius: 5px;
        padding: 12px 14px;
        margin: 18px 0;
        font-family: 'Fira Code', monospace;
        font-size: 0.85em;
        color: var(--code-text);
        line-height: 1.55;
        overflow: auto;
    }

    .demo-post pre code {
        background: transparent;
        padding: 0;
        color: inherit;
    }

    .sc-k { color: var(--mauve); }
    .sc-s { color: var(--green); }
    .sc-n { color: var(--peach); }
    .sc-c { color: var(--overlay2); font-style: italic; }
    .sc-f { color: var(--blue); }

    .demo-post ul, .demo-post ol {
        padding-left: 1.6em;
        margin: 0 0 1em 0;
    }

    .demo-post li { margin-bottom: 0.4em; }

    .demo-post blockquote {
        border-left: 4px solid var(--blue);
        padding: 0.4em 1em;
        margin: 1em 0;
        color: var(--overlay2);
        font-style: italic;
    }

    .demo-post hr {
        border: none;
        border-top: 1px solid var(--border-subtle);
        margin: 2em 0;
    }

    .demo-callout {
        padding: 12px 16px;
        margin: 16px 0;
        border-left: 4px solid;
        border-radius: 4px;
        font-size: 0.95em;
    }

    .demo-callout strong { margin-right: 4px; }
    .demo-callout-info { border-color: var(--callout-info-border); background-color: var(--callout-info-bg); }
    .demo-callout-success { border-color: var(--callout-success-border); background-color: var(--callout-success-bg); }
    .demo-callout-danger { border-color: var(--callout-danger-border); background-color: var(--callout-danger-bg); }
    .demo-callout-warning { border-color: var(--callout-warning-border); background-color: var(--callout-warning-bg); }
    .demo-callout-question { border-color: var(--callout-question-border); background-color: var(--callout-question-bg); }
    .demo-callout-note { border-color: var(--callout-note-border); background-color: var(--callout-note-bg); }

    .demo-custom-panel {
        background-color: color-mix(in srgb, var(--red) var(--alpha-callout), var(--mantle));
        border: 1px solid var(--red);
        border-radius: 6px;
        padding: 16px 20px;
        margin: 18px 0;
        text-align: center;
        box-shadow: 0 0 18px var(--red-tint);
    }

    .demo-custom-panel .demo-custom-badge {
        display: inline-block;
        background-color: var(--red);
        color: var(--on-accent);
        font-size: 0.78em;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 4px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 6px;
    }

    .demo-custom-panel p {
        margin: 4px 0 0 0;
        color: var(--subtext1);
        font-size: 0.9em;
    }

    .demo-button-row {
        margin-top: 24px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    /* Prefixed with .demo-post to win specificity over .demo-post a */
    .demo-post .demo-button {
        display: inline-block;
        padding: 10px 22px;
        background-color: var(--blue);
        color: var(--on-accent);
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.95em;
        border: 1px solid var(--blue);
        text-decoration: none;
        transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    }

    .demo-post .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px var(--blue-glow);
    }

    .demo-post .demo-button.ghost {
        background-color: var(--surface2);
        color: var(--blue);
        border-color: var(--border-strong);
    }

    .demo-post .demo-button.ghost:hover {
        background-color: var(--border-strong);
        border-color: var(--blue);
        color: var(--text);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px var(--blue-glow);
    }

    /* ====== PR button ====== */
    .pr-cta-row {
        text-align: center;
        margin: 32px 0 12px;
    }

    .pr-cta {
        display: inline-block;
        padding: 12px 28px;
        background-color: var(--blue);
        color: var(--on-accent);
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 1em;
        border: 1px solid var(--blue);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .pr-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px var(--blue-glow);
    }
</style>

<div class="themes-container">

    <div class="themes-header">
        <h1>Themes</h1>
        <p class="tagline">Fork a theme in three steps. Live preview below.</p>
    </div>

    <div id="post-toc-mobile" class="post-toc-mobile">
        <button type="button" class="post-toc-mobile-toggle" aria-expanded="false" aria-controls="post-toc-mobile-panel">
            Sections <span class="post-toc-caret" aria-hidden="true">▾</span>
        </button>
        <nav id="post-toc-mobile-panel" class="post-toc-mobile-panel" aria-label="Sections">
            <ul class="post-toc-list post-toc-list-h2">
                <li class="post-toc-item-h2"><a class="post-toc-link" href="#copy-template">1. Copy template</a></li>
                <li class="post-toc-item-h2"><a class="post-toc-link" href="#paste-it">2. Paste it</a></li>
                <li class="post-toc-item-h2"><a class="post-toc-link" href="#live-preview">3. Live preview</a></li>
                <li class="post-toc-item-h2"><a class="post-toc-link" href="#palette">4. Palette</a></li>
                <li class="post-toc-item-h2"><a class="post-toc-link" href="#open-pr">5. Open a PR</a></li>
            </ul>
        </nav>
    </div>

    <h2 class="section-title" id="copy-template">1. Copy a template</h2>
    <p style="color: var(--subtext1); margin: -4px 0 14px;">
        Pick the template that matches your design. Each block is complete on its own — palette, shadows, banner, and (for the light variant) shell overrides for the header / navbar / footer.
    </p>

    <div class="template-grid">
        <div class="template-box">
            <span class="template-label">For dark themes</span>
            <button class="copy-btn" data-copy-target="template-text-dark" type="button">Copy</button>
            <pre id="template-text-dark">{% raw %}[data-theme="your-dark-theme"] {
    /* Neutrals (light → dark scale) */
    --text:      #ffffff;
    --subtext1:  #dddddd;
    --subtext0:  #cccccc;
    --overlay2:  #999999;
    --overlay1:  #777777;
    --overlay0:  #555555;
    --surface2:  #333333;
    --surface1:  #2a2a2a;
    --surface0:  #252525;
    --base:      #1e1e1e;
    --mantle:    #1a1a1a;
    --crust:     #181818;

    /* Accents (14 hues) */
    --rosewater: #f5e0dc;
    --flamingo:  #f2cdcd;
    --pink:      #f5c2e7;
    --mauve:     #a371f7;
    --red:       #ff5252;
    --maroon:    #eba0ac;
    --peach:     #d29922;
    --yellow:    #f9e2af;
    --green:     #6bff77;
    --teal:      #94e2d5;
    --sky:       #89dceb;
    --sapphire:  #74c7ec;
    --blue:      #58a6ff;
    --lavender:  #b4befe;

    /* Code surfaces */
    --code-bg:     #0d1117;
    --code-text:   #c9d1d9;
    --code-border: #30363d;

    /* Mix percentages */
    --alpha-strong:  15%;
    --alpha-tint:    15%;
    --alpha-glow:    25%;
    --alpha-callout: 18%;

    /* Solid-accent contrast */
    --on-accent: #0f0f0f;

    /* Shadows */
    --shadow-card:        0 3px 10px rgba(0, 0, 0, 0.2);
    --shadow-card-hover:  0 5px 15px rgba(0, 0, 0, 0.3);

    /* Shell — header / nav / footer */
    --shell-bg: #0f0f0f;
    --shell-bg-overlay: rgba(24, 24, 24, 0.8);
    --shell-bg-overlay-subtle: rgba(24, 24, 24, 0.7);
    --shell-text: #ffffff;
    --shell-text-faded: #777777;
    --shell-accent: #58a6ff;
    --shell-border: #333333;
    --shell-border-strong: #444444;

    /* Banner */
    --logo-image: url(/assets/images/CTLogo.png);
}{% endraw %}</pre>
        </div>

        <div class="template-box">
            <span class="template-label">For light themes</span>
            <button class="copy-btn" data-copy-target="template-text-light" type="button">Copy</button>
            <pre id="template-text-light">{% raw %}[data-theme="your-light-theme"] {
    /* Neutrals (light → dark scale) */
    --text:      #4c4f69;
    --subtext1:  #5c5f77;
    --subtext0:  #6c6f85;
    --overlay2:  #7c7f93;
    --overlay1:  #8c8fa1;
    --overlay0:  #9ca0b0;
    --surface2:  #acb0be;
    --surface1:  #bcc0cc;
    --surface0:  #ccd0da;
    --base:      #eff1f5;
    --mantle:    #e6e9ef;
    --crust:     #dce0e8;

    /* Accents (14 hues) */
    --rosewater: #dc8a78;
    --flamingo:  #dd7878;
    --pink:      #ea76cb;
    --mauve:     #8839ef;
    --red:       #d20f39;
    --maroon:    #e64553;
    --peach:     #fe640b;
    --yellow:    #df8e1d;
    --green:     #40a02b;
    --teal:      #179299;
    --sky:       #04a5e5;
    --sapphire:  #209fb5;
    --blue:      #1e66f5;
    --lavender:  #7287fd;

    /* Code surfaces */
    --code-bg:     #eff1f5;
    --code-text:   #4c4f69;
    --code-border: #ccd0da;

    /* Mix percentages */
    --alpha-strong:  15%;
    --alpha-tint:    15%;
    --alpha-glow:    25%;
    --alpha-callout: 18%;

    /* Solid-accent contrast */
    --on-accent: #ffffff;

    /* Shadows */
    --shadow-card:        0 3px 10px rgba(76, 79, 105, 0.08);
    --shadow-card-hover:  0 5px 15px rgba(76, 79, 105, 0.14);

    /* Shell — header / nav / footer */
    --shell-bg: #dce0e8;
    --shell-bg-overlay: rgba(220, 224, 232, 0.8);
    --shell-bg-overlay-subtle: rgba(220, 224, 232, 0.7);
    --shell-text: #4c4f69;
    --shell-text-faded: #8c8fa1;
    --shell-accent: #1e66f5;
    --shell-border: #bcc0cc;
    --shell-border-strong: #acb0be;

    /* Banner */
    --logo-image: url(/assets/images/CTLogo_LightBG.png);
}{% endraw %}</pre>
        </div>
    </div>

    <h2 class="section-title" id="paste-it">2. Two tiny edits</h2>
    <p style="color: var(--subtext1); margin: -4px 0 10px;">That's it — the rest happens automatically. Open a PR.</p>

    <ol style="color: var(--subtext1); padding-left: 20px; line-height: 1.7; margin: 0 0 14px;">
        <li>
            Paste the template into <code style="background-color: var(--blue-tint); color: var(--blue); padding: 1px 6px; border-radius: 3px;">assets/css/theme.css</code> and rename the <code style="background-color: var(--blue-tint); color: var(--blue); padding: 1px 6px; border-radius: 3px;">[data-theme="..."]</code> selector to your theme's id.
        </li>
        <li>
            Add one line to the <code style="background-color: var(--blue-tint); color: var(--blue); padding: 1px 6px; border-radius: 3px;">SITE_THEMES</code> array in <code style="background-color: var(--blue-tint); color: var(--blue); padding: 1px 6px; border-radius: 3px;">_layouts/default.html</code>:
            <pre style="margin: 8px 0 4px; padding: 10px 12px; background-color: var(--code-bg); border: 1px solid var(--code-border); border-radius: 4px; color: var(--code-text); font-family: 'Fira Code', monospace; font-size: 0.85em; overflow-x: auto;">window.SITE_THEMES = [
  { id: 'ct-dark', label: 'CT Dark' },
  <span style="color: var(--green);">{ id: 'your-theme-id', label: 'Your Theme Name' }</span>
];</pre>
        </li>
    </ol>
    <p style="color: var(--subtext0); margin: 0 0 16px; font-size: 0.9em;">
        Preview locally without a deploy: <code style="background-color: var(--blue-tint); color: var(--blue); padding: 1px 6px; border-radius: 3px;">localStorage.setItem('theme', 'your-theme-id')</code> in the browser console, reload, done.
    </p>

    <details class="disclosure" id="live-preview">
        <summary>
            Live preview
            <span class="disclosure-sub">— a sample post rendered with the active theme</span>
        </summary>
        <div class="disclosure-body">
            <article class="demo-post">
                <header class="demo-post-header">
                    <h1>Sample Post — every component, in context</h1>
                    <div class="demo-post-meta">
                        <span class="demo-author">@author</span> · Jan 1, 2026
                        <span class="demo-post-tags">
                            <span class="demo-tag">demo</span>
                            <span class="demo-tag">tag</span>
                            <span class="demo-tag">tag</span>
                        </span>
                    </div>
                </header>

                <p>This is what a post looks like rendered with the active theme. Every block below uses real tokens from the palette, so swapping themes will flip everything you see here. Use it to spot any color that reads badly against its surface.</p>

                <p>Body copy uses <code>--subtext0</code>. <strong>Bold</strong> goes to <code>--text</code>. <em>Italic</em> goes to <code>--subtext1</code>. <a href="#">Links</a> use <code>--blue</code> with a faint underline derived from <code>--blue-tint</code>. Inline <code>code</code> sits inside a <code>--blue-tint</code> pill.</p>

                <div class="demo-callout demo-callout-info">
                    <strong>Info callout —</strong> border is <code>--blue</code>, background is <code>--blue</code> mixed with <code>--mantle</code> at <code>--alpha-callout</code>. Use these for orientation, context, and "by the way" notes.
                </div>

                <h2>Headings, paragraphs, lists</h2>
                <p>H1 / H2 / H3 all sit on <code>--text</code>. Captions and metadata use <code>--overlay2</code> — that's why the date above looks one shade quieter than the rest.</p>

                <ul>
                    <li>Bullet lists exist. Body color is <code>--subtext0</code>.</li>
                    <li>Bullets themselves inherit. Spacing is up to the post template.</li>
                    <li>Don't worry about the markers — those come from the browser default.</li>
                </ul>

                <div class="demo-callout demo-callout-warning">
                    <strong>Warning callout —</strong> <code>--peach</code> family. Soft background, full-saturation border. Use for caveats and gotchas.
                </div>

                <blockquote>
                    Block quotes use a <code>--blue</code> left border and <code>--overlay2</code> italic text. Quote whatever you want.
                </blockquote>

                <h3>Code blocks</h3>
                <p>Code blocks sit on <code>--code-bg</code> with a <code>--code-border</code> outline and a <code>--blue</code> accent stripe on the left. The syntax tokens below pull from the accent palette directly:</p>

                <pre><code><span class="sc-c">// comment → --overlay2</span>
<span class="sc-k">const</span> <span class="sc-n">value</span> = <span class="sc-f">someFunction</span>(<span class="sc-s">'string'</span>);
<span class="sc-c">// keyword → --mauve   string → --green</span>
<span class="sc-c">// number → --peach    function → --blue</span></code></pre>

                <div class="demo-callout demo-callout-success">
                    <strong>Success callout —</strong> <code>--green-strong</code> family. The <code>-strong</code> companion is automatically derived as 15% darker than the base <code>--green</code> via <code>--alpha-strong</code>.
                </div>

                <div class="demo-callout demo-callout-danger">
                    <strong>Danger callout —</strong> <code>--red-strong</code> family. Use for hard errors, broken builds, things you really don't want the reader to skim past.
                </div>

                <h3>Open questions and side notes</h3>
                <p>Two more callout flavors round out the set:</p>

                <div class="demo-callout demo-callout-question">
                    <strong>Question callout —</strong> <code>--mauve</code> family. For open-ended threads, "anyone seen this?", future work.
                </div>

                <div class="demo-callout demo-callout-note">
                    <strong>Note callout —</strong> aliased to the info palette. For asides that don't quite need the weight of an info banner.
                </div>

                <h2>Custom UI vs callouts</h2>
                <p>Sometimes a post needs a one-off colored panel that isn't a callout. The rule: pull from the source palette and inline <code>color-mix()</code>. Don't reach for <code>--callout-*</code> tokens — those belong to the callout component.</p>

                <hr>

                <div class="demo-custom-panel">
                    <span class="demo-custom-badge">Custom panel</span>
                    <p>This block uses <code style="color: var(--red);">color-mix(in srgb, var(--red) var(--alpha-callout), var(--mantle))</code> for its background — same recipe as the danger callout, but written inline so it stays unambiguous about where the color comes from.</p>
                </div>

                <h3>Buttons</h3>
                <p>Primary buttons sit on <code>--blue</code> with <code>--on-accent</code> text — that's the dark color that contrasts with every accent. Ghost buttons sit on <code>--surface2</code> with the accent as foreground.</p>

                <div class="demo-button-row">
                    <a href="#" class="demo-button">Primary action →</a>
                    <a href="#" class="demo-button ghost">Ghost action</a>
                </div>
            </article>
        </div>
    </details>

    <details class="disclosure" id="palette">
        <summary>
            Palette
            <span class="disclosure-sub">— each color and its variations side-by-side</span>
        </summary>
        <div class="disclosure-body">

            <h3 class="group-heading">Neutrals <span class="group-sub">— light → dark scale</span></h3>
            <div class="swatch-grid" id="swatches-neutrals"></div>

            <h3 class="group-heading">Accents <span class="group-sub">— each row: base + every variation derived from it</span></h3>
            <div class="palette-table" id="table-accents"></div>

            <h3 class="group-heading">Borders <span class="group-sub">— derived from <code style="background:var(--blue-tint);color:var(--blue);padding:1px 4px;border-radius:2px;">--surface2</code></span></h3>
            <div class="palette-table" id="table-borders"></div>

            <h3 class="group-heading">Scrollbar <span class="group-sub">— derived from <code style="background:var(--blue-tint);color:var(--blue);padding:1px 4px;border-radius:2px;">--surface2</code></span></h3>
            <div class="palette-table" id="table-scrollbar"></div>

            <h3 class="group-heading">Callouts <span class="group-sub">— each row: border + bg pair</span></h3>
            <div class="palette-table" id="table-callouts"></div>

            <h3 class="group-heading">Code surfaces</h3>
            <div class="swatch-grid" id="swatches-code"></div>

            <h3 class="group-heading">Mix percentages</h3>
            <div class="swatch-grid" id="swatches-alpha"></div>

            <h3 class="group-heading">Misc &amp; shell</h3>
            <div class="swatch-grid" id="swatches-misc"></div>
            <div class="swatch-grid" id="swatches-shell"></div>

        </div>
    </details>

    <div class="pr-cta-row" id="open-pr">
        <a class="pr-cta" href="https://github.com/criticalthinkingpodcast/criticalthinkingpodcast.github.io" target="_blank" rel="noopener">Open a PR →</a>
    </div>

</div>

<script>
(function() {
    /* Simple list-grid sections (no source→variation relationship) */
    var simpleGroups = {
        neutrals: [
            '--text', '--subtext1', '--subtext0',
            '--overlay2', '--overlay1', '--overlay0',
            '--surface2', '--surface1', '--surface0',
            '--base', '--mantle', '--crust'
        ],
        code: ['--code-bg', '--code-text', '--code-border'],
        alpha: ['--alpha-strong', '--alpha-tint', '--alpha-glow', '--alpha-callout'],
        misc: ['--on-accent', '--shadow-card', '--shadow-card-hover'],
        shell: [
            '--shell-bg', '--shell-bg-overlay', '--shell-bg-overlay-subtle',
            '--shell-text', '--shell-text-faded', '--shell-accent',
            '--shell-border', '--shell-border-strong'
        ]
    };

    /* Side-by-side tables: each row = one source color + its variations */
    var tables = {
        'table-accents': {
            nameColumn: true,
            headers: ['base', '-strong', '-tint', '-glow', '-bg-hover'],
            rows: [
                { name: 'rosewater', tokens: ['--rosewater', '--rosewater-strong', '--rosewater-tint', '--rosewater-glow', '--rosewater-bg-hover'] },
                { name: 'flamingo',  tokens: ['--flamingo',  '--flamingo-strong',  '--flamingo-tint',  '--flamingo-glow',  '--flamingo-bg-hover'] },
                { name: 'pink',      tokens: ['--pink',      '--pink-strong',      '--pink-tint',      '--pink-glow',      '--pink-bg-hover'] },
                { name: 'mauve',     tokens: ['--mauve',     '--mauve-strong',     '--mauve-tint',     '--mauve-glow',     '--mauve-bg-hover'] },
                { name: 'red',       tokens: ['--red',       '--red-strong',       '--red-tint',       '--red-glow',       '--red-bg-hover'] },
                { name: 'maroon',    tokens: ['--maroon',    '--maroon-strong',    '--maroon-tint',    '--maroon-glow',    '--maroon-bg-hover'] },
                { name: 'peach',     tokens: ['--peach',     '--peach-strong',     '--peach-tint',     '--peach-glow',     '--peach-bg-hover'] },
                { name: 'yellow',    tokens: ['--yellow',    '--yellow-strong',    '--yellow-tint',    '--yellow-glow',    '--yellow-bg-hover'] },
                { name: 'green',     tokens: ['--green',     '--green-strong',     '--green-tint',     '--green-glow',     '--green-bg-hover'] },
                { name: 'teal',      tokens: ['--teal',      '--teal-strong',      '--teal-tint',      '--teal-glow',      '--teal-bg-hover'] },
                { name: 'sky',       tokens: ['--sky',       '--sky-strong',       '--sky-tint',       '--sky-glow',       '--sky-bg-hover'] },
                { name: 'sapphire',  tokens: ['--sapphire',  '--sapphire-strong',  '--sapphire-tint',  '--sapphire-glow',  '--sapphire-bg-hover'] },
                { name: 'blue',      tokens: ['--blue',      '--blue-strong',      '--blue-tint',      '--blue-glow',      '--blue-bg-hover'] },
                { name: 'lavender',  tokens: ['--lavender',  '--lavender-strong',  '--lavender-tint',  '--lavender-glow',  '--lavender-bg-hover'] }
            ]
        },
        'table-borders': {
            nameColumn: false,
            headers: ['--surface2', '--border-default', '--border-strong', '--border-subtle', '--border-divider'],
            rows: [
                { tokens: ['--surface2', '--border-default', '--border-strong', '--border-subtle', '--border-divider'] }
            ]
        },
        'table-scrollbar': {
            nameColumn: false,
            headers: ['--surface2', '--scrollbar-track', '--scrollbar-thumb', '--scrollbar-thumb-hover'],
            rows: [
                { tokens: ['--surface2', '--scrollbar-track', '--scrollbar-thumb', '--scrollbar-thumb-hover'] }
            ]
        },
        'table-callouts': {
            nameColumn: true,
            headers: ['-border', '-bg'],
            rows: [
                { name: 'info',     tokens: ['--callout-info-border',     '--callout-info-bg'] },
                { name: 'success',  tokens: ['--callout-success-border',  '--callout-success-bg'] },
                { name: 'danger',   tokens: ['--callout-danger-border',   '--callout-danger-bg'] },
                { name: 'warning',  tokens: ['--callout-warning-border',  '--callout-warning-bg'] },
                { name: 'question', tokens: ['--callout-question-border', '--callout-question-bg'] },
                { name: 'note',     tokens: ['--callout-note-border',     '--callout-note-bg'] }
            ]
        }
    };

    function isPercentToken(t) { return t.indexOf('--alpha-') === 0; }

    function buildSwatchListItem(token, rs) {
        var value = rs.getPropertyValue(token).trim();
        var s = document.createElement('div');
        s.className = 'swatch';
        s.title = token + ': ' + value;

        var chip;
        if (isPercentToken(token)) {
            chip = '<div class="swatch-chip percent">' + (value || '—') + '</div>';
        } else if (token.indexOf('shadow') !== -1) {
            chip = '<div class="swatch-chip" style="box-shadow: ' + value + ';"></div>';
        } else {
            chip = '<div class="swatch-chip" style="--swatch-color: ' + value + ';"></div>';
        }

        s.innerHTML =
            chip +
            '<div class="swatch-info">' +
                '<div class="swatch-name">' + token + '</div>' +
                '<div class="swatch-value">' + (value || '(unset)') + '</div>' +
            '</div>';
        return s;
    }

    function renderSimpleGroup(id, tokens) {
        var c = document.getElementById('swatches-' + id);
        if (!c) return;
        c.innerHTML = '';
        var rs = getComputedStyle(document.documentElement);
        tokens.forEach(function(token) { c.appendChild(buildSwatchListItem(token, rs)); });
    }

    function buildTableCell(token, rs) {
        var cell = document.createElement('div');
        cell.className = 'palette-cell';
        if (!token) {
            cell.classList.add('empty');
            return cell;
        }
        var value = rs.getPropertyValue(token).trim();
        cell.title = token + ': ' + value;
        cell.innerHTML =
            '<div class="palette-chip" style="--swatch-color: ' + value + ';"></div>' +
            '<div class="palette-cell-value">' + (value || '—') + '</div>';
        return cell;
    }

    function renderTable(id, config) {
        var c = document.getElementById(id);
        if (!c) return;
        c.innerHTML = '';
        var hasName = config.nameColumn !== false;
        var rs = getComputedStyle(document.documentElement);
        var cols = config.headers.length;
        c.style.gridTemplateColumns = (hasName ? 'minmax(80px, 110px) ' : '') + 'repeat(' + cols + ', minmax(0, 1fr))';

        // Header row
        if (hasName) {
            var nh = document.createElement('div');
            nh.className = 'palette-head first';
            c.appendChild(nh);
        }
        config.headers.forEach(function(h) {
            var cell = document.createElement('div');
            cell.className = 'palette-head';
            cell.textContent = h;
            c.appendChild(cell);
        });

        // Data rows
        config.rows.forEach(function(row) {
            if (hasName) {
                var nameCell = document.createElement('div');
                nameCell.className = 'palette-row-name';
                nameCell.textContent = row.name || '';
                c.appendChild(nameCell);
            }
            row.tokens.forEach(function(token) { c.appendChild(buildTableCell(token, rs)); });
        });
    }

    function renderSwatches() {
        Object.keys(simpleGroups).forEach(function(k) { renderSimpleGroup(k, simpleGroups[k]); });
        Object.keys(tables).forEach(function(id) { renderTable(id, tables[id]); });
    }

    function setupCopy() {
        document.querySelectorAll('.copy-btn[data-copy-target]').forEach(function(btn) {
            var text = document.getElementById(btn.getAttribute('data-copy-target'));
            if (!text) return;
            btn.addEventListener('click', function() {
                var content = text.textContent;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(content).then(showCopied).catch(fallback);
                } else {
                    fallback();
                }
                function fallback() {
                    var ta = document.createElement('textarea');
                    ta.value = content;
                    ta.style.position = 'fixed';
                    ta.style.opacity = '0';
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); } catch (e) {}
                    document.body.removeChild(ta);
                    showCopied();
                }
                function showCopied() {
                    btn.classList.add('copied');
                    btn.textContent = 'Copied!';
                    setTimeout(function() {
                        btn.classList.remove('copied');
                        btn.textContent = 'Copy';
                    }, 1500);
                }
            });
        });
    }

    function setupToc() {
        var wrap = document.getElementById('post-toc-mobile');
        if (!wrap) return;
        var toggle = wrap.querySelector('.post-toc-mobile-toggle');
        var panel = wrap.querySelector('.post-toc-mobile-panel');

        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            var open = wrap.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        document.addEventListener('click', function() {
            wrap.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });

        panel.addEventListener('click', function(e) { e.stopPropagation(); });

        // Auto-open disclosures when their TOC link is clicked
        panel.querySelectorAll('a.post-toc-link').forEach(function(link) {
            link.addEventListener('click', function() {
                var href = link.getAttribute('href') || '';
                var id = href.charAt(0) === '#' ? href.slice(1) : '';
                var target = id ? document.getElementById(id) : null;
                if (target && target.tagName.toLowerCase() === 'details') {
                    target.open = true;
                }
                wrap.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        renderSwatches();
        setupCopy();
        setupToc();
    });
})();
</script>
