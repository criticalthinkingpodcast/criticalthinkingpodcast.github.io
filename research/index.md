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

.research-item {
    margin-bottom: 40px;
    padding-bottom: 25px;
    border-bottom: 1px solid #333;
    position: relative;
    transition: all 0.3s ease;
}

.research-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    padding: 15px;
    margin-left: -15px;
    margin-right: -15px;
    border-radius: 5px;
    background-color: #1a1a1a;
    border-bottom: none;
}

.research-item:last-child {
    border-bottom: none;
}

.research-title {
    font-size: 1.4em;
    margin: 20px 0 10px 0;
    color: #58a6ff;
    font-weight: 600;
}

.research-meta {
    font-size: 0.9em;
    color: #999;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.research-meta::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #58a6ff;
    margin-right: 8px;
    border-radius: 50%;
    opacity: 0.7;
}

.research-summary {
    margin-bottom: 20px;
    line-height: 1.6;
    color: #ffffff;
}

.read-more {
    display: inline-block;
    padding: 8px 16px;
    background-color: #252525;
    color: #58a6ff;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid #333;
}

.read-more:hover {
    background-color: #333333;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    text-decoration: none;
    border-color: #58a6ff;
}

/* Responsiveness for mobile */
@media (max-width: 768px) {
    .research-container {
        padding: 15px;
    }
    
    .research-title {
        font-size: 1.2em;
    }
    
    .research-item:hover {
        padding: 10px;
        margin-left: -10px;
        margin-right: -10px;
    }
    
    /* Featured research responsive */
    div[style*="background-color: rgba(88, 166, 255, 0.1)"] {
        padding: 15px !important;
    }
    
    /* Call to action responsive */
    div[style*="background-color: #252525"] {
        padding: 20px 15px !important;
    }
}

@media (max-width: 480px) {
    .research-container {
        padding: 10px;
    }
    
    .research-title {
        font-size: 1.1em;
    }
    
    .research-meta, .research-summary {
        font-size: 0.85em;
    }
    
    .research-item {
        padding-bottom: 20px;
        margin-bottom: 30px;
    }
    
    .research-item:hover {
        transform: none;
        box-shadow: none;
        padding: 5px;
        margin-left: -5px;
        margin-right: -5px;
    }
    
    .read-more {
        padding: 6px 12px;
        font-size: 0.85em;
    }
    
    /* Featured research responsive */
    div[style*="background-color: rgba(88, 166, 255, 0.1)"] {
        padding: 12px !important;
        margin: 20px 0 !important;
    }
    
    /* Call to action responsive */
    div[style*="background-color: #252525"] {
        padding: 15px 10px !important;
        margin: 30px 0 !important;
    }
    
    div[style*="background-color: #252525"] a {
        padding: 8px 15px !important;
        font-size: 0.9em;
    }
}
</style>

<div class="research-container">
    <h1 style="text-align: center;">Security Research</h1>
    
    <div class="research-summary" style="text-align: left;">
        Welcome to our research section. Here we publish detailed technical writeups, vulnerability disclosures, and security analysis that complement our podcast episodes. Our goal is to provide in-depth technical content that helps security professionals and bug bounty hunters advance their skills.
    </div>
    

        </div>
