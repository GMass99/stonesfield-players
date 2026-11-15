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
