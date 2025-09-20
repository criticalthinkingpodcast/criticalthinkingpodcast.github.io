---
layout: default
title: All Research Articles - Critical Thinking Bug Bounty Podcast
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
        margin-bottom: 20px;
        text-align: center;
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

    .search-container {
        display: flex;
        justify-content: center;
        margin: 20px auto;
        position: relative;
        max-width: 500px;
    }

    #articleSearch {
        width: 100%;
        padding: 8px 35px 8px 12px;
        border-radius: 4px;
        border: 1px solid #333;
        background-color: #252525;
        color: white;
        font-size: 0.85em;
    }

    #articleSearch:focus {
        outline: none;
        border-color: #58a6ff;
    }

    #searchClear {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 0.8em;
    }

    .filter-container {
        margin-bottom: 20px;
    }

    .filter-label {
        display: block;
        margin-bottom: 8px;
        color: #999;
        font-size: 0.85em;
    }

    .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .filter-tag {
        display: inline-block;
        padding: 4px 10px;
        background-color: #252525;
        color: #58a6ff;
        border: 1px solid #333;
        border-radius: 12px;
        font-size: 0.8em;
        cursor: pointer;
    }

    .filter-tag.active {
        background-color: rgba(88, 166, 255, 0.2);
        border-color: #58a6ff;
    }

    .article-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .article-item {
        background-color: #252525;
        padding: 15px;
        border-radius: 5px;
        border-left: 3px solid #58a6ff;
    }

    .article-item:hover {
        background-color: #2a2a2a;
    }

    .article-title {
        margin-top: 0;
        margin-bottom: 8px;
    }

    .article-title a {
        color: #58a6ff;
        text-decoration: none;
    }    .article-title a:hover {
        text-decoration: underline;
    }

    .article-subtitle {
        font-size: 0.9em;
        color: #ccc;
        margin-bottom: 10px;
        font-style: italic;
    }
    
    .article-excerpt {
        margin: 8px 0;
        font-size: 0.85em;
        color: #bbb;
        line-height: 1.4;
    }

    .article-meta {
        font-size: 0.8em;
        color: #999;
    }
    
    .article-author {
        color: #aaa;
    }

    .article-date {
        color: #888;
    }

    .article-tags {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .article-tag {
        display: inline-block;
        font-size: 0.75em;
        padding: 2px 8px;
        background-color: #333;
        border-radius: 12px;
        color: #58a6ff;
        cursor: pointer;
    }

    .article-tag:hover {
        background-color: #444;
    }

    .new-badge {
        background-color: #ff4757;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7em;
        margin-left: 8px;
        vertical-align: middle;
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin: 30px 0 20px;
        padding: 0;
        list-style: none;
        gap: 5px;
    }

    .pagination a, .pagination span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background-color: #252525;
        color: #58a6ff;
        border: 1px solid #333;
        border-radius: 3px;
        text-decoration: none;
        font-size: 0.8em;
    }

    .pagination .active span {
        background-color: rgba(88, 166, 255, 0.2);
        color: white;
        border-color: #58a6ff;
    }

    @media (max-width: 768px) {
        .research-container {
            padding: 15px;
        }
    }
</style>

<div class="research-container">
    <div class="research-header">
        <h1>All Security Research</h1>
        <nav class="research-breadcrumb">
            <a href="/">Home</a> &raquo; <a href="/research/">Research</a> &raquo; <span>All Articles</span>
        </nav>
    
        <div class="search-container">
        <input type="text" id="articleSearch" placeholder="Search articles..." oninput="searchArticles()">
        <button id="searchClear" onclick="clearSearch()">✕</button>
     </div>
    
    <div class="filter-container" style="display: none;">
        <span class="filter-label">Filter by:</span>
        <div class="filter-tags" id="filterTags">
            <!-- Tags will be populated dynamically -->
        </div>
    </div>
    
    <div id="articleList">
        <!-- All articles will be loaded here -->
    </div>
    
    
    <ul class="pagination" id="pagination"></ul>

<script src="/assets/js/enhanced-pagination.js"></script>
<script src="/assets/js/research-compact.js"></script>
<script src="/assets/js/scroll-to-top.js"></script>
    </div>
</div>
