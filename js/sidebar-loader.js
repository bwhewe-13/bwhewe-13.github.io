document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) {
    return;
  }

  fetch('partials/sidebar.html')
    .then((response) => response.text())
    .then((html) => {
      placeholder.innerHTML = html;

      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const links = placeholder.querySelectorAll('.sidebar a[href]');

      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) {
          return;
        }

        if (href === currentPage) {
          link.classList.add('active');
        }
      });
    })
    .catch((error) => {
      console.error('Failed to load sidebar:', error);
    });
});
