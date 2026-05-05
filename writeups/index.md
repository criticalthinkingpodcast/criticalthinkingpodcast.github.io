---
layout: default
title: Writeups - Critical Thinking Bug Bounty Podcast
permalink: /writeups/
---
<style>
    .writeups-container {
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

    .writeups-header {
        margin-bottom: 30px;
        text-align: center;
    }

    .writeups-section {
        margin-bottom: 40px;
        line-height: 1.7;
    }

    .writeups-breadcrumb {
        margin-top: 10px;
        font-size: 0.9em;
        color: var(--overlay2);
    }

    .writeups-breadcrumb a {
        color: var(--blue);
        text-decoration: none;
        transition: color 0.2s;
    }

    .writeups-breadcrumb a:hover {
        color: var(--text);
        text-decoration: underline;
    }

    .article-list {
        margin-top: 30px;
    }

    .article-item {
        background-color: var(--surface0);
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 4px;
        border-left: 3px solid var(--green);
        transition: all 0.3s ease;
    }

    .article-item:hover {
        background-color: var(--surface1);
        transform: translateX(3px);
    }

    .article-title {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 1.2em;
    }

    .article-title a {
        color: var(--green);
        text-decoration: none;
    }

    .article-title a code {
        background-color: var(--green-tint);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--green);
        font-size: inherit;
    }

    .article-title a:hover {
        text-decoration: underline;
    }

    .article-subtitle {
        font-size: 0.9em;
        color: var(--subtext0);
        margin-bottom: 10px;
        font-style: italic;
    }

    .article-meta {
        font-size: 0.8em;
        color: var(--overlay2);
        margin-bottom: 8px;
    }

    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 15px;
    }

    .article-tag {
        display: inline-block;
        font-size: 0.75em;
        padding: 3px 8px;
        background-color: var(--surface2);
        border-radius: 12px;
        color: var(--green);
    }

    .new-badge {
        background-color: var(--red);
        color: var(--text);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.7em;
        margin-left: 10px;
    }

    .article-summary {
        margin-bottom: 15px;
    }

    .read-more {
        display: inline-block;
        padding: 6px 14px;
        background-color: var(--surface2);
        color: var(--green);
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.9em;
        transition: all 0.2s ease;
    }

    .read-more:hover {
        background-color: var(--border-strong);
        color: var(--text);
    }

    .all-articles {
        text-align: center;
        margin-top: 30px;
    }

    .all-articles-btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--surface2);
        color: var(--green);
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        border: 1px solid var(--border-strong);
        transition: all 0.3s ease;
    }

    .all-articles-btn:hover {
        background-color: var(--border-strong);
        color: var(--text);
        border-color: var(--green);
    }
</style>

<div class="writeups-container">
    <div class="writeups-header">
        <h1>Bug Bounty Writeups</h1>
        <nav class="writeups-breadcrumb"></nav>
    </div>
    
<div class="writeups-section" style="text-align: center;">
        <p>Welcome to our writeups section. Here we share detailed bug bounty writeups, vulnerability discoveries, and practical exploitation techniques. <br> Each writeup provides step-by-step analysis to help you understand real-world security testing scenarios and improve your bug hunting skills.</p>
</div>
    <div style="text-align: center; margin-bottom: 30px;">
        <a href="/submit/" class="t-blue" style="text-decoration: underline; font-weight: 500;">
        - More info on how to submit your writeup -
        </a>
    </div>
    
<div class="writeups-section">
        <h2>Featured Writeups</h2>
        <div class="article-list" id="featuredWriteups">
            <!-- Featured writeups will be loaded here by the script -->
        </div>
</div>
    
<div class="all-articles">
        <a href="/writeups/all" class="all-articles-btn">View All Writeups</a>
</div>
    
<script src="/assets/js/writeups-utils.js"></script>
<script src="/assets/js/writeups-simple.js"></script>
<script src="/assets/js/scroll-to-top.js"></script>
</div>