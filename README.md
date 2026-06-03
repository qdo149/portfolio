# Quynh Do — Portfolio (GitHub Pages)

Static portfolio rebuilt from [quynhdo.ca](https://www.quynhdo.ca).

**Repo:** [github.com/qdo149/portfolio](https://github.com/qdo149/portfolio)  
**Live URL:** https://qdo149.github.io/portfolio/

## Local preview

```bash
npm run build
npm run preview
```

For a local build that matches GitHub Pages paths:

```bash
BASE_PATH=/portfolio npm run build
npm run preview
```

Open http://localhost:4173 (use `/portfolio/` paths when previewing the project-site build).

## Deploy

Pushes to `main` trigger the GitHub Actions workflow, which builds with `BASE_PATH=/portfolio` and deploys to Pages.

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (one-time).
2. Push to `main`:

```bash
git remote add origin https://github.com/qdo149/portfolio.git
git add .
git commit -m "Rebuild portfolio as static site from quynhdo.ca"
git push -u origin main
```

## Updating content

- Edit `src/data/site.json` (or re-run the WordPress export script).
- Change styles in `src/assets/css/main.css`.
- Run `npm run build` — output goes to `dist/`.

Images currently load from your WordPress CDN. To self-host, download assets into `src/assets/images/` and update URLs in `site.json`.

## Structure

- `src/data/site.json` — content (projects, about, links)
- `scripts/build.mjs` — generates HTML into `dist/`
- `.github/workflows/deploy.yml` — GitHub Pages deployment
