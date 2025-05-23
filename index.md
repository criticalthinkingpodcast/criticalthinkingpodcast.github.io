---
layout: default
---
<style>
::-webkit-scrollbar {
      width: 0px;
}
</style>
<script>
var test;
fetch("https://proxy.cors.sh/https://media.rss.com/ctbbpodcast/feed.xml").then(a=>a.text()).then((text)=>{
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");
    test= xmlDoc;
    test.children[0].children[0].querySelectorAll("item").forEach((item)=>{
        var title = item.querySelector("title").innerHTML.replace("<![CDATA[", "").replace("]]>", "");
        var episodeId = item.querySelector("link").innerHTML.replace("<![CDATA[", "").replace("]]>", "").split("/").slice(-1)[0];
        var i = document.createElement('iframe');
        i.src = `https://player.rss.com/ctbbpodcast/${episodeId}?theme=dark`;
        i.style= "width:100%;height:8.75em;border-radius:1em;border:none;margin:1em 0em;"
        i.title = "Critical Thinking - A Bug Bounty Podcast";
        i.frameborder = "0";
        i.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        i.allowfullscreen ="true"
        var a = document.createElement("a")
        a.href = `https://rss.com/podcasts/ctbbpodcast/${episodeId}/`
        a.innerText = title
        i.appendChild(a)
        document.getElementById("episodeContainer").appendChild(i)
    })


    console.log(xmlDoc)

    
})
/*template = `<iframe src="https://player.rss.com/ctbbpodcast/${episodeId}?theme=dark" style="width: 100%;height:8.75em;border-radius:1em;" title="Critical Thinking - A Bug Bounty Podcast" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen><a href="https://rss.com/podcasts/ctbbpodcast/${episodeId}/"> ${episodeTitle} | RSS.com</a></iframe>`*/

</script>
<div id="episodeContainer">


</div>

Text can be **bold**, _italic_, ~~strikethrough~~ or `keyword`.

[Link to another page](./another-page.html).

There should be whitespace between paragraphs.

There should be whitespace between paragraphs. We recommend including a README, or a file with information about your project.

# Header 1

This is a normal paragraph following a header. GitHub is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.

## Header 2

> This is a blockquote following a header.
>
> When something is important enough, you do it even if the odds are not in your favor.

### Header 3

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l)
  return true;
}
```

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```

#### Header 4

*   This is an unordered list following a header.
*   This is an unordered list following a header.
*   This is an unordered list following a header.

##### Header 5

1.  This is an ordered list following a header.
2.  This is an ordered list following a header.
3.  This is an ordered list following a header.

###### Header 6

| head1        | head two          | three |
|:-------------|:------------------|:------|
| ok           | good swedish fish | nice  |
| out of stock | good and plenty   | nice  |
| ok           | good `oreos`      | hmm   |
| ok           | good `zoute` drop | yumm  |

### There's a horizontal rule below this.

* * *

### Here is an unordered list:

*   Item foo
*   Item bar
*   Item baz
*   Item zip

### And an ordered list:

1.  Item one
1.  Item two
1.  Item three
1.  Item four

### And a nested list:

- level 1 item
  - level 2 item
  - level 2 item
    - level 3 item
    - level 3 item
- level 1 item
  - level 2 item
  - level 2 item
  - level 2 item
- level 1 item
  - level 2 item
  - level 2 item
- level 1 item

### Small image

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

### Large image

![Branching](https://guides.github.com/activities/hello-world/branching.png)


### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Godzilla</dd>
<dt>Born</dt>
<dd>1952</dd>
<dt>Birthplace</dt>
<dd>Japan</dd>
<dt>Color</dt>
<dd>Green</dd>
</dl>

```
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

```
The final element.
```
