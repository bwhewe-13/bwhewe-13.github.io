document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-button');
  const publicationItems = document.querySelectorAll('.publication-item');
  const sectionHeadings = document.querySelectorAll('.publication-section');

  if (filterButtons.length === 0 || publicationItems.length === 0) {
    return;
  }

  function updateSectionVisibility(activeFilter) {
    if (sectionHeadings.length === 0) {
      return;
    }

    sectionHeadings.forEach((heading) => {
      const category = heading.getAttribute('data-category');
      const matchingItems = Array.from(publicationItems).filter((item) => {
        if (activeFilter === 'all') {
          return item.getAttribute('data-category') === category;
        }
        return item.getAttribute('data-category') === activeFilter && category === activeFilter;
      });

      if (activeFilter === 'all') {
        heading.classList.remove('is-hidden');
        return;
      }

      heading.classList.toggle('is-hidden', matchingItems.length === 0);
    });
  }

  function applyFilter(activeFilter) {
    publicationItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      const shouldShow = activeFilter === 'all' || category === activeFilter;
      item.classList.toggle('is-hidden', !shouldShow);
    });

    updateSectionVisibility(activeFilter);
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
