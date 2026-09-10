const statusTimers = new WeakMap();

function normalizeBibtex(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^[ \t]*/)[0].length);
  const shortest = indents.length > 0 ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(shortest)).join('\n');
}

function fallbackCopy(text) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.top = '-1000px';
  field.style.opacity = '0';
  document.body.appendChild(field);

  let copied = false;
  try {
    field.select();
    field.setSelectionRange(0, text.length);
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }

  field.remove();
  return copied;
}

function copyText(text) {
  if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallbackCopy(text));
  }

  return Promise.resolve(fallbackCopy(text));
}

function selectElementText(element) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

function showStatus(statusElement, message, isError) {
  if (!statusElement) {
    return;
  }

  window.clearTimeout(statusTimers.get(statusElement));
  statusElement.textContent = message;
  statusElement.classList.toggle('is-error', !!isError);

  statusTimers.set(
    statusElement,
    window.setTimeout(() => {
      statusElement.textContent = '';
      statusElement.classList.remove('is-error');
    }, 2000)
  );
}

function initPublicationFilters() {
  const filterButtons = document.querySelectorAll('.publication-filters .filter-button');
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
}

function initCitations() {
  const toggles = document.querySelectorAll('.cite-toggle');
  if (toggles.length === 0) {
    return;
  }

  // Strip the source indentation once so both the rendered block and the
  // copied text start flush-left.
  document.querySelectorAll('.cite-bibtex').forEach((block) => {
    block.textContent = normalizeBibtex(block.textContent);
  });

  toggles.forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    const caret = toggle.querySelector('.cite-caret');
    if (!panel) {
      return;
    }

    toggle.addEventListener('click', () => {
      const expanded = panel.classList.contains('is-hidden');
      panel.classList.toggle('is-hidden', !expanded);
      toggle.setAttribute('aria-expanded', String(expanded));

      if (caret) {
        caret.classList.toggle('fa-caret-down', !expanded);
        caret.classList.toggle('fa-caret-up', expanded);
      }
    });
  });

  document.querySelectorAll('.cite-copy:not(.cite-copy-all)').forEach((button) => {
    const panel = button.closest('.cite-panel');
    if (!panel) {
      return;
    }

    const block = panel.querySelector('.cite-bibtex');
    const status = panel.querySelector('.cite-status');
    if (!block) {
      return;
    }

    button.addEventListener('click', () => {
      copyText(block.textContent).then((copied) => {
        if (copied) {
          showStatus(status, 'Copied!');
          return;
        }

        selectElementText(block);
        showStatus(status, 'Press Ctrl+C to copy', true);
      });
    });
  });

  const copyAll = document.querySelector('.cite-copy-all');
  if (!copyAll) {
    return;
  }

  const copyAllStatus = document.getElementById('cite-status-all');

  copyAll.addEventListener('click', () => {
    const blocks = document.querySelectorAll('.publication-item:not(.is-hidden) .cite-bibtex');
    if (blocks.length === 0) {
      showStatus(copyAllStatus, 'Nothing to copy', true);
      return;
    }

    const combined = Array.from(blocks)
      .map((block) => block.textContent)
      .join('\n\n');

    copyText(combined).then((copied) => {
      showStatus(
        copyAllStatus,
        copied ? `Copied ${blocks.length} entries` : 'Copy failed',
        !copied
      );
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPublicationFilters();
  initCitations();
});
