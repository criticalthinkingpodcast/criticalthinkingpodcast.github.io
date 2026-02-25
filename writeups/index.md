---
layout: default
title: Writeups - Critical Thinking Bug Bounty Podcast
permalink: /writeups/
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
        color: #999;
    }

    .writeups-breadcrumb a {
        color: #58a6ff;
        text-decoration: none;
        transition: color 0.2s;
    }

    .writeups-breadcrumb a:hover {
        color: #fff;
        text-decoration: underline;
    }    
    
    .article-list {
        margin-top: 30px;
    }

    .article-item {
        background-color: #252525;
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 4px;
        border-left: 3px solid #6bff77ff;
        transition: all 0.3s ease;
    }

    .article-item:hover {
        background-color: #2a2a2a;
        transform: translateX(3px);
    }

    .article-title {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 1.2em;
    }
    
    .article-title a {
        color: #6bff77ff;
        text-decoration: none;
    }
    
    .article-title a code {
        background-color: rgba(88, 166, 255, 0.15);
        padding: 2px 6px;
        border-radius: 4px;
        color: #6bff77ff;
        font-size: inherit;
    }
    
    .article-title a:hover {
        text-decoration: underline;
    }

    .article-subtitle {
        font-size: 0.9em;
        color: #ccc;
        margin-bottom: 10px;
        font-style: italic;
    }

    .article-meta {
        font-size: 0.8em;
        color: #999;
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
        background-color: #333;
        border-radius: 12px;
        color: #6bff77ff;
    }

    .new-badge {
        background-color: #ff4757;
        color: white;
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
        background-color: #333;
        color: #6bff77ff;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.9em;
        transition: all 0.2s ease;
    }

    .read-more:hover {
        background-color: #444;
        color: #fff;
    }
    
    .all-articles {
        text-align: center;
        margin-top: 30px;
    }
    
    .all-articles-btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #333;
        color: #6bff77ff;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        border: 1px solid #444;
        transition: all 0.3s ease;
    }
    
    .all-articles-btn:hover {
        background-color: #444;
        color: #fff;
        border-color: #6bff77ff;
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
        <a href="https://www.criticalthinkingpodcast.io/p/critical-research-lab" style="color: #58a6ff; text-decoration: underline; font-weight: 500;">
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