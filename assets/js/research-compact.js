/**
 * Compact Articles List Script
 * For displaying all research articles in a more compact layout
 */

document.addEventListener('DOMContentLoaded', function() {
    const articlesPerPage = 10; // More articles per page in compact view
    let allArticles = [];
    let currentPage = 1;
    
    // Format date nicely
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Check if article is new (within last 14 days)
    function isNewArticle(dateString) {
        if (!dateString) return false;
        
        const articleDate = new Date(dateString);
        const today = new Date();
        const timeDiff = today.getTime() - articleDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        return daysDiff <= 14;
    }
    
    // Create compact article item HTML with enhanced appearance
    function createArticleHTML(article) {
        // Check if the article is new
        const isNew = isNewArticle(article.date);
        const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';
        
        // Generate tags HTML if article has tags
        let tagsHTML = '';
        if (article.tags && article.tags.length > 0) {
            tagsHTML = '<div class="article-tags">';
            article.tags.forEach(tag => {
                tagsHTML += `<span class="article-tag" data-tag="${tag}">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        // Get a short excerpt for the compact view
        let excerpt = '';
        if (article.summary && article.summary.length > 0) {
            const maxLength = 100; // Shorter excerpt for compact view
            excerpt = article.summary.length > maxLength ? 
                article.summary.substring(0, maxLength) + '...' : 
                article.summary;
                
            excerpt = `<div class="article-excerpt">${excerpt}</div>`;
        }
          // Create compact article HTML with improved layout
        return `
            <div class="article-item">
                <h3 class="article-title">
                    <a href="${article.url}">${article.title}${newBadge}</a>
                </h3>
                ${article.description ? `<div class="article-subtitle">${article.description}</div>` : ''}
                <div class="article-meta">
                    <span class="article-date">${formatDate(article.date)}</span> ${article.author ? '• <span class="article-author">' + article.author + '</span>' : ''}
                </div>
                ${excerpt}
                ${tagsHTML}
            </div>
        `;
    }
    
    // Display articles for current page
    function displayArticles(page) {
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageArticles = allArticles.slice(start, end);
        
        const articlesContainer = document.getElementById('articleList');
        
        // Generate HTML for articles
        let articlesHTML = '<div class="article-list">';
        pageArticles.forEach(article => {
            articlesHTML += createArticleHTML(article);
        });
        articlesHTML += '</div>';
        
        articlesContainer.innerHTML = articlesHTML;
        
        // Use enhanced pagination
        updatePagination(page);
    }
    
    // Update pagination UI using the enhanced pagination helper
    function updatePagination(currentPage) {
        const totalPages = Math.ceil(allArticles.length / articlesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        // If only one page, hide pagination
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }
        
        // Use the enhanced pagination helper if available
        if (typeof createPaginationHTML === 'function') {
            paginationContainer.innerHTML = createPaginationHTML(currentPage, totalPages, 'changePage');
        } else {
            // Fallback to basic pagination
            let paginationHTML = '';
            
            // Previous button
            if (currentPage > 1) {
                paginationHTML += `<li><a href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a></li>`;
            } else {
                paginationHTML += `<li class="disabled"><span>&laquo;</span></li>`;
            }
            
            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    paginationHTML += `<li class="active"><span>${i}</span></li>`;
                } else {
                    paginationHTML += `<li><a href="#" onclick="changePage(${i}); return false;">${i}</a></li>`;
                }
            }
            
            // Next button
            if (currentPage < totalPages) {
                paginationHTML += `<li><a href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a></li>`;
            } else {
                paginationHTML += `<li class="disabled"><span>&raquo;</span></li>`;
            }
            
            paginationContainer.innerHTML = paginationHTML;
        }
    }
    
    // Get all unique tags from articles
    function getAllTags() {
        const tags = new Set();
        tags.add('all'); // Always include "all" tag
        
        allArticles.forEach(article => {
            if (article.tags && article.tags.length > 0) {
                article.tags.forEach(tag => tags.add(tag.toLowerCase()));
            }
        });
        
        return Array.from(tags).sort();
    }
    
    // Populate filter tags
    function populateFilterTags() {
        const filterTagsContainer = document.getElementById('filterTags');
        const allTags = getAllTags();
        
        let tagsHTML = '';
        allTags.forEach(tag => {
            const isActive = tag === 'all' ? ' active' : '';
            tagsHTML += `<span class="filter-tag${isActive}" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag === 'all' ? 'All' : tag}</span>`;
        });
        
        filterTagsContainer.innerHTML = tagsHTML;
    }
    
    // Filter articles by tag
    window.filterByTag = function(tag) {
        // Update active state
        document.querySelectorAll('.filter-tag').forEach(el => {
            el.classList.toggle('active', el.dataset.tag === tag);
        });
        
        // Filter articles
        let filteredArticles;
        if (tag === 'all') {
            filteredArticles = allArticles;
        } else {
            filteredArticles = allArticles.filter(article => 
                article.tags && article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
            );
        }
        
        // Update display
        const articlesContainer = document.getElementById('articleList');
        
        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = '<p>No articles found with this tag.</p>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        // Save filtered articles to temporary variable for pagination
        window.tempFilteredArticles = filteredArticles;
        
        // Display first page
        let articlesHTML = '<div class="article-list">';
        const firstPage = filteredArticles.slice(0, articlesPerPage);
        firstPage.forEach(article => {
            articlesHTML += createArticleHTML(article);
        });
        articlesHTML += '</div>';
        
        articlesContainer.innerHTML = articlesHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        // Previous button (disabled on first page)
        paginationHTML += `<li class="disabled"><span>&laquo;</span></li>`;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1) {
                paginationHTML += `<li class="active"><span>1</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" onclick="changeFilteredPage(${i}); return false;">${i}</a></li>`;
            }
        }
        
        // Next button
        if (totalPages > 1) {
            paginationHTML += `<li><a href="#" onclick="changeFilteredPage(2); return false;">&raquo;</a></li>`;
        } else {
            paginationHTML += `<li class="disabled"><span>&raquo;</span></li>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    };
    
    // Change page for filtered results
    window.changeFilteredPage = function(page) {
        const filteredArticles = window.tempFilteredArticles;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageArticles = filteredArticles.slice(start, end);
        
        const articlesContainer = document.getElementById('articleList');
        
        let articlesHTML = '<div class="article-list">';
        pageArticles.forEach(article => {
            articlesHTML += createArticleHTML(article);
        });
        articlesHTML += '</div>';
        
        articlesContainer.innerHTML = articlesHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        // Previous button
        if (page > 1) {
            paginationHTML += `<li><a href="#" onclick="changeFilteredPage(${page - 1}); return false;">&laquo;</a></li>`;
        } else {
            paginationHTML += `<li class="disabled"><span>&laquo;</span></li>`;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === page) {
                paginationHTML += `<li class="active"><span>${i}</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" onclick="changeFilteredPage(${i}); return false;">${i}</a></li>`;
            }
        }
        
        // Next button
        if (page < totalPages) {
            paginationHTML += `<li><a href="#" onclick="changeFilteredPage(${page + 1}); return false;">&raquo;</a></li>`;
        } else {
            paginationHTML += `<li class="disabled"><span>&raquo;</span></li>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    };
    
    // Change page for regular results
    window.changePage = function(page) {
        currentPage = page;
        displayArticles(page);
        
        // Scroll to top of article list with a smooth animation
        document.getElementById('articleList').scrollIntoView({
            behavior: 'smooth', 
            block: 'start'
        });
    };
    
    // Search articles
    window.searchArticles = function() {
        const searchTerm = document.getElementById('articleSearch').value.toLowerCase();
        const searchClearButton = document.getElementById('searchClear');
        
        // Show/hide clear button
        searchClearButton.style.display = searchTerm ? 'block' : 'none';
        
        if (!searchTerm) {
            // Reset to all articles if no search term
            displayArticles(1);
            return;
        }
        
        // Filter articles by search term
        const filteredArticles = allArticles.filter(article => {
            return article.title.toLowerCase().includes(searchTerm) ||
                   article.summary?.toLowerCase().includes(searchTerm) ||
                   article.author?.toLowerCase().includes(searchTerm) ||
                   (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        });
        
        // Save filtered articles to temporary variable for pagination
        window.tempFilteredArticles = filteredArticles;
        
        const articlesContainer = document.getElementById('articleList');
        
        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = '<p>No articles found matching your search.</p>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        // Display first page
        let articlesHTML = '<div class="article-list">';
        const firstPage = filteredArticles.slice(0, articlesPerPage);
        firstPage.forEach(article => {
            articlesHTML += createArticleHTML(article);
        });
        articlesHTML += '</div>';
        
        articlesContainer.innerHTML = articlesHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        // Previous button (disabled on first page)
        paginationHTML += `<li class="disabled"><span>&laquo;</span></li>`;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1) {
                paginationHTML += `<li class="active"><span>1</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" onclick="changeFilteredPage(${i}); return false;">${i}</a></li>`;
            }
        }
        
        // Next button
        if (totalPages > 1) {
            paginationHTML += `<li><a href="#" onclick="changeFilteredPage(2); return false;">&raquo;</a></li>`;
        } else {
            paginationHTML += `<li class="disabled"><span>&raquo;</span></li>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    };
    
    // Clear search
    window.clearSearch = function() {
        document.getElementById('articleSearch').value = '';
        document.getElementById('searchClear').style.display = 'none';
        displayArticles(1);
    };
    
    // Load articles from JSON
    fetch('/research/articles.json')
        .then(response => response.json())
        .then(articles => {
            // Sort articles by date (newest first)
            allArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Display first page and populate filters
            displayArticles(1);
            populateFilterTags();
            
            // Check URL params for tag filtering
            const urlParams = new URLSearchParams(window.location.search);
            const tagParam = urlParams.get('tag');
            
            if (tagParam) {
                filterByTag(tagParam);
            }
            
            // Hide clear search button initially
            document.getElementById('searchClear').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading articles:', error);
            document.getElementById('articleList').innerHTML = 
                '<p>Failed to load articles. Please try again later.</p>';
        });
});
