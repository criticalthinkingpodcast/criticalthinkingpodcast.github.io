/**
 * Simplified Writeups Display
 * 
 * This script loads and displays only featured writeups (3-4 most recent)
 * with a clean, simple layout for better readability and user engagement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Number of featured writeups to display
    const featuredCount = 3;
    
    // Load the writeups from JSON
    fetch('/writeups/writeups.json')
        .then(response => response.json())
        .then(writeups => {
            // Sort writeups by date (newest first)
            writeups.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Get only the featured number of writeups
            const featuredWriteups = writeups.slice(0, featuredCount);
            
            // Get the container
            const writeupsContainer = document.getElementById('featuredWriteups');
            
            // Generate HTML for each writeup
            let writeupsHTML = '';
            featuredWriteups.forEach(writeup => {
                // Check if the writeup is new
                const isNew = isNewWriteup(writeup.date);
                const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';
                
                // Generate tags HTML if writeup has tags
                let tagsHTML = '';
                if (writeup.tags && writeup.tags.length > 0) {
                    tagsHTML = '<div class="article-tags">';
                    writeup.tags.forEach(tag => {
                        tagsHTML += `<span class="article-tag">${tag}</span>`;
                    });
                    tagsHTML += '</div>';
                }
                
                // Extract first paragraph of summary or limit to 150 chars
                let summary = writeup.summary;
                if (summary && summary.length > 150) {
                    summary = summary.substring(0, 147) + '...';
                }
                
                // Create writeup HTML with enhanced simplified layout
                writeupsHTML += `
                    <div class="article-item">
                        ${writeup.image ? `<img src="${writeup.image}" alt="${writeup.title}" style="max-width:100%;border-radius:8px;margin-bottom:10px;">` : ''}
                        <h3 class="article-title">
                            <a href="${writeup.url}">${writeup.title}</a>
                            ${newBadge}
                        </h3>
                        ${writeup.description ? `<div class="article-subtitle">${writeup.description}</div>` : ''}
                        <div class="article-meta">
                            <span class="article-date">${formatDate(writeup.date)}</span>${writeup.author ? ' • <span class="article-author">' + writeup.author + '</span>' : ''}
                        </div>
                        ${tagsHTML}
                        <div class="article-summary">
                            <p>${summary}</p>
                        </div>
                        <a href="${writeup.url}" class="read-more">Read More</a>
                    </div>
                `;
            });
            
            // Update the container with writeups
            writeupsContainer.innerHTML = writeupsHTML;
            
            // If no writeups found
            if (featuredWriteups.length === 0) {
                writeupsContainer.innerHTML = '<p>No writeups available at this time. Check back soon!</p>';
            }
        })
        .catch(error => {
            console.error('Error loading writeups:', error);
            document.getElementById('featuredWriteups').innerHTML = 
                '<p>Failed to load writeups. Please try again later.</p>';
        });
});