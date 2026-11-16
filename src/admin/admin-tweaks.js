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
// Look first, then edit.
// Picking a page in the left-hand list shows how that page looks on the
// website right now, with one "Edit this page" button. The editor's back
// arrow returns here, and you land on the Home page's screen after logging in.
// ============================================================
(function () {
  var SECTIONS = {
    home:     { entry: 'home',     url: '/' },
    about:    { entry: 'about',    url: '/about/' },
    whats_on: { entry: 'whats_on', url: '/events/' },
    archive:  { entry: 'archive',  url: '/archive/' },
    contact:  { entry: 'contact',  url: '/contact/' },
    settings: {
      entry: 'site', url: '/', footer: true,
      label: 'These settings appear in the footer at the bottom of every page. This is how it looks right now:',
      button: 'Edit settings \u2192'
    }
  };

  function update() {
    var m = window.location.hash.match(/^#\/collections\/([^/?]+)\/?$/);
    var name = m && SECTIONS[m[1]] ? m[1] : null;
    document.body.classList.toggle('sp-preview-screen', !!name);

    var box = document.getElementById('sp-page-preview');
    if (!name) { if (box) box.remove(); return; }
    if (box && box.getAttribute('data-section') === name) return;

    var top = document.querySelector('[class*="CollectionTopContainer"]');
    if (!top || !top.parentElement) return;
    if (box) box.remove();

    var s = SECTIONS[name];
    var editHref = '#/collections/' + name + '/entries/' + s.entry;
    box = document.createElement('div');
    box.id = 'sp-page-preview';
    box.setAttribute('data-section', name);
    box.style.maxWidth = Math.round(top.getBoundingClientRect().width) + 'px';
    box.innerHTML =
      '<div class="sp-page-preview-head">' +
        '<span class="sp-page-preview-label">' + (s.label || 'How this page looks on the website right now:') + '</span>' +
        '<a class="sp-edit-button" href="' + editHref + '">' + (s.button || 'Edit this page \u2192') + '</a>' +
      '</div>' +
      '<a class="sp-page-preview-frame" href="' + editHref + '" aria-label="Edit this page">' +
        '<iframe src="' + s.url + '" tabindex="-1" title="How the page looks now"></iframe>' +
      '</a>';
    top.parentElement.insertBefore(box, top.nextSibling);

    var frame = box.querySelector('iframe');
    var wrap = box.querySelector('.sp-page-preview-frame');
    frame.addEventListener('load', function () {
      try {
        var doc = frame.contentDocument;
        var win = frame.contentWindow;

        // Site Settings: just show the footer
        if (s.footer) {
          win.scrollTo(0, doc.documentElement.scrollHeight);
          return;
        }

        // Show the whole page, so you can scroll down through it. The site's
        // top section is sized to the screen height, so pin it to a normal
        // screen size here (preview only), or the page would keep growing.
        var pin = doc.createElement('style');
        pin.textContent = '.hero { min-height: 760px !important; }';
        doc.head.appendChild(pin);

        var fit = function () {
          var h = Math.min(doc.body.scrollHeight, 20000);
          wrap.style.height = Math.ceil(h * 0.5) + 'px';
        };
        fit();
        if (win.ResizeObserver) new win.ResizeObserver(fit).observe(doc.body);
        setTimeout(fit, 1500);
      } catch (e) {}
    });
  }

  window.addEventListener('hashchange', update);
  setInterval(update, 300);
})();

// ============================================================
// Open and close a section (or a show, photo or production) by clicking
// anywhere on its bar or name, not just the small arrow on the left.
// Real buttons (Add, delete ×, drag handle) keep doing their own job.
// ============================================================
document.addEventListener('click', function (e) {
  var t = e.target;
  if (!t.closest || !t.closest('[class*="ControlPaneContainer"]')) return;
  if (t.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;

  var bar = null;

  // The name tab above a section ("NEXT SHOW BANNER")
  var label = t.closest('label');
  if (label) {
    var cc = label.closest('[class*="ControlContainer"]');
    var own = cc && cc.querySelector('[class*="TopBarContainer"]');
    if (own && own.closest('[class*="ControlContainer"]') === cc) bar = own;
  }

  // The bar of a section, or of a show / photo / production
  if (!bar && !label) {
    bar = t.closest('[class*="TopBarContainer"], [class*="StyledListItemTopBar"]');
  }

  // The name of a closed show / photo / production, just under its bar
  if (!bar && !label) {
    var item = t.closest('[class*="SortableListItem"]');
    var inner = t.closest('[class*="ControlContainer"]');
    if (item && (!inner || inner.contains(item))) {
      bar = item.querySelector('[class*="StyledListItemTopBar"]');
    }
  }

  if (!bar) return;
  var toggle = bar.querySelector('button');
  if (toggle) toggle.click();
});

// ============================================================
// Lists with a limit ("max" in config.yml): hide the "Add" button once the
// list is full, so nobody adds an item that can't be saved. The button comes
// back if an item is deleted.
// ============================================================
(function () {
  var LIST_MAX = { features: 3 }; // keep in step with "max" in config.yml

  setInterval(function () {
    var labels = document.querySelectorAll('[class*="ControlPaneContainer"] label[for]');
    for (var i = 0; i < labels.length; i++) {
      var max = LIST_MAX[labels[i].htmlFor.replace(/-field-\d+$/, '')];
      if (!max) continue;
      var cc = labels[i].closest('[class*="ControlContainer"]');
      var bar = cc && cc.querySelector('[class*="TopBarContainer"]');
      if (!bar) continue;
      var count = parseInt(bar.textContent, 10) || 0; // the bar reads e.g. "3 feature boxes"
      var buttons = bar.querySelectorAll('button');
      for (var j = 0; j < buttons.length; j++) {
        if (/^\s*Add\b/i.test(buttons[j].textContent)) {
          buttons[j].style.display = count >= max ? 'none' : '';
        }
      }
    }
  }, 300);
})();
