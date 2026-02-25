---
layout: default
title: About Us - Critical Thinking Bug Bounty Podcast
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
.about-container {
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

.about-header {
    margin-bottom: 30px;
    text-align: center;
}

.about-section {
    margin-bottom: 40px;
    line-height: 1.7;
}

.host-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 30px;
}

.host-card {
    width: 48%;
    background-color: #1a1a1a;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.host-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.host-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: block;
    object-fit: cover;
    border: 3px solid #58a6ff;
}

.host-name {
    font-size: 1.3em;
    color: #58a6ff;
    margin-bottom: 10px;
    text-align: center;
}

.host-bio {
    font-size: 0.9em;
    text-align: left;
}

.social-links {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

.social-link {
    margin: 0 5px;
    color: #999;
    transition: color 0.3s ease;
}

.social-link:hover {
    color: #58a6ff;
}

.contact-section {
    background-color: #1a1a1a;
    padding: 30px;
    border-radius: 6px;
    margin-top: 40px;
    text-align: center;
}

.timeline {
    position: relative;
    margin: 40px 0;
    padding-left: 30px;
}

.timeline:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #333;
}

.timeline-item {
    position: relative;
    margin-bottom: 30px;
}

.timeline-item:before {
    content: '';
    position: absolute;
    left: -39px;
    top: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #58a6ff;
    border: 3px solid #1e1e1e;
}

.timeline-date {
    font-size: 0.9em;
    color: #999;
    margin-bottom: 5px;
}

.timeline-content {
    padding: 15px;
    background: #1a1a1a;
    border-radius: 5px;
}

@media (max-width: 768px) {
    .host-card {
        width: 100%;
    }
    
    .about-container {
        padding: 15px;
    }
    
    .timeline {
        padding-left: 25px;
    }
    
    .timeline-item:before {
        left: -34px;
    }
}

@media (max-width: 480px) {
    .about-container {
        padding: 10px;
    }
    
    .host-image {
        width: 100px;
        height: 100px;
    }
    
    .host-name {
        font-size: 1.2em;
    }
    
    .timeline {
        padding-left: 20px;
    }
    
    .timeline-item:before {
        left: -29px;
        width: 12px;
        height: 12px;
    }
}
</style>

<!--
<div class="about-container">
    <div class="about-header">
        <h1>About the Podcast</h1>
    </div>
    
    <div class="about-section">
        <p><strong><span style="color: #ff5252;">Crit</span>ical <span style="color: #58a6ff;">Thinking</span> is a "by hackers, for hackers" podcast</strong> designed to be both technical and fun to listen to. We keep it real, talking about everything from technical exploit breakdowns to hacker mental health issues.</p>
        <p>From new techniques and research to the live hacking event scene, CT will be dropping a pod weekly to keep you up to date and in the loop with the hacker life.</p>
        <p>While the pod is focused primarily on the bug bounty hunting experience, we also cover topics relevant to appsec, pentesting, security research, and secure software development.</p>
        
    </div>
    
<div class="about-section">
    <div class="about-header">
    <h2>Meet the Hosts</h2>
        
        <div class="host-container">
            <div class="host-card">
                <img src="/assets/images/Rhyno.jpg" alt="Justin Gardner" class="host-image">
                <h3 class="host-name">Justin Gardner (@Rhynorater)</h3>
                <div class="host-bio">
                    <p>Justin is a full-time bug bounty hunter and top-ranked live hacking event competitor. He has taken home four Most Valuable Hacker awards and countless other 1st place & 2nd place trophies.</p>
                    <p>While Justin specializes in web hacking, he also dabbles in IoT and mobile hacking. He is also the HackerOne Ambassador for the Eastern US region.</p>
                    <p>Outside of hacking, Justin enjoys Volleyball, Brazilian Jiu Jitsu, and Real Estate investing.</p>
                </div>
                <div class="social-links">
                    <a href="https://x.com/rhynorater" class="social-link" target="_blank" rel="noopener">X</a> |
                    <a href="https://rhynorater.github.io/" class="social-link" target="_blank" rel="noopener">GitHub</a>
                </div>
            </div>
            
            <div class="host-card">
                <img src="/assets/images/Rez0.jpg" alt="Joseph Thacker" class="host-image">
                <h3 class="host-name">Joseph Thacker (@rez0)</h3>
                <div class="host-bio">
                    <p>Joseph is a full-time Bug Bounty Hunter, Startup Advisor, and Solo Founder who specializes in application security and AI. </p>
                    <p>He's attended 12+ live hacking events, submitted over 1,000 vulnerabilities, and has 9 live event awards. He loves building and breaking things, especially AI-integrated applications.</p> 
                </div>
                <div class="social-links">
                    <a href="https://x.com/Rez0__" class="social-link" target="_blank" rel="noopener">X</a> |
                    <a href="https://www.linkedin.com/in/josephthacker/" class="social-link" target="_blank" rel="noopener">LinkedIn</a> |                    
                    <a href="https://josephthacker.com/" class="social-link" target="_blank" rel="noopener">josephthacker.com</a>
                </div>
            </div>
        </div>
    </div>

</div>
-->