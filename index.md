---
layout: default
title: Research - Critical Thinking Bug Bounty Podcast
---
<style>
    ::-webkit-scrollbar {
        width: 0px;
    }
    body {
        background-color: #1e1e1e;
        color: #ffffff;
    }
    .research-container {
        max-width: 800px;
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
    .article-list { margin-top: 30px; }
    .article-item { background-color: #252525; margin-bottom: 15px; padding: 15px; border-radius: 4px; border-left: 3px solid #58a6ff; transition: all 0.3s ease; }
    .article-item:hover { background-color: #2a2a2a; transform: translateX(3px); }
    .article-title { margin-top: 0; margin-bottom: 8px; font-size: 1.2em; }
    .article-title a { color: #58a6ff; text-decoration: none; }
    .article-title a:hover { text-decoration: underline; }
    .article-subtitle { font-size: 0.9em; color: #ccc; margin-bottom: 10px; font-style: italic; }
    .article-meta { font-size: 0.8em; color: #999; margin-bottom: 8px; }
    .article-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px; }
    .article-tag { display: inline-block; font-size: 0.75em; padding: 3px 8px; background-color: #333; border-radius: 12px; color: #58a6ff; }
    .new-badge { background-color: #ff4757; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.7em; margin-left: 10px; }
    .article-summary { margin-bottom: 15px; }
    .read-more { display: inline-block; padding: 6px 14px; background-color: #333; color: #58a6ff; border-radius: 4px; text-decoration: none; font-size: 0.9em; transition: all 0.2s ease; }
    .read-more:hover { background-color: #444; color: #fff; }
    .all-articles { text-align: center; margin-top: 30px; }
    .all-articles-btn { display: inline-block; padding: 10px 20px; background-color: #333; color: #58a6ff; border-radius: 4px; text-decoration: none; font-weight: 500; border: 1px solid #444; transition: all 0.3s ease; }
    .all-articles-btn:hover { background-color: #444; color: #fff; border-color: #58a6ff; }
</style>
    
<div class="research-section">
    <p>Welcome to our research section. Here we publish detailed technical writeups, vulnerability disclosures, and security analysis that complement our podcast episodes. Our goal is to provide in-depth technical content that helps security professionals and bug bounty hunters advance their skills.</p>
</div>

<div class="research-section">
    <h2>Featured Articles</h2>
    <div class="article-list" id="featuredArticles">
        <!-- Featured articles will be loaded here by the script -->
    </div>
</div>

<div class="all-articles">
    <a href="/research/all" class="all-articles-btn">View All Research Articles</a>
</div>
<script src="/assets/js/research-simple.js"></script>
<script src="/assets/js/scroll-to-top.js"></script>
</div>

