/**
 * Simplified Research Articles Display
 * 
 * This script loads and displays only featured research articles (3-4 most recent)
 * with a clean, simple layout for better readability and user engagement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Number of featured articles to display
    const featuredCount = 3;

    // Function to format dates nicely
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Function to check if an article is new (published within the last 14 days)
    function isNewArticle(dateString) {
        if (!dateString) return false;
        
        const articleDate = new Date(dateString);
        const today = new Date();
        const timeDiff = today.getTime() - articleDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        return daysDiff <= 14; // Consider articles newer than 14 days as "new"
    }
    
    // Load the articles from JSON
    fetch('/research/articles.json')
        .then(response => response.json())
        .then(articles => {
            // Sort articles by date (newest first)
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Get only the featured number of articles
            const featuredArticles = articles.slice(0, featuredCount);
            
            // Get the container
            const articlesContainer = document.getElementById('featuredArticles');
            
            // Generate HTML for each article
            let articlesHTML = '';
            featuredArticles.forEach(article => {
                // Check if the article is new
                const isNew = isNewArticle(article.date);
                const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';
                
                // Generate tags HTML if article has tags
                let tagsHTML = '';
                if (article.tags && article.tags.length > 0) {
                    tagsHTML = '<div class="article-tags">';
                    article.tags.forEach(tag => {
                        tagsHTML += `<span class="article-tag">${tag}</span>`;
                    });
                    tagsHTML += '</div>';
                }
                
                // Extract first paragraph of summary or limit to 150 chars
                let summary = article.summary;
                if (summary && summary.length > 150) {
                    summary = summary.substring(0, 147) + '...';                }
                  // Create article HTML with enhanced simplified layout
                articlesHTML += `
                    <div class="article-item">
                        ${article.image ? `<img src="${article.image}" alt="${article.title}" style="max-width:100%;border-radius:8px;margin-bottom:10px;">` : ''}
                        <h3 class="article-title">
                            <a href="${article.url}">${article.title}</a>
                            ${newBadge}
                        </h3>
                        ${article.description ? `<div class="article-subtitle">${article.description}</div>` : ''}
                        <div class="article-meta">
                            <span class="article-date">${formatDate(article.date)}</span>${article.author ? ' • <span class="article-author">' + article.author + '</span>' : ''}
                        </div>
                        ${tagsHTML}
                        <div class="article-summary">
                            <p>${summary}</p>
                        </div>
                        <a href="${article.url}" class="read-more">Read More</a>
                    </div>
                `;
            });
            
            // Update the container with articles
            articlesContainer.innerHTML = articlesHTML;
            
            // If no articles found
            if (featuredArticles.length === 0) {
                articlesContainer.innerHTML = '<p>No articles available at this time. Check back soon!</p>';
            }
        })
        .catch(error => {
            console.error('Error loading articles:', error);
            document.getElementById('featuredArticles').innerHTML = 
                '<p>Failed to load articles. Please try again later.</p>';
        });
});
