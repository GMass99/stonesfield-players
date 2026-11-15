// Shared behaviour tweaks for the admin panel (/admin) and its demo (/admin-demo)
setInterval(function() {
  // Hide "Sort by" bar
  var spans = document.querySelectorAll('span');
  for (var i = 0; i < spans.length; i++) {
    if (spans[i].textContent.trim() === 'Sort by') {
      var row = spans[i].closest('div');
      if (row && row.parentElement) {
        row.parentElement.style.display = 'none';
      }
    }
  }

  // Add "Click to edit →" hint to collection entries
  var listItems = document.querySelectorAll('li[class] a[href*="/entries/"]');
  for (var j = 0; j < listItems.length; j++) {
    var link = listItems[j];
    if (link.dataset.hinted) continue;
    link.dataset.hinted = '1';
    var arrow = document.createElement('span');
    arrow.textContent = 'Click to edit \u2192';
    arrow.style.cssText = 'font-size:0.85rem;color:#c8a96e;font-weight:500;white-space:nowrap;';
    link.appendChild(arrow);
  }
}, 500);

// ============================================================
// "Where is this on the page?"
// When you click into a box (or on a show / section heading), the preview
// on the right scrolls to that part of the page and outlines it in gold.
// It works because every bit of text in preview.js is tagged with
// data-field="path.to.field" (for example "events.1.title").
// ============================================================
(function () {
  // Decap's own "sync scrolling" would drag the form along whenever the
  // preview moves, so switch it off by default. The arrows button still turns it on.
  try {
    if (localStorage.getItem('cms.scroll-sync-enabled') === null) {
      localStorage.setItem('cms.scroll-sync-enabled', 'false');
    }
  } catch (e) {}

  var currentPath = null;

  function inEditorForm(el) {
    return !!(el && el.closest && el.closest('[class*="ControlPaneContainer"]'));
  }

  // Work out which field an element belongs to, e.g. ["events", "1", "title"],
  // from the labels Decap puts on each box and the position of list items.
  function fieldPath(el) {
    var parts = [];
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      var cls = typeof n.className === 'string' ? n.className : '';
      if (cls.indexOf('ControlPaneContainer') !== -1) break;
      if (cls.indexOf('ControlContainer') !== -1) {
        var label = n.querySelector('label[for]');
        if (label) parts.unshift(label.htmlFor.replace(/-field-\d+$/, ''));
      } else if (cls.indexOf('SortableListItem') !== -1 && n.parentElement) {
        var items = Array.prototype.filter.call(n.parentElement.children, function (c) {
          return typeof c.className === 'string' && c.className.indexOf('SortableListItem') !== -1;
        });
        parts.unshift(String(items.indexOf(n)));
      }
    }
    return parts;
  }

  function previewDocument() {
    var frame = document.querySelector('iframe[class*="PreviewPaneFrame"]');
    try { return frame && frame.contentDocument; } catch (e) { return null; }
  }

  function highlight(parts, scroll) {
    var doc = previewDocument();
    if (!doc) return;
    var old = doc.querySelectorAll('[data-sp-highlight]');
    for (var i = 0; i < old.length; i++) old[i].removeAttribute('data-sp-highlight');
    if (!parts || !parts.length) return;

    // Use the most specific match, e.g. events.1.title, else events.1, else events
    var target = null;
    for (var k = parts.length; k > 0 && !target; k--) {
      target = doc.querySelector('[data-field="' + parts.slice(0, k).join('.') + '"]');
    }
    if (!target) return;
    target.setAttribute('data-sp-highlight', '');

    if (scroll) {
      var win = doc.defaultView;
      var r = target.getBoundingClientRect();
      if (r.top < 0 || r.bottom > win.innerHeight) {
        var offset = Math.max(40, (win.innerHeight - r.height) / 3);
        win.scrollTo({ top: win.pageYOffset + r.top - offset, behavior: 'smooth' });
      }
    }
  }

  // Clicking into a box
  document.addEventListener('focusin', function (e) {
    if (!inEditorForm(e.target)) return;
    currentPath = fieldPath(e.target);
    highlight(currentPath, true);
  });

  // Clicking a show, a photo or a folded section (not a typing box)
  document.addEventListener('click', function (e) {
    if (!inEditorForm(e.target)) return;
    if (e.target.closest('input, textarea, select')) return;
    var target = e.target;
    setTimeout(function () {
      currentPath = fieldPath(target);
      highlight(currentPath, true);
    }, 60);
  });

  // The preview redraws as you type, so put the outline back each time
  document.addEventListener('input', function (e) {
    if (!inEditorForm(e.target) || !currentPath) return;
    setTimeout(function () { highlight(currentPath, false); }, 60);
  });
})();

// ============================================================
// Each section is a single page, so:
//  - clicking a page in the left-hand list opens it straight away, with its
//    preview, instead of the in-between "Click to edit" screen
//  - if you do land on that screen (after logging in, or using the back
//    arrow), it shows how the page looks on the website right now
// ============================================================
(function () {
  var SECTIONS = {
    home:     { entry: 'home',     url: '/' },
    about:    { entry: 'about',    url: '/about/' },
    whats_on: { entry: 'whats_on', url: '/events/' },
    contact:  { entry: 'contact',  url: '/contact/' },
    settings: { entry: 'site',     url: null }
  };
  function editorHash(name) {
    return '#/collections/' + name + '/entries/' + SECTIONS[name].entry;
  }

  // Left-hand list of pages: go straight to the page
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#/collections/"]');
    if (!link || String(link.className).indexOf('SidebarNavLink') === -1) return;
    var m = link.getAttribute('href').match(/^#\/collections\/([^/]+)\/?$/);
    if (!m || !SECTIONS[m[1]]) return;
    e.preventDefault();
    e.stopPropagation();
    window.location.hash = editorHash(m[1]);
  }, true);

  // In-between screen: add a picture of the page as it is now
  function showPagePreview() {
    var m = window.location.hash.match(/^#\/collections\/([^/?]+)\/?$/);
    var section = m && SECTIONS[m[1]];
    var box = document.getElementById('sp-page-preview');
    if (!section || !section.url) { if (box) box.remove(); return; }
    var card = document.querySelector('[class*="ListCard"]');
    if (!card || !card.parentElement || !card.parentElement.parentElement) return;
    if (box && box.getAttribute('data-section') === m[1]) return;
    if (box) box.remove();
    box = document.createElement('a');
    box.id = 'sp-page-preview';
    box.setAttribute('data-section', m[1]);
    box.href = editorHash(m[1]);
    box.innerHTML =
      '<span class="sp-page-preview-label">How this page looks on the website right now. Click it to edit.</span>' +
      '<span class="sp-page-preview-frame"><iframe src="' + section.url + '" tabindex="-1" title="Page preview"></iframe></span>';
    box.style.maxWidth = Math.round(card.getBoundingClientRect().width) + 'px';
    var list = card.parentElement;
    list.parentElement.insertBefore(box, list.nextSibling);
  }
  setInterval(showPagePreview, 500);
})();
