/**
 * Combined Homepage Script (Single Column Chronological)
 * 
 * This script loads both research articles and writeups for the homepage,
 * displaying them in a single column ordered by publication date
 */

document.addEventListener('DOMContentLoaded', function() {
    // Number of featured items to display total
    const totalFeaturedCount = 3;
    
    // Function to create HTML for any content item
    function createContentHTML(item, type) {
        // Check if the item is new based on type
        const isNew = type === 'research' ? isNewArticle(item.date) : isNewWriteup(item.date);
        const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';
        
        // Content type badge
        const typeBadge = `<span class="content-type-badge ${type}">${type === 'research' ? 'RESEARCH' : 'WRITEUP'}</span>`;
        
        // Generate tags HTML if item has tags
        let tagsHTML = '';
        if (item.tags && item.tags.length > 0) {
            tagsHTML = '<div class="article-tags">';
            item.tags.slice(0, 3).forEach(tag => { // Limit to 3 tags for homepage
                tagsHTML += `<span class="article-tag ${type}">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        // Extract first paragraph of summary or limit to 120 chars for single column
        let summary = item.summary;
        if (summary && summary.length > 120) {
            summary = summary.substring(0, 117) + '...';
        }
        
        // Create item HTML with type-specific styling
        return `
            <div class="article-item ${type}">
                <h3 class="article-title ${type}">
                    <a href="${item.url}">${item.title}</a>
                    ${typeBadge}
                    ${newBadge}
                </h3>
                ${item.description ? `<div class="article-subtitle">${item.description}</div>` : ''}
                <div class="article-meta">
                    <span class="article-date">${formatDate(item.date)}</span>${item.author ? ` • <span class="article-author"><span>${item.author}</span>${item.profile_picture ? `<img src="${item.profile_picture}" alt="${item.author}" class="author-avatar">` : ''}</span>` : ''}
                </div>
                ${tagsHTML}
                <div class="article-summary">
                    <p>${summary}</p>
                </div>
                <a href="${item.url}" class="read-more ${type}">Read More</a>
            </div>
        `;
    }
    
    // Load and combine both content types
    async function loadCombinedContent() {
        const combinedContainer = document.getElementById('combinedContent');
        
        try {
            // Load both data sources in parallel
            const [researchResponse, writeupsResponse] = await Promise.all([
                fetch('/research/articles.json'),
                fetch('/writeups/writeups.json')
            ]);
            
            let allContent = [];
            
            // Process research articles
            if (researchResponse.ok) {
                const researchArticles = await researchResponse.json();
                const researchItems = researchArticles.map(article => ({
                    ...article,
                    type: 'research',
                    dateObj: new Date(article.date)
                }));
                allContent = allContent.concat(researchItems);
            }
            
            // Process writeups
            if (writeupsResponse.ok) {
                const writeups = await writeupsResponse.json();
                const writeupItems = writeups.map(writeup => ({
                    ...writeup,
                    type: 'writeup',
                    dateObj: new Date(writeup.date)
                }));
                allContent = allContent.concat(writeupItems);
            }
            
            // Sort all content by date (newest first)
            allContent.sort((a, b) => b.dateObj - a.dateObj);
            
            // Get the featured items
            const featuredContent = allContent.slice(0, totalFeaturedCount);
            
            // Generate HTML for all items
            let combinedHTML = '';
            featuredContent.forEach(item => {
                combinedHTML += createContentHTML(item, item.type);
            });
            
            // Update the container
            combinedContainer.innerHTML = combinedHTML;
            
            // If no content found
            if (featuredContent.length === 0) {
                combinedContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <h3>No content available at this time</h3>
                        <p>Check back soon for new research articles and writeups!</p>
                        <div style="margin-top: 20px;">
                            <a href="/research/" style="color: #58a6ff; margin-right: 20px;">Browse Research</a>
                            <a href="/writeups/" style="color: #6bff77ff;">Browse Writeups</a>
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            combinedContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6bff77ff;">
                    <h3>Failed to load content</h3>
                    <p>Please try refreshing the page or visit our content sections directly.</p>
                    <div style="margin-top: 20px;">
                        <a href="/research/" style="color: #58a6ff; margin-right: 20px;">Visit Research</a>
                        <a href="/writeups/" style="color: #6bff77ff;">Visit Writeups</a>
                    </div>
                </div>
            `;
        }
    }
    
    // Load the combined content
    loadCombinedContent();
});