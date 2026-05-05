---
layout: default
title: Research - Critical Thinking Bug Bounty Podcast
---
<style>
    .research-container {
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

    .research-header {
        margin-bottom: 30px;
        text-align: center;
    }

    .research-header h1 {
        display: inline-block;
        position: relative;
        padding-bottom: 4px;
        margin-bottom: 0;
    }

    .research-header h1::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 80%;
        height: 1px;
        background: var(--blue);
        border-radius: 2px;
        box-shadow: 0 0 6px var(--blue), 0 0 12px var(--blue-glow), 0 0 22px var(--blue-tint);
    }

    .research-section {
        margin-bottom: 40px;
        line-height: 1.7;
    }

    .research-breadcrumb {
        margin-top: 10px;
        font-size: 0.9em;
        color: var(--overlay2);
    }

    .research-breadcrumb a {
        color: var(--blue);
        text-decoration: none;
        transition: color 0.2s;
    }

    .research-breadcrumb a:hover {
        color: var(--text);
        text-decoration: underline;
    }
    .content-section {
        margin-top: 30px;
    }

    .section-title {
        margin-bottom: 30px;
        font-size: 2em;
        color: var(--text);
        text-align: center;
    }

    .content-type-badge {
        display: inline-block;
        font-size: 0.7em;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
        margin-left: 10px;
        vertical-align: middle;
    }

    .content-type-badge.research {
        background-color: var(--blue-tint);
        color: var(--blue);
        border: 1px solid var(--blue);
    }

    .content-type-badge.writeup {
        background-color: var(--green-tint);
        color: var(--green);
        border: 1px solid var(--green);
    }

    .nav-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 30px;
        flex-wrap: wrap;
    }

    .article-list { margin-top: 30px; }
    .article-item { background-color: var(--surface1); margin-bottom: 15px; padding: 15px; border-radius: 4px; border-left: 3px solid var(--blue); transition: all 0.3s ease; }
    .article-item.writeup { border-left-color: var(--green); }
    .article-item:hover { background-color: var(--surface2); transform: translateX(3px); }
    .article-title { margin-top: 0; margin-bottom: 8px; font-size: 1.2em; }
    .article-title a { color: var(--blue); text-decoration: none; }
    .article-title a code { background-color: var(--blue-tint); padding: 2px 6px; border-radius: 4px; color: var(--blue); font-size: inherit; }
    .article-title.writeup a { color: var(--green); }
    .article-title.writeup a code { color: var(--green); background-color: var(--green-tint); }
    .article-title a:hover { text-decoration: underline; }
    .article-subtitle { font-size: 0.9em; color: var(--subtext0); margin-bottom: 8px; font-style: italic; }
    .article-meta { font-size: 0.8em; color: var(--overlay2); margin-bottom: 8px; }
    .article-author { display: inline-flex; align-items: center; gap: 6px; }
    .author-avatar { width: 25px; height: 25px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-strong); margin-left: 6px; }
    .article-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
    .article-tag { display: inline-block; font-size: 0.75em; padding: 3px 8px; background-color: var(--surface2); border-radius: 10px; color: var(--blue); }
    .article-tag.writeup { color: var(--green); }
    .new-badge { background-color: var(--red); color: var(--text); padding: 3px 8px; border-radius: 3px; font-size: 0.7em; margin-left: 8px; }
    .article-summary { margin-bottom: 10px; font-size: 0.85em; color: var(--subtext0); }
    .read-more { display: inline-block; padding: 6px 14px; background-color: var(--surface2); color: var(--blue); border-radius: 3px; text-decoration: none; font-size: 0.9em; transition: all 0.2s ease; }
    .read-more.writeup { color: var(--green); }
    .read-more:hover { background-color: var(--border-strong); color: var(--text); }
    .all-articles { text-align: center; margin-top: 20px; }
    .all-articles-btn { display: inline-block; padding: 8px 16px; background-color: var(--surface2); color: var(--blue); border-radius: 4px; text-decoration: none; font-weight: 500; border: 1px solid var(--border-strong); transition: all 0.3s ease; font-size: 0.9em; }
    .all-articles-btn.writeup { color: var(--green); border-color: var(--border-strong); }
    .all-articles-btn:hover { background-color: var(--border-strong); color: var(--text); }
    .all-articles-btn.writeup:hover { border-color: var(--green); }

    .submit-chip {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 9px 18px;
        background-color: var(--mantle);
        border: 1px solid var(--border-default);
        border-radius: 999px;
        color: var(--blue);
        text-decoration: none;
        font-size: 0.9em;
        font-weight: 500;
        transition: all 0.25s ease;
    }

    .submit-chip:hover {
        border-color: var(--blue);
        background-color: var(--blue-bg-hover);
        color: var(--text);
        transform: translateY(-1px);
    }

    .submit-chip-arrow {
        transition: transform 0.25s ease;
    }

    .submit-chip:hover .submit-chip-arrow {
        transform: translateX(3px);
    }
</style>

<div class="research-container">
    <div class="research-header">
        <h1>Critical Research Lab</h1>
    </div>
    <div class="research-section" style="text-align: center;">
    </div>
    <div style="text-align: center; margin-bottom: 40px;">
        <a href="/submit/" class="submit-chip">
            <span>Publish your research or write-up with us</span>
            <span class="submit-chip-arrow">→</span>
        </a>
    </div>

<div class="content-section">
    <h2 class="section-title">Latest Content</h2>
    <div class="article-list" id="combinedContent">
        <!-- Combined content will be loaded here in chronological order -->
    </div>

<div class="nav-buttons">
    <a href="/research/all" class="all-articles-btn">🔬 View All Research</a>
    <a href="/writeups/all" class="all-articles-btn writeup">📝 View All Writeups</a>
</div>
</div>

<script src="/assets/js/research-utils.js"></script>
<script src="/assets/js/writeups-utils.js"></script>
<script src="/assets/js/homepage-combined.js"></script>
<script src="/assets/js/scroll-to-top.js"></script>
</div>

