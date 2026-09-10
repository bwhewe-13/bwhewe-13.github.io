# bwhewe-13.github.io

Personal website hosted on GitHub Pages. Includes landing page, projects, research, and resume sections, plus shared sidebar partials and site-wide styles.

## Pages

- index.html: landing/home page
- projects.html: projects listing
- research.html: publications and presentations, each with a copyable BibTeX entry
- resume.html: resume page
- rl_notes.html: reinforcement learning notes index
- 404.html: not-found page (GitHub Pages serves it at the requested path, so its asset paths are root-absolute)

## Structure

- styling.css: global styles
- js/: page-level scripts
- partials/: shared HTML snippets (sidebar)
- figures/: images and media assets
- sitemap.xml, robots.txt: search engine discovery

## Local development

Open any HTML file directly in a browser, or use a simple static server for better routing and caching behavior.

Example (PowerShell):

```sh
python -m http.server 8000
```

Then visit:

```
http://localhost:8000
```

## Deployment

This repository is designed for GitHub Pages. Push to the default branch and GitHub Pages will serve the site at the repository URL.

## Notes

- Update shared navigation in partials/sidebar.html.
- Keep paths relative to support GitHub Pages hosting (404.html is the exception).
- Adding a publication: copy an existing block in research.html, then give it a
  citation key used in both the BibTeX and the panel's `id` (as `bib-<key>`).
  Write the BibTeX flush-left inside the `<pre>`. Note that `--` is invalid
  inside an HTML comment, so commented-out entries must not use page ranges.
- Open Graph tags are per-page and use absolute URLs; the preview image is
  figures/og-card.png (1200x630).
