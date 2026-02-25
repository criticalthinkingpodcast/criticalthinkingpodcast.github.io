---
layout: default
title: Research - Critical Thinking Bug Bounty Podcast
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
        color: #999;
    }

    .research-breadcrumb a {
        color: #58a6ff;
        text-decoration: none;
        transition: color 0.2s;
    }

    .research-breadcrumb a:hover {
        color: #fff;
        text-decoration: underline;
    }
    .content-section {
        margin-top: 30px;
    }
    
    .section-title {
        margin-bottom: 30px;
        font-size: 2em;
        color: #fff;
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
        background-color: rgba(119, 119, 119, 0.13);
        color: #58a6ff;
        border: 1px solid #58a6ff;
    }
    
    .content-type-badge.writeup {
        background-color: rgba(119, 119, 119, 0.13);
        color: #6bff77ff;
        border: 1px solid #6bff77ff;
    }
    
    .nav-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 30px;
        flex-wrap: wrap;
    }
    
    .article-list { margin-top: 30px; }
    .article-item { background-color: #2a2a2a; margin-bottom: 15px; padding: 15px; border-radius: 4px; border-left: 3px solid #58a6ff; transition: all 0.3s ease; }
    .article-item.writeup { border-left-color: #6bff77ff; }
    .article-item:hover { background-color: #333; transform: translateX(3px); }
    .article-title { margin-top: 0; margin-bottom: 8px; font-size: 1.2em; }
    .article-title a { color: #58a6ff; text-decoration: none; }
    .article-title a code { background-color: rgba(88, 166, 255, 0.15); padding: 2px 6px; border-radius: 4px; color: #58a6ff; font-size: inherit; }
    .article-title.writeup a { color: #6bff77ff; }
    .article-title.writeup a code { color: #6bff77ff; background-color: rgba(107, 255, 119, 0.15); }
    .article-title a:hover { text-decoration: underline; }
    .article-subtitle { font-size: 0.9em; color: #ccc; margin-bottom: 8px; font-style: italic; }
    .article-meta { font-size: 0.8em; color: #999; margin-bottom: 8px; }
    .article-author { display: inline-flex; align-items: center; gap: 6px; }
    .author-avatar { width: 25px; height: 25px; border-radius: 50%; object-fit: cover; border: 1px solid #444; margin-left: 6px; }
    .article-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
    .article-tag { display: inline-block; font-size: 0.75em; padding: 3px 8px; background-color: #333; border-radius: 10px; color: #58a6ff; }
    .article-tag.writeup { color: #6bff77ff; }
    .new-badge { background-color: #ff4757; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.7em; margin-left: 8px; }
    .article-summary { margin-bottom: 10px; font-size: 0.85em; color: #ccc; }
    .read-more { display: inline-block; padding: 6px 14px; background-color: #333; color: #58a6ff; border-radius: 3px; text-decoration: none; font-size: 0.9em; transition: all 0.2s ease; }
    .read-more.writeup { color: #6bff77ff; }
    .read-more:hover { background-color: #444; color: #fff; }
    .all-articles { text-align: center; margin-top: 20px; }
    .all-articles-btn { display: inline-block; padding: 8px 16px; background-color: #333; color: #58a6ff; border-radius: 4px; text-decoration: none; font-weight: 500; border: 1px solid #444; transition: all 0.3s ease; font-size: 0.9em; }
    .all-articles-btn.writeup { color: #6bff77ff; border-color: #444; }
    .all-articles-btn:hover { background-color: #444; color: #fff; }
    .all-articles-btn.writeup:hover { border-color: #6bff77ff; }
</style>

<div class="research-container">
    <div class="research-header">
        <h1>Critical Thinking Security Content</h1>
    </div>
    <div class="research-section" style="text-align: center;">
    </div>
    <div style="text-align: center; margin-bottom: 30px;">
        <a href="https://www.criticalthinkingpodcast.io/p/critical-research-lab" style="color: #58a6ff; text-decoration: underline; font-weight: 500;">
- More info on how to submit your content -
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

