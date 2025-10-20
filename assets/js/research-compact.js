/**
 * Compact Articles List Script
 * For displaying all research articles in a more compact layout
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get page size from localStorage or default to 10
    let articlesPerPage = parseInt(localStorage.getItem('research-pageSize') || '10');
    let allArticles = [];
    let currentPage = 1;
    let filteredArticles = []; // For search/filter functionality
    
    // Parse URL for page number (e.g., /research/all/2/)
    function getCurrentPageFromURL() {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        const pageIndex = pathParts.findIndex(part => part === 'all') + 1;
        if (pageIndex > 0 && pageIndex < pathParts.length) {
            const pageNum = parseInt(pathParts[pageIndex]);
            return isNaN(pageNum) ? 1 : pageNum;
        }
        return 1;
    }
    
    // Update URL without page refresh
    function updateURL(page) {
        const basePath = '/research/all/';
        const newPath = page > 1 ? `${basePath}${page}/` : basePath;
        window.history.pushState({page: page}, '', newPath);
    }
    
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
                    <span class="article-date">${formatDate(article.date)}</span> ${article.author ? `• <span class="article-author"><span>${article.author}</span>${article.profile_picture ? `<img src="${article.profile_picture}" alt="${article.author}" class="author-avatar">` : ''}</span>` : ''}
                </div>
                ${excerpt}
                ${tagsHTML}
            </div>
        `;
    }
    
    // Create page size controls
    function createPageSizeControls() {
        return `
            <div class="page-size-controls" style="margin-bottom: 20px; text-align: center;">
                <span style="color: #999; font-size: 0.9em; margin-right: 10px;">Items per page:</span>
                <button class="page-size-btn ${articlesPerPage === 10 ? 'active' : ''}" onclick="changePageSize(10)">10</button>
                <button class="page-size-btn ${articlesPerPage === 30 ? 'active' : ''}" onclick="changePageSize(30)">30</button>
                <button class="page-size-btn ${articlesPerPage === 50 ? 'active' : ''}" onclick="changePageSize(50)">50</button>
            </div>
        `;
    }
    
    // Change page size and refresh display
    window.changePageSize = function(newSize) {
        articlesPerPage = newSize;
        currentPage = 1; // Reset to first page
        
        // Save page size to localStorage
        localStorage.setItem('research-pageSize', newSize.toString());
        
        // Update URL to page 1
        updateURL(1);
        
        // Update button states
        document.querySelectorAll('.page-size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === newSize) {
                btn.classList.add('active');
            }
        });
        
        // Refresh display
        displayArticles(1);
        
        // Update pagination info
        updatePaginationInfo();
    };
    
    // Update pagination info display
    function updatePaginationInfo() {
        const totalArticles = filteredArticles.length > 0 ? filteredArticles.length : allArticles.length;
        const totalPages = Math.ceil(totalArticles / articlesPerPage);
        const startItem = (currentPage - 1) * articlesPerPage + 1;
        const endItem = Math.min(currentPage * articlesPerPage, totalArticles);
        
        const infoHTML = `Showing ${startItem}-${endItem} of ${totalArticles} articles (Page ${currentPage} of ${totalPages})`;
        
        const infoContainer1 = document.getElementById('paginationInfo');
        const infoContainer2 = document.getElementById('paginationInfo2');
        
        if (infoContainer1) {
            infoContainer1.innerHTML = infoHTML;
        }
        if (infoContainer2) {
            infoContainer2.innerHTML = infoHTML;
        }
    }
    
    // Display articles for current page
    function displayArticles(page) {
        currentPage = page;
        const articlesToShow = filteredArticles.length > 0 ? filteredArticles : allArticles;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageArticles = articlesToShow.slice(start, end);
        
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
        
        // Update pagination info
        updatePaginationInfo();
    }
    
    // Update pagination UI using the enhanced pagination helper
    function updatePagination(currentPage) {
        const articlesToShow = filteredArticles.length > 0 ? filteredArticles : allArticles;
        const totalPages = Math.ceil(articlesToShow.length / articlesPerPage);
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
        updateURL(page);
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
    
    // Initialize page size controls
    function initializePageSizeControls() {
        const controlsContainer = document.getElementById('pageSizeControls');
        if (controlsContainer) {
            controlsContainer.innerHTML = createPageSizeControls();
        }
    }

    // Load articles from JSON
    fetch('/research/articles.json')
        .then(response => response.json())
        .then(articles => {
            // Sort articles by date (newest first)
            allArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Initialize page size controls
            initializePageSizeControls();
            
            // Get current page from URL
            currentPage = getCurrentPageFromURL();
            
            // Display current page and populate filters
            displayArticles(currentPage);
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

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            displayArticles(currentPage);
        } else {
            currentPage = getCurrentPageFromURL();
            displayArticles(currentPage);
        }
    });
});
