function toggleSection(sectionId) {
  const content = document.getElementById(sectionId + '-content');
  const icon = document.getElementById(sectionId + '-icon');

  if (!content || !icon) {
    return;
  }

  content.classList.toggle('collapsed');
  icon.classList.toggle('fa-caret-down');
  icon.classList.toggle('fa-caret-up');
}
