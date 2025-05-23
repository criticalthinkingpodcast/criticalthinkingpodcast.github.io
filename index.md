---
layout: default
---
<style>
::-webkit-scrollbar {
    width: 0px;
}
body {
    background-color: #1e1e1e;
    color: #ffffff;
    text-align: center;
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
    max-width: 600px;
    margin: 0 auto 40px auto;
}
</style>


<div class="welcome-text">
Welcome to our podcast where we explore the world of bug bounty hunting and web security.
</div>

## Latest Episodes

<div id="episodeContainer" class="episode-container">
<!-- Episodes will be loaded here -->
</div>

<script>
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
});
</script>

## [View All Episodes →](https://rss.com/podcasts/ctbbpodcast/)
