/**
 * Utilities for the research section
 * These functions help manage research article display and extraction
 */

// Global settings for the research system
const researchSettings = {
    articlesPerPage: 4,
    featuredArticles: 4,
    defaultImage: '/assets/images/CTLogo.png',
    newArticleDays: 14
};

// Format a date string nicely
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Check if an article is new based on its published date
function isNewArticle(dateString) {
    if (!dateString) return false;
    
    const articleDate = new Date(dateString);
    const today = new Date();
    const timeDiff = today.getTime() - articleDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    return daysDiff <= researchSettings.newArticleDays;
}

// Extract H1 title from Markdown content
function extractH1FromMarkdown(content) {
    if (!content) return null;
    
    // Try to find a line starting with a single # and followed by text
    const h1Match = content.match(/^#\s+(.+)$/m);
    
    if (h1Match && h1Match[1]) {
        return h1Match[1].trim();
    }
    
    return null;
}

// Format the extracted title for display
function formatTitle(title) {
    if (!title) return '';
    
    // Remove any Markdown formatting that might be in the title
    return title
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1')     // Italic
        .replace(/`(.*?)`/g, '$1')       // Code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Convert Obsidian-style callouts to styled HTML divs
 * Supports: [!info], [!success], [!failure], [!danger], [!warning], [!question], [!note]
 */
function convertObsidianCallouts() {
    // Find all blockquotes in the document
    const blockquotes = document.querySelectorAll('blockquote');
    
    blockquotes.forEach(function(blockquote) {
        // Get all child nodes of the blockquote
        const children = Array.from(blockquote.childNodes);
        let headerNode = null;
        let headerMatch = null;
        const headerRegex = /^\[!(info|success|failure|danger|warning|question|note)\]\s*(.*)$/i;
        // Find the header node
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeType === Node.TEXT_NODE || children[i].nodeType === Node.ELEMENT_NODE) {
                const text = children[i].textContent.trim();
                if (headerRegex.test(text)) {
                    headerNode = children[i];
                    headerMatch = text.match(headerRegex);
                    break;
                }
            }
        }
        if (headerNode && headerMatch) {
            const type = headerMatch[1].toLowerCase();
            const title = headerMatch[2].trim();
            // Collect all nodes after the header as content
            const contentNodes = [];
            let foundHeader = false;
            children.forEach(node => {
                if (node === headerNode) {
                    foundHeader = true;
                    return;
                }
                if (foundHeader) {
                    contentNodes.push(node.cloneNode(true));
                }
            });
            // If no content after header, use all except header
            if (contentNodes.length === 0) {
                children.forEach(node => {
                    if (node !== headerNode) {
                        contentNodes.push(node.cloneNode(true));
                    }
                });
            }
            // Create the callout div
            const calloutDiv = document.createElement('div');
            calloutDiv.className = `callout callout-${type}`;
            calloutDiv.innerHTML = `
                <div class="callout-title">${title}</div>
                <div class="callout-content"></div>
            `;
            const contentDiv = calloutDiv.querySelector('.callout-content');
            contentNodes.forEach(node => {
                contentDiv.appendChild(node);
            });
            // Replace the blockquote with the callout
            blockquote.parentNode.replaceChild(calloutDiv, blockquote);
        }
    });
}

// Auto-convert callouts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertObsidianCallouts);
} else {
    // DOM is already loaded
    convertObsidianCallouts();
}
