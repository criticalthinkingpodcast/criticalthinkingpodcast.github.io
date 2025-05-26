/**
 * Enhanced Pagination Helper
 * 
 * Provides improved pagination with ellipsis for large page counts
 * and better mobile responsiveness
 */

// Create enhanced pagination HTML
function createPaginationHTML(currentPage, totalPages, onClickFunction) {
    // If only one page, hide pagination
    if (totalPages <= 1) {
        return '';
    }
    
    let paginationHTML = '';
    
    // Previous button (disabled on first page)
    if (currentPage === 1) {
        paginationHTML += `<li class="disabled"><span>&laquo;</span></li>`;
    } else {
        paginationHTML += `<li><a href="#" onclick="${onClickFunction}(${currentPage - 1}); return false;" title="Previous Page">&laquo;</a></li>`;
    }
    
    // Page numbers with ellipsis for many pages
    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<li class="active"><span>${i}</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" onclick="${onClickFunction}(${i}); return false;">${i}</a></li>`;
            }
        }
    } else {
        // Show ellipsis for many pages
        
        // Always show first page
        if (currentPage === 1) {
            paginationHTML += `<li class="active"><span>1</span></li>`;
        } else {
            paginationHTML += `<li><a href="#" onclick="${onClickFunction}(1); return false;">1</a></li>`;
        }
        
        // Calculate range to show around current page
        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);
        
        // Adjust if close to start or end
        if (currentPage <= 4) {
            endPage = 5;
        } else if (currentPage >= totalPages - 3) {
            startPage = totalPages - 4;
        }
        
        // Show ellipsis before if needed
        if (startPage > 2) {
            paginationHTML += `<li class="disabled"><span>...</span></li>`;
        }
        
        // Show page numbers
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHTML += `<li class="active"><span>${i}</span></li>`;
            } else {
                paginationHTML += `<li><a href="#" onclick="${onClickFunction}(${i}); return false;">${i}</a></li>`;
            }
        }
        
        // Show ellipsis after if needed
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="disabled"><span>...</span></li>`;
        }
        
        // Always show last page
        if (currentPage === totalPages) {
            paginationHTML += `<li class="active"><span>${totalPages}</span></li>`;
        } else {
            paginationHTML += `<li><a href="#" onclick="${onClickFunction}(${totalPages}); return false;">${totalPages}</a></li>`;
        }
    }
    
    // Next button
    if (currentPage === totalPages) {
        paginationHTML += `<li class="disabled"><span>&raquo;</span></li>`;
    } else {
        paginationHTML += `<li><a href="#" onclick="${onClickFunction}(${currentPage + 1}); return false;" title="Next Page">&raquo;</a></li>`;
    }
    
    return paginationHTML;
}
