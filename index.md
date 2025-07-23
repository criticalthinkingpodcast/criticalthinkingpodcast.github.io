---
layout: default
title: Critical Thinking Bug Bounty Podcast
---
<style>
::-webkit-scrollbar {
    width: 0px;
}
body {
    background-color: #1e1e1e;
    color: #ffffff;
}
.home-container {
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

.home-header {
    margin-bottom: 30px;
    text-align: center;
}

.home-section {
    margin-bottom: 40px;
    line-height: 1.7;
}

.episode-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.episode-title {
    margin: 20px 0 10px 0;
    font-size: 1.2em;
    color: #ffffff;
}

a {
    color: #58a6ff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

h1, h2 {
    text-align: center;
}

.welcome-text {
    line-height: 1.7;
    margin-bottom: 30px;
}

@media (max-width: 768px) {
    .home-container {
        padding: 15px;
    }
    
    .episode-container {
        padding: 15px;
    }
    
    .episode-title {
        font-size: 1.1em;
        margin: 15px 0 8px 0;
    }
    
    h1, h2 {
        font-size: 1.5em;
    }
}

@media (max-width: 480px) {
    .home-container {
        padding: 10px;
    }
    
    .episode-container {
        padding: 10px;
    }
    
    .episode-title {
        font-size: 1em;
        margin: 12px 0 6px 0;
    }
    
    h1, h2 {
        font-size: 1.3em;
    }
}
    .videoWrapper {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0;
    }
    .videoWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .videoUpNextWrapper {
        margin-top: 40px;
    }
    .videoUpNext {
        display:inline-block;
        width:49%;
        margin:auto;
        padding-bottom: 24% !important;
    }
</style>

<div class="home-container">
    <div class="home-header">
        <h1>Critical Thinking Bug Bounty Podcast</h1>
    </div>
    
    <div class="home-section welcome-text">
        <p><strong><span style="color: #ff5252;">Crit</span>ical <span style="color: #58a6ff;">Thinking</span> is a "by hackers, for hackers" podcast</strong> designed to be both technical and fun to listen to.</p>
    </div>

    <div class="home-section">
        <h2>Latest Episodes</h2>
        <div id="episodeContainer" class="episode-container">
        <!-- Episodes will be loaded here -->
        <div class="videoWrapper">
            <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7">
            </iframe>
        </div>
        <div class="videoUpNextWrapper">
        <div class="videoWrapper videoUpNext">
            <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7&index=2">
            </iframe>
        </div>
        <div class="videoWrapper videoUpNext">
            <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7&index=3">
            </iframe>
        </div>
        </div>
        <div class="videoUpNextWrapper">
        <div class="videoWrapper videoUpNext">
            <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7&index=4">
            </iframe>
        </div>
        <div class="videoWrapper videoUpNext">
            <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7&index=5">
            </iframe>
        </div>
        </div>        
    </div>

<script>
/**
fetch("https://proxy.cors.sh/https://media.rss.com/ctbbpodcast/feed.xml")
.then(a => a.text())
.then((text) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.querySelectorAll("item");
    
    // Get only the first 3 items
    Array.from(items).slice(0, 2).forEach((item) => {
        const title = item.querySelector("title").innerHTML
            .replace("<![CDATA[", "").replace("]]>", "");
        const episodeId = item.querySelector("link").innerHTML
            .replace("<![CDATA[", "").replace("]]>", "")
            .split("/").slice(-1)[0];
            
        const titleDiv = document.createElement("div");
        titleDiv.className = "episode-title";
        titleDiv.textContent = title;
        
        const iframe = document.createElement("iframe");
        iframe.src = `https://player.rss.com/ctbbpodcast/${episodeId}?theme=dark`;
        iframe.style = "width:100%;height:8.75em;border-radius:1em;border:none;margin:0.5em 0em;";
        iframe.title = title;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        document.getElementById("episodeContainer").appendChild(titleDiv);
        document.getElementById("episodeContainer").appendChild(iframe);
    });
});*/
</script>

    <div class="home-section" style="text-align: center; margin: 30px 0;">
        <a href="https://www.youtube.com/playlist?list=PLO-h_HEvT1ysKxfLkI-uk3_vxzxoUHCD7" style="display: inline-block; padding: 12px 25px; background-color: #252525; color: #58a6ff; border: 1px solid #444; border-radius: 4px; text-decoration: none; font-size: 1.1em; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">View All Episodes →</a>
    </div>
</div>

