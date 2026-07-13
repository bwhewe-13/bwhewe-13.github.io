function toggleSection(sectionId) {
  const content = document.getElementById(sectionId + '-content');
  const icon = document.getElementById(sectionId + '-icon');

  if (!content || !icon) {
    return;
  }

  content.classList.toggle('collapsed');
  icon.classList.toggle('fa-caret-down');
  icon.classList.toggle('fa-caret-up');

  const header = document.querySelector(`#${sectionId} .section-header.collapsible`);
  if (header) {
    header.setAttribute('aria-expanded', String(!content.classList.contains('collapsed')));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section-header.collapsible').forEach((header) => {
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        header.click();
      }
    });
  });
});
