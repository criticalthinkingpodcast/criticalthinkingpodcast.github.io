# Critical Thinking — Bug Bounty Podcast

Source for [lab.ctbb.show](https://lab.ctbb.show)

## Submitting a Research Post or Writeup

After submitting your post through the form [here](https://www.criticalthinkingpodcast.io/critical-research-lab/), we'll send you this page so you can copy the front-matter and then send us the final version of the post again. 

### What to send

1. **`post.md`:** your post body in plain Markdown, with the front matter block below at the top.
2. **Inline images:** any image you reference inside the post (`![alt](myimage.png)`).
3. **A thumbnail** *(optional but recommended):* a file named `thumbnail.{png,jpg,jpeg,svg,gif,webp}`. Used for both the article-index card and the social link preview (X, LinkedIn, WhatsApp, Slack, Discord, iMessage, etc.). Recommended dimensions: ~1200×630 for the big-card preview.
4. **Profile picture** *(if not already in the repo):* send the file separately.

### Front Matter

Copy this into the top of your `post.md`. **All fields required.**

```yaml
---
layout: post                              # always "post"
title: "Your Post Title Goes Here"        # quote it if it has colons or special chars
author: Your Name
date: YYYY-MM-DD                          # the publish date you want shown
tags: [tag1, tag2, tag3]                  # 3–5 lowercase, hyphenated topic tags
profile_picture: /assets/images/your.jpg  # path; send the file if it isn't in the repo yet
handle: your_handle                       # your hacker handle (no @)
social_links: [https://x.com/your_handle, https://your-blog.com/]
description: "One or two sentences. Used in link previews and the article-index card."
permalink: /research/your-post-slug       # research → /research/<slug>
                                          # writeups → /writeups/<slug>
                                          # use kebab-case
---
```

Clean version for copying and pasting:

```yaml
---
layout: post
title: "Title"
author: YourName
date: YYYY-MM-DD
tags: [ ]
profile_picture: /assets/images/your.jpg
handle: your_handle
social_links: [ ]
description: "Description"
permalink: /research_OR_writeup/your-post-slug
---
```

### Markdown Notes

- **Standard Markdown** plus GitHub-flavored extensions (tables, fenced code blocks, task lists). Write naturally.
- **Code blocks**: triple-backtick with a language tag for syntax highlighting. "```js" for example. 
- **Inline images**: reference by filename only: `![alt](myimage.png)` and the build resolves the path.
- **Curly braces in code examples** (`{{ ... }}` or `{% ... %}`, React, Vue, Angular, Handlebars, Liquid, Jinja, etc.) these are template syntax that the site builder will try to interpret and your post will fail to render. **Fix:** wrap the body of your post in `{% raw %}` ... `{% endraw %}` tags right after the front matter:

  ```
  ---
  ...front matter...
  ---

  {% raw %}

  Your post body here, with all the {{ curly }} examples you want.

  {% endraw %}
  ```

  **If your post has no `{{` or `{%` anywhere, ignore this, you don't need it.**

