/**
 * Utilities for the writeups section
 * These functions help manage writeup display and extraction
 */

// Global settings for the writeups system
const writeupsSettings = {
    writeupsPerPage: 4,
    featuredWriteups: 4,
    defaultImage: '/assets/images/CTLogo.png',
    newWriteupDays: 14
};

// Format a date string nicely
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Check if a writeup is new based on its published date
function isNewWriteup(dateString) {
    if (!dateString) return false;
    
    const writeupDate = new Date(dateString);
    const today = new Date();
    const timeDiff = today.getTime() - writeupDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    return daysDiff <= writeupsSettings.newWriteupDays;
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