# bwhewe-13.github.io

Personal website hosted on GitHub Pages. Includes landing page, projects, research, and resume sections, plus shared sidebar partials and site-wide styles.

## Pages

- index.html: landing/home page
- projects.html: projects listing
- research.html: research overview
- resume.html: resume page

## Structure

- styling.css: global styles
- js/: page-level scripts
- partials/: shared HTML snippets (sidebar)
- figures/: images and media assets

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
- Keep paths relative to support GitHub Pages hosting.
