/**
 * Compact Writeups List Script
 * For displaying all writeups in a more compact layout
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get page size from localStorage or default to 10
    let articlesPerPage = parseInt(localStorage.getItem('writeups-pageSize') || '10');
    let allWriteups = [];
    let currentPage = 1;
    let filteredWriteups = []; // For search/filter functionality
    
    // Parse URL for page number (e.g., /writeups/all/2/)
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
        const basePath = '/writeups/all/';
        const newPath = page > 1 ? `${basePath}${page}/` : basePath;
        window.history.pushState({page: page}, '', newPath);
    }
    
    // Create compact writeup item HTML with enhanced appearance
    function createWriteupHTML(writeup) {
        // Check if the writeup is new
        const isNew = isNewWriteup(writeup.date);
        const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';
        
        // Generate tags HTML if writeup has tags
        let tagsHTML = '';
        if (writeup.tags && writeup.tags.length > 0) {
            tagsHTML = '<div class="article-tags">';
            writeup.tags.forEach(tag => {
                tagsHTML += `<span class="article-tag" data-tag="${tag}">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        // Get a short excerpt for the compact view
        let excerpt = '';
        if (writeup.summary && writeup.summary.length > 0) {
            const maxLength = 100; // Shorter excerpt for compact view
            excerpt = writeup.summary.length > maxLength ? 
                writeup.summary.substring(0, maxLength) + '...' : 
                writeup.summary;
                
            excerpt = `<div class="article-excerpt">${excerpt}</div>`;
        }
          
        // Create compact writeup HTML with improved layout
        return `
            <div class="article-item">
                <h3 class="article-title">
                    <a href="${writeup.url}">${writeup.title}${newBadge}</a>
                </h3>
                ${writeup.description ? `<div class="article-subtitle">${writeup.description}</div>` : ''}
                <div class="article-meta">
                    <span class="article-date">${formatDate(writeup.date)}</span> ${writeup.author ? `• <span class="article-author"><span>${writeup.author}</span>${writeup.profile_picture ? `<img src="${writeup.profile_picture}" alt="${writeup.author}" class="author-avatar">` : ''}</span>` : ''}
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
        localStorage.setItem('writeups-pageSize', newSize.toString());
        
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
        displayWriteups(1);
        
        // Update pagination info
        updatePaginationInfo();
    };
    
    // Update pagination info display
    function updatePaginationInfo() {
        const totalWriteups = filteredWriteups.length > 0 ? filteredWriteups.length : allWriteups.length;
        const totalPages = Math.ceil(totalWriteups / articlesPerPage);
        const startItem = (currentPage - 1) * articlesPerPage + 1;
        const endItem = Math.min(currentPage * articlesPerPage, totalWriteups);
        
        const infoHTML = `Showing ${startItem}-${endItem} of ${totalWriteups} writeups (Page ${currentPage} of ${totalPages})`;
        
        const infoContainer1 = document.getElementById('paginationInfo');
        const infoContainer2 = document.getElementById('paginationInfo2');
        
        if (infoContainer1) {
            infoContainer1.innerHTML = infoHTML;
        }
        if (infoContainer2) {
            infoContainer2.innerHTML = infoHTML;
        }
    }
    
    // Display writeups for current page
    function displayWriteups(page) {
        currentPage = page;
        const writeupsToShow = filteredWriteups.length > 0 ? filteredWriteups : allWriteups;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageWriteups = writeupsToShow.slice(start, end);
        
        const writeupsContainer = document.getElementById('articleList');
        
        // Generate HTML for writeups
        let writeupsHTML = '<div class="article-list">';
        pageWriteups.forEach(writeup => {
            writeupsHTML += createWriteupHTML(writeup);
        });
        writeupsHTML += '</div>';
        
        writeupsContainer.innerHTML = writeupsHTML;
        
        // Use enhanced pagination
        updatePagination(page);
        
        // Update pagination info
        updatePaginationInfo();
    }
    
    // Update pagination UI using the enhanced pagination helper
    function updatePagination(currentPage) {
        const writeupsToShow = filteredWriteups.length > 0 ? filteredWriteups : allWriteups;
        const totalPages = Math.ceil(writeupsToShow.length / articlesPerPage);
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
    
    // Get all unique tags from writeups
    function getAllTags() {
        const tags = new Set();
        tags.add('all'); // Always include "all" tag
        
        allWriteups.forEach(writeup => {
            if (writeup.tags && writeup.tags.length > 0) {
                writeup.tags.forEach(tag => tags.add(tag.toLowerCase()));
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
    
    // Filter writeups by tag
    window.filterByTag = function(tag) {
        // Update active state
        document.querySelectorAll('.filter-tag').forEach(el => {
            el.classList.toggle('active', el.dataset.tag === tag);
        });
        
        // Filter writeups
        let filteredWriteups;
        if (tag === 'all') {
            filteredWriteups = allWriteups;
        } else {
            filteredWriteups = allWriteups.filter(writeup => 
                writeup.tags && writeup.tags.some(t => t.toLowerCase() === tag.toLowerCase())
            );
        }
        
        // Update display
        const writeupsContainer = document.getElementById('articleList');
        
        if (filteredWriteups.length === 0) {
            writeupsContainer.innerHTML = '<p>No writeups found with this tag.</p>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        // Save filtered writeups to temporary variable for pagination
        window.tempFilteredWriteups = filteredWriteups;
        
        // Display first page
        let writeupsHTML = '<div class="article-list">';
        const firstPage = filteredWriteups.slice(0, articlesPerPage);
        firstPage.forEach(writeup => {
            writeupsHTML += createWriteupHTML(writeup);
        });
        writeupsHTML += '</div>';
        
        writeupsContainer.innerHTML = writeupsHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredWriteups.length / articlesPerPage);
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
        const filteredWriteups = window.tempFilteredWriteups;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageWriteups = filteredWriteups.slice(start, end);
        
        const writeupsContainer = document.getElementById('articleList');
        
        let writeupsHTML = '<div class="article-list">';
        pageWriteups.forEach(writeup => {
            writeupsHTML += createWriteupHTML(writeup);
        });
        writeupsHTML += '</div>';
        
        writeupsContainer.innerHTML = writeupsHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredWriteups.length / articlesPerPage);
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
        displayWriteups(page);
        
        // Scroll to top of writeup list with a smooth animation
        document.getElementById('articleList').scrollIntoView({
            behavior: 'smooth', 
            block: 'start'
        });
    };
    
    // Search writeups
    window.searchArticles = function() {
        const searchTerm = document.getElementById('articleSearch').value.toLowerCase();
        const searchClearButton = document.getElementById('searchClear');
        
        // Show/hide clear button
        searchClearButton.style.display = searchTerm ? 'block' : 'none';
        
        if (!searchTerm) {
            // Reset to all writeups if no search term
            displayWriteups(1);
            return;
        }
        
        // Filter writeups by search term
        const filteredWriteups = allWriteups.filter(writeup => {
            return writeup.title.toLowerCase().includes(searchTerm) ||
                   writeup.summary?.toLowerCase().includes(searchTerm) ||
                   writeup.author?.toLowerCase().includes(searchTerm) ||
                   (writeup.tags && writeup.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        });
        
        // Save filtered writeups to temporary variable for pagination
        window.tempFilteredWriteups = filteredWriteups;
        
        const writeupsContainer = document.getElementById('articleList');
        
        if (filteredWriteups.length === 0) {
            writeupsContainer.innerHTML = '<p>No writeups found matching your search.</p>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        // Display first page
        let writeupsHTML = '<div class="article-list">';
        const firstPage = filteredWriteups.slice(0, articlesPerPage);
        firstPage.forEach(writeup => {
            writeupsHTML += createWriteupHTML(writeup);
        });
        writeupsHTML += '</div>';
        
        writeupsContainer.innerHTML = writeupsHTML;
        
        // Update pagination
        const totalPages = Math.ceil(filteredWriteups.length / articlesPerPage);
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
        displayWriteups(1);
    };
    
    // Initialize page size controls
    function initializePageSizeControls() {
        const controlsContainer = document.getElementById('pageSizeControls');
        if (controlsContainer) {
            controlsContainer.innerHTML = createPageSizeControls();
        }
    }

    // Load writeups from JSON
    fetch('/writeups/writeups.json')
        .then(response => response.json())
        .then(writeups => {
            // Sort writeups by date (newest first)
            allWriteups = writeups.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Initialize page size controls
            initializePageSizeControls();
            
            // Get current page from URL
            currentPage = getCurrentPageFromURL();
            
            // Display current page and populate filters
            displayWriteups(currentPage);
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
            console.error('Error loading writeups:', error);
            document.getElementById('articleList').innerHTML = 
                '<p>Failed to load writeups. Please try again later.</p>';
        });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            displayWriteups(currentPage);
        } else {
            currentPage = getCurrentPageFromURL();
            displayWriteups(currentPage);
        }
    });
});