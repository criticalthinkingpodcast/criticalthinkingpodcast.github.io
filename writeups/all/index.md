---
layout: default
title: All Writeups - Critical Thinking Bug Bounty Podcast
---
<style>
    ::-webkit-scrollbar {
        width: 0px;
    }
    body {
        background-color: #1e1e1e;
        color: #ffffff;
    }
    .writeups-container {
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

    .writeups-header {
        margin-bottom: 20px;
        text-align: center;
    }

    .writeups-breadcrumb {
        margin-top: 10px;
        font-size: 0.9em;
        color: #999;
    }

    .writeups-breadcrumb a {
        color: #6bff77ff;
        text-decoration: none;
        transition: color 0.2s;
    }

    .writeups-breadcrumb a:hover {
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
        border-color: #6bff77ff;
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
        color: #6bff77ff;
        border: 1px solid #333;
        border-radius: 12px;
        font-size: 0.8em;
        cursor: pointer;
    }

    .filter-tag.active {
        background-color: rgba(255, 107, 107, 0.2);
        border-color: #6bff77ff;
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
        border-left: 3px solid #6bff77ff;
    }

    .article-item:hover {
        background-color: #2a2a2a;
    }

    .article-title {
        margin-top: 0;
        margin-bottom: 8px;
    }

    .article-title a {
        color: #6bff77ff;
        text-decoration: none;
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
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .author-avatar {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #444;
        margin-left: 6px;
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
        color: #6bff77ff;
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
        color: #6bff77ff;
        border: 1px solid #333;
        border-radius: 3px;
        text-decoration: none;
        font-size: 0.8em;
    }

    .pagination .active span {
        background-color: rgba(255, 107, 107, 0.2);
        color: white;
        border-color: #6bff77ff;
    }

    .page-size-controls {
        text-align: center;
        margin: 20px 0;
    }

    .page-size-btn {
        background-color: #252525;
        color: #6bff77ff;
        border: 1px solid #333 !important;
        padding: 3px 10px 2px 10px;
        margin: 0 2px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.85em;
        transition: all 0.2s ease;
        min-width: 40px;
        text-align: center;
        display: inline-block;
        box-sizing: border-box;
    }

    .page-size-btn:hover {
        background-color: #333;
        border: 1px solid #6bff77ff !important;
    }

    .page-size-btn.active {
        background-color: rgba(107, 255, 156, 0.2);
        border: 1px solid #6bff77ff !important;
        color: white;
    }

    .pagination-info {
        text-align: center;
        margin: 0 0 20px 0;
        color: #999;
        font-size: 0.85em;
    }

    .section-navigation {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0;
        gap: 20px;
    }

    .nav-button {
        display: flex;
        align-items: center;
        padding: 0 10px;
        background-color: #252525;
        border: 1px solid #333;
        border-radius: 15px;
        color: #ccc;
        text-decoration: none;
        font-size: 2em;
        transition: all 0.2s ease;
    }

    .nav-button:hover {
        background-color: #333;
        border-color: #6bff77ff;
        color: white;
        text-decoration: none;
    }

    .nav-button .nav-icon {
        font-size: 1.2em;
        margin: 0 8px;
    }

    @media (max-width: 768px) {
        .writeups-container {
            padding: 15px;
        }
        
        .page-size-btn {
            font-size: 0.8em;
            padding: 5px 10px;
            border: 1px solid #333 !important;
            min-width: 35px;
            text-align: center;
            display: inline-block;
            box-sizing: border-box;
        }
    }
</style>

<div class="writeups-container">
    <div class="writeups-header">
        <h1>All Bug Bounty Writeups</h1>
        <nav class="writeups-breadcrumb">
            <a href="/">Home</a> &raquo; <a href="/writeups/">Writeups</a> &raquo; <span>All Writeups</span>
        </nav>
    
<div class="search-container">
<input type="text" id="articleSearch" placeholder="Search writeups..." oninput="searchArticles()">
<button id="searchClear" onclick="clearSearch()">✕</button>
</div>

<div class="filter-container" style="display: none;">
    <span class="filter-label">Filter by:</span>
    <div class="filter-tags" id="filterTags">
        <!-- Tags will be populated dynamically -->
    </div>
</div>

<div id="pageSizeControls">
    <!-- Page size controls will be loaded here -->
</div>

<div id="paginationInfo" class="pagination-info">
    <!-- Pagination info will be loaded here -->
</div>

<div id="articleList">
    <!-- All writeups will be loaded here -->
</div>

<ul class="pagination" id="pagination"></ul>

<div class="section-navigation">
    <a href="/writeups/all/" class="nav-button">
        <span class="nav-icon">←</span>
    </a>
    <a href="/writeups/all/" class="nav-button">
        <span class="nav-icon">→</span>
    </a>
</div>

<script src="/assets/js/writeups-utils.js"></script>
<script src="/assets/js/enhanced-pagination.js"></script>
<script src="/assets/js/writeups-compact.js"></script>
<script src="/assets/js/scroll-to-top.js"></script>
    </div>
</div>