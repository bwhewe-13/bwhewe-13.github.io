# Public CV

`cv_ai_engineering.tex` is the source for `Ben_Whewell_CV.pdf`, the CV linked from
[resume.html](../resume.html). It is targeted at AI/ML engineering roles in industry:
summary, skills, achievement-oriented experience bullets, open-source projects, then a
short selected-publications list instead of the full academic record.

**It deliberately contains no phone number and no email address.** Visitors who need
contact details use the "Request the complete CV" link on the resume page. Keep it that
way — do not add direct contact information to the public version.

## Building

Requires `pdflatex` (TeX Live, MiKTeX, or TinyTeX) with `titlesec`, `enumitem`,
`microtype`, `geometry`, `hyperref`, `xcolor`, and `lmodern`.

```sh
cd cv
pdflatex -interaction=nonstopmode -jobname=Ben_Whewell_CV cv_ai_engineering.tex
```

A single pass is enough — there are no cross-references or bibliography. Commit the
regenerated `Ben_Whewell_CV.pdf`; the `.aux`/`.log`/`.out` files are gitignored.
