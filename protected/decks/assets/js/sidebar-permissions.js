// protected/decks/assets/js/sidebar-permissions.js

function restrictSidebar() {
  const allowedStr = sessionStorage.getItem('allowedDecks');

  if (!allowedStr) {
    console.warn('No permissions found – redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  if (allowedStr.trim() === 'All') {
    // Show all items
    document.querySelectorAll('#sidebar-nav li[data-deck]').forEach(li => {
      li.style.display = '';
    });
    return;
  }

  const allowed = allowedStr.split(',').map(s => s.trim());

  document.querySelectorAll('#sidebar-nav li[data-deck]').forEach(li => {
    const deck = li.getAttribute('data-deck');
    li.style.display = allowed.includes(deck) ? '' : 'none';
  });
}

// Run on every page load
document.addEventListener('DOMContentLoaded', restrictSidebar);