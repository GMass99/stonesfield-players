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
