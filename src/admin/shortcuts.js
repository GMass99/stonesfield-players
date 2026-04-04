// Auto-skip the intermediate list page for single-file collections.
// When clicking "Home" in the sidebar, Decap goes to #/collections/home
// which shows a list with one entry. This script detects that and
// redirects straight to the editor.

(function() {
  // Map collection names to their single file entry names
  var singleFileCollections = {
    'home': 'home',
    'contact': 'contact',
    'settings': 'site'
  };

  var lastHash = '';

  function checkAndRedirect() {
    var hash = window.location.hash;
    if (hash === lastHash) return;
    lastHash = hash;

    // Match #/collections/collectionName (but NOT #/collections/collectionName/entries/...)
    var match = hash.match(/^#\/collections\/([^/]+)$/);
    if (match) {
      var collection = match[1];
      if (singleFileCollections[collection]) {
        window.location.hash = '#/collections/' + collection + '/entries/' + singleFileCollections[collection];
      }
    }
  }

  // Check on hash change and periodically (for initial load)
  window.addEventListener('hashchange', checkAndRedirect);
  setInterval(checkAndRedirect, 300);
})();
