(function () {
    var SCROLL_OFFSET = 220;
    var MIN_HEADINGS = 3;

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function ensureId(heading, used) {
        if (heading.id && !used[heading.id]) {
            used[heading.id] = true;
            return heading.id;
        }
        var base = slugify(heading.textContent || '') || 'section';
        var candidate = base;
        var n = 2;
        while (used[candidate] || document.getElementById(candidate)) {
            candidate = base + '-' + n;
            n += 1;
        }
        heading.id = candidate;
        used[candidate] = true;
        return candidate;
    }

    function buildTree(headings) {
        var rootList = document.createElement('ul');
        rootList.className = 'post-toc-list post-toc-list-h2';
        var currentH2Sublist = null;
        var used = {};

        headings.forEach(function (heading) {
            var id = ensureId(heading, used);
            var li = document.createElement('li');
            li.className = 'post-toc-item';

            var link = document.createElement('a');
            link.className = 'post-toc-link';
            link.href = '#' + id;
            link.dataset.target = id;
            link.textContent = heading.textContent;
            li.appendChild(link);

            if (heading.tagName === 'H2') {
                li.classList.add('post-toc-item-h2');
                rootList.appendChild(li);
                currentH2Sublist = null;
            } else {
                li.classList.add('post-toc-item-h3');
                if (!currentH2Sublist) {
                    var lastH2 = rootList.lastElementChild;
                    if (!lastH2) {
                        lastH2 = document.createElement('li');
                        lastH2.className = 'post-toc-item post-toc-item-h2 post-toc-item-orphan';
                        rootList.appendChild(lastH2);
                    }
                    currentH2Sublist = document.createElement('ul');
                    currentH2Sublist.className = 'post-toc-list post-toc-list-h3';
                    lastH2.appendChild(currentH2Sublist);
                }
                currentH2Sublist.appendChild(li);
            }
        });

        return rootList;
    }

    function ensureActiveVisible(panel, smooth) {
        if (!panel) return;
        var active = panel.querySelector('a.post-toc-link.is-active');
        if (!active) return;
        if (panel.scrollHeight <= panel.clientHeight) return;
        var linkRect = active.getBoundingClientRect();
        var panelRect = panel.getBoundingClientRect();
        var pad = 24;
        var newTop = panel.scrollTop;
        if (linkRect.top < panelRect.top + pad) {
            newTop -= (panelRect.top + pad - linkRect.top);
        } else if (linkRect.bottom > panelRect.bottom - pad) {
            newTop += (linkRect.bottom - panelRect.bottom + pad);
        } else {
            return;
        }
        if (smooth && panel.scrollTo) {
            panel.scrollTo({ top: newTop, behavior: 'smooth' });
        } else {
            panel.scrollTop = newTop;
        }
    }

    function setupMobileToggle(mobileWrap) {
        var toggle = mobileWrap.querySelector('.post-toc-mobile-toggle');
        var panel = mobileWrap.querySelector('.post-toc-mobile-panel');
        if (!toggle || !panel) return;

        function close() {
            mobileWrap.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }

        function open() {
            mobileWrap.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            ensureActiveVisible(panel, false);
        }

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (mobileWrap.classList.contains('is-open')) {
                close();
            } else {
                open();
            }
        });

        panel.addEventListener('click', function (e) {
            var link = e.target.closest('a.post-toc-link');
            if (link && window.matchMedia('(max-width: 768px)').matches) close();
        });

        document.addEventListener('click', function (e) {
            if (!mobileWrap.contains(e.target)) close();
        });
    }

    function setupScrollSpy(headings, links, panel) {
        if (!links.length) return;

        var ticking = false;
        var lastActiveId = null;

        function update() {
            ticking = false;
            var activeId = null;
            for (var i = 0; i < headings.length; i++) {
                var rect = headings[i].getBoundingClientRect();
                if (rect.top - SCROLL_OFFSET <= 0) {
                    activeId = headings[i].id;
                } else {
                    break;
                }
            }
            if (!activeId && headings.length) activeId = headings[0].id;

            links.forEach(function (link) {
                if (link.dataset.target === activeId) {
                    link.classList.add('is-active');
                } else {
                    link.classList.remove('is-active');
                }
            });

            if (activeId !== lastActiveId) {
                lastActiveId = activeId;
                ensureActiveVisible(panel, true);
            }
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    function init() {
        var content = document.querySelector('.post-content');
        if (!content) return;

        var headings = Array.prototype.slice.call(
            content.querySelectorAll('h2, h3')
        );
        if (headings.length < MIN_HEADINGS) return;

        var mobileWrap = document.getElementById('post-toc-mobile');
        var mobilePanel = document.getElementById('post-toc-mobile-panel');
        if (!mobileWrap || !mobilePanel) return;

        var tree = buildTree(headings);
        mobilePanel.appendChild(tree);
        mobileWrap.removeAttribute('hidden');
        setupMobileToggle(mobileWrap);

        var allLinks = Array.prototype.slice.call(
            mobilePanel.querySelectorAll('a.post-toc-link')
        );
        setupScrollSpy(headings, allLinks, mobilePanel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
