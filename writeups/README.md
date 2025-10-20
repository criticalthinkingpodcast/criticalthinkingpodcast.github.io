# Writeups System Documentation

## Overview

I've created a comprehensive writeups system for your website that mirrors the existing research section but is specifically designed for bug bounty writeups. The system includes:

## File Structure Created

```
writeups/
├── writeups.json           # Jekyll-generated JSON data file
├── index.md               # Main writeups page
├── all/
│   └── index.md           # All writeups with pagination/search
└── articles/
    ├── WriteupNo1/
    │   └── post.md
    ├── WriteupNo2/
    │   └── post.md
    └── WriteupNo3/
        └── post.md

assets/js/
├── writeups-utils.js      # Utility functions for writeups
├── writeups-simple.js     # Simple display for main page
├── writeups-main.js       # Full-featured system (alternative)
└── writeups-compact.js    # Compact display for /all page
```

## Features

### 1. Main Writeups Page (`/writeups/`)
- Displays 3 featured writeups
- Clean, simple layout optimized for readability
- Red color scheme to differentiate from research (blue)
- "View All Writeups" button

### 2. All Writeups Page (`/writeups/all/`)
- Paginated display (10 writeups per page)
- Search functionality
- Tag filtering
- Compact layout for better overview

### 3. JSON Data Generation
- Automatically generates JSON from markdown files
- Extracts metadata (title, date, author, tags)
- Creates summaries from content
- Supports thumbnails

### 4. Navigation Integration
- Added "Writeups" link to main navigation menu
- Uses red color (#6bff77ff) to distinguish from research

## How to Add New Writeups

1. Create a new folder: `writeups/articles/WriteupNoX/`
2. Add a `post.md` file with the following frontmatter:

```markdown
---
layout: post
title: "Your Writeup Title"
description: "Brief description"
date: 2024-10-20
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
---

# Your Writeup Content

Content goes here...
```

3. The system will automatically detect and include the new writeup

## Key Differences from Research System

- **Color Scheme**: Uses red (#6bff77ff) instead of blue (#58a6ff)
- **Terminology**: "Writeups" instead of "Articles"
- **File Structure**: Uses `WriteupNoX` instead of `ArticleNoX`
- **JSON Endpoint**: `/writeups/writeups.json` instead of `/research/articles.json`

## JavaScript Components

### writeups-utils.js
- Global settings and configuration
- Date formatting functions
- New writeup detection
- H1 extraction from markdown

### writeups-simple.js
- Used on main writeups page
- Displays only featured writeups
- Minimal, clean interface

### writeups-compact.js
- Used on /writeups/all/ page
- Full pagination and search
- Tag filtering
- Compact display format

## Customization

You can modify the settings in `writeups-utils.js`:

```javascript
const writeupsSettings = {
    writeupsPerPage: 4,        // Articles per page
    featuredWriteups: 4,       // Featured writeups on main page
    defaultImage: '/assets/images/CTLogo.png',
    newWriteupDays: 14         // Days to show "NEW" badge
};
```

## Sample Content

I've created 3 sample writeups to demonstrate the system:
- XSS Vulnerability Discovery
- SQL Injection Exploitation  
- CSRF to Account Takeover

These can be edited or replaced with your actual content.

## Testing

Once Jekyll is running, you can access:
- `/writeups/` - Main writeups page
- `/writeups/all/` - All writeups with search/filtering
- `/writeups/writeups.json` - Raw JSON data

The system is now ready for use and fully integrated with your existing website!