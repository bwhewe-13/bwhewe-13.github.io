# bwhewe-13.github.io

Personal website at [ben-whewell.com](https://www.ben-whewell.com), built with Jekyll on
GitHub Pages.

## Pages

- index.html: home page (intro, research areas, news)
- resume.html: resume, with a link to the PDF in cv/
- research.html: publications and presentations, each with a copyable BibTeX entry
- research/: one overview page per research project
- projects.html: open-source projects
- rl_notes.html and rl_notes/: reinforcement learning notebooks
- 404.html: not-found page

## Structure

- _config.yml: site title, role, email, and profile links
- _layouts/default.html: the page shell every page uses
- _includes/: head, sidebar, footer, contact links, publication markup, and icons
- _data/publications.yml: every publication; research.html lists all of them and
  resume.html lists the journal articles
- _data/news.yml: news items on the home page
- _data/nav.yml: sidebar navigation
- css/styling.css: all styles, with colors defined as variables at the top
- js/research.js: publication filters and BibTeX copy buttons

GitHub Pages builds the site on push; jekyll-sitemap generates sitemap.xml.

## Local development

Build and serve with Docker (no local Ruby needed):

```sh
docker run --rm -it -p 4000:4000 -v "$PWD":/srv -w /srv ruby:3.2 \
  bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

Then visit http://localhost:4000.

## Common edits

- Adding a publication: add an entry to _data/publications.yml. `key` must be unique
  and match the BibTeX key. Set `request: true` to show a "Request a copy" link when
  there is no free version, and `preprint: true` to keep it off the resume.
- Adding a news item: add it to the top of _data/news.yml.
- Adding a notebook to RL Notes: convert it with
  `jupyter nbconvert --to html --template basic`, add front matter (see
  rl_notes/00_getting_started.html), wrap the output in `{% raw %}` / `{% endraw %}`,
  and add a card to rl_notes.html.
- Open Graph tags come from each page's `title` and `description` front matter; the
  preview image is figures/og-card.png (1200x630).
- Icons in _includes/icons/ are from Font Awesome Free 6.7.2 (CC BY 4.0).
