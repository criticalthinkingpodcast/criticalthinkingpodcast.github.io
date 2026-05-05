---
layout: default
title: Research - Critical Thinking Bug Bounty Podcast
permalink: /research/
redirect_to: /
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

    .article-list {
        margin-top: 30px;
    }

    .article-item {
        background-color: var(--surface0);
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 4px;
        border-left: 3px solid var(--blue);
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
        color: var(--blue);
        text-decoration: none;
    }

    .article-title a code {
        background-color: var(--blue-tint);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--blue);
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
        color: var(--blue);
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
        color: var(--blue);
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
        color: var(--blue);
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        border: 1px solid var(--border-strong);
        transition: all 0.3s ease;
    }

    .all-articles-btn:hover {
        background-color: var(--border-strong);
        color: var(--text);
        border-color: var(--blue);
    }
</style>

<div class="research-container">
    <div class="research-header">
        <h1>Security Research</h1>
        <nav class="research-breadcrumb"></nav>
    </div>
    
    <div class="research-section">
        <p></p>
    </div>
    
    <div class="research-section">
        <h2>Featured Articles</h2>
        <div class="article-list" id="featuredArticles">
            <!-- Featured articles will be loaded here by the script -->
        </div>
    </div>
    
    <div class="all-articles">
        <a href="/research/all" class="all-articles-btn">View All Research Articles</a>
    </div>    <script src="/assets/js/research-simple.js"></script>
    <script src="/assets/js/scroll-to-top.js"></script>
</div>