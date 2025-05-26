/**
 * Scroll-to-Top Button
 * 
 * Adds a button that appears when scrolling down and allows users
 * to quickly return to the top of the page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create the button element
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scrollToTopBtn';
    scrollButton.innerHTML = '&uparrow;';
    scrollButton.title = 'Back to Top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollButton.style.position = 'fixed';
    scrollButton.style.bottom = '20px';
    scrollButton.style.right = '20px';
    scrollButton.style.height = '40px';
    scrollButton.style.width = '40px';
    scrollButton.style.fontSize = '20px';
    scrollButton.style.lineHeight = '1';
    scrollButton.style.background = '#333';
    scrollButton.style.color = '#58a6ff';
    scrollButton.style.border = '1px solid #444';
    scrollButton.style.borderRadius = '50%';
    scrollButton.style.cursor = 'pointer';
    scrollButton.style.display = 'none'; // Initially hidden
    scrollButton.style.zIndex = '1000';
    scrollButton.style.opacity = '0.8';
    scrollButton.style.transition = 'opacity 0.3s, background-color 0.3s';
    
    // Hover effect
    scrollButton.addEventListener('mouseover', function() {
        this.style.opacity = '1';
        this.style.backgroundColor = '#444';
    });
    
    scrollButton.addEventListener('mouseout', function() {
        this.style.opacity = '0.8';
        this.style.backgroundColor = '#333';
    });
    
    // Click behavior to scroll to top
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add to page
    document.body.appendChild(scrollButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) { // Show after scrolling down 300px
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Add media query for mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMediaChange(e) {
        if (e.matches) {
            // Mobile styles
            scrollButton.style.bottom = '10px';
            scrollButton.style.right = '10px';
            scrollButton.style.height = '35px';
            scrollButton.style.width = '35px';
            scrollButton.style.fontSize = '16px';
        } else {
            // Desktop styles
            scrollButton.style.bottom = '20px';
            scrollButton.style.right = '20px';
            scrollButton.style.height = '40px';
            scrollButton.style.width = '40px';
            scrollButton.style.fontSize = '20px';
        }
    }
    
    // Initial check and add listener
    handleMediaChange(mediaQuery);
    mediaQuery.addListener(handleMediaChange);
});
