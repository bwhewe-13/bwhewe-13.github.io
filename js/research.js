document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-button');
  const publicationItems = document.querySelectorAll('.publication-item');

  if (filterButtons.length === 0 || publicationItems.length === 0) {
    return;
  }

  function applyFilter(activeFilter) {
    publicationItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      const shouldShow = activeFilter === 'all' || category === activeFilter;
      item.classList.toggle('is-hidden', !shouldShow);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((other) => other.classList.remove('active'));
      button.classList.add('active');
      applyFilter(button.getAttribute('data-filter'));
    });
  });

  applyFilter('all');
});
