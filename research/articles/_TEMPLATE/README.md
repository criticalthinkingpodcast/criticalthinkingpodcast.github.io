# Writing a Post

## Front Matter Reference

Put the block at the top of your post between `---` lines. **All fields are required** unless noted.

```yaml
---
layout: post                                        # always "post", don't change
title: "Your Post Title Goes Here"                  # quote it if it has colons or special chars
author: Your Name                                   # your name
date: YYYY-MM-DD                                    # YYYY-MM-DD, the date you want shown
tags: [tag1, tag2, tag3, ...]                       # 3–5 lowercase, hyphenated topic tags
profile_picture: /assets/images/your-pic.jpg        # send us the file if you don't have one in the repo yet
handle: your_handle                                 # your hacker handle
social_links: [https://yourlinks.com/]              # one or more URLs, personal blogs, socials, etc.
description: "One or two sentences."                # link previews + article index card
permalink: /research/your-post-slug               * # for research -> the URL the post lives at, use kebab-case
permalink: /writeups/your-post-slug               * # for writeups -> the URL the post lives at, use kebab-case
---
```

Clean version below for copy and paste:

```yaml
---
layout: post
title: "Your Post Title Goes Here"
author: Your Name
date: YYYY-MM-DD
tags: [tag1, tag2, tag3, ...]
profile_picture: /assets/images/your-pic.jpg
handle: your_handle
social_links: [https://yourlinks.com/]
description: "One or two sentences."
permalink: /research OR writeups/your-post-slug
---
```