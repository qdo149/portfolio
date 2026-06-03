import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const site = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/site.json"), "utf8")
);

const basePath = process.env.BASE_PATH || "";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asset(p) {
  if (!basePath) return p;
  return `${basePath.replace(/\/$/, "")}${p}`;
}

function nav(active) {
  const items = [
    { href: asset("/"), label: "Home", id: "home" },
    { href: asset("/work/"), label: "UI/UX", id: "work" },
    { href: asset("/about/"), label: "About", id: "about" },
  ];
  return items
    .map(
      (i) =>
        `<a class="nav-link${active === i.id ? " is-active" : ""}" href="${i.href}">${esc(i.label)}</a>`
    )
    .join("\n        ");
}

function shell({ title, active, body, description = "" }) {
  const desc = description || site.hero.intro.slice(0, 160);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · ${esc(site.brand)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${asset("/assets/css/main.css")}" />
  <link rel="icon" href="${esc(site.assets.logo)}" />
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${asset("/")}">
      <img src="${esc(site.assets.logo)}" alt="${esc(site.brand)}" width="120" height="40" />
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      ${nav(active)}
      <a class="nav-link nav-cta" href="${esc(site.social.email)}">Contact</a>
    </nav>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer">
    <p>© ${new Date().getFullYear()} ${esc(site.name)}</p>
    <div class="footer-links">
      <a href="${esc(site.social.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="${esc(site.social.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="${esc(site.social.email)}">Email</a>
    </div>
  </footer>
  <script src="${asset("/assets/js/main.js")}" defer></script>
</body>
</html>`;
}

function projectCard(p) {
  const img = p.cardImage || p.thumb;
  return `
    <article class="project-card">
      <a href="${asset(`/work/${p.slug}/`)}" class="project-card-link">
        <div class="project-card-media"${img ? ` style="background-image:url('${esc(img)}')"` : ""}>
          <div class="project-card-overlay">
            <h3>${esc(p.title)}</h3>
            ${p.tagline ? `<p>${esc(p.tagline)}</p>` : ""}
          </div>
        </div>
      </a>
    </article>`;
}

function write(rel, html) {
  const out = path.join(dist, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

fs.cpSync(path.join(root, "src/assets"), path.join(dist, "assets"), { recursive: true });
fs.cpSync(path.join(root, "src/data"), path.join(dist, "data"), { recursive: true });

const homeBody = `
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${esc(site.brand)}</p>
          <h1>${esc(site.hero.greeting)}</h1>
          <p class="lead">${esc(site.hero.intro)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${asset("/work/")}">View UI/UX work</a>
            <a class="btn btn-ghost" href="${asset("/about/")}">About me</a>
          </div>
        </div>
        <div class="hero-visual">
          <img src="${esc(site.assets.avatar)}" alt="Portrait of ${esc(site.name)}" width="420" height="420" loading="eager" />
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <h2>Selected work</h2>
        <a class="text-link" href="${asset("/work/")}">See all →</a>
      </div>
      <div class="project-grid">
        ${site.projects.slice(0, 6).map(projectCard).join("")}
      </div>
    </section>`;

write("index.html", shell({ title: "Home", active: "home", body: homeBody }));

const workBody = `
    <section class="page-hero">
      <h1>UI/UX Design</h1>
      <p class="lead">Case studies and product design work across fintech, telecom, and member experiences.</p>
    </section>
    <section class="section">
      <div class="project-grid project-grid--work">
        ${site.projects.map(projectCard).join("")}
      </div>
    </section>`;

write("work/index.html", shell({ title: "UI/UX Design", active: "work", body: workBody }));

const aboutBody = `
    <section class="about-page">
      <div class="about-grid">
        <div class="about-visual">
          <img src="${esc(site.assets.avatar)}" alt="${esc(site.name)}" width="480" height="480" loading="lazy" />
        </div>
        <div class="about-copy">
          <h1>${esc(site.about.heading)}</h1>
          <p class="lead">${esc(site.about.bio)}</p>
          <h2>Let's talk!</h2>
          <p>Your email can find me drinking bubble tea at <a href="mailto:${esc(site.about.email)}">${esc(site.about.email)}</a></p>
          <div class="about-links">
            <a href="${esc(site.social.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="${esc(site.social.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </section>`;

write("about/index.html", shell({ title: "About", active: "about", body: aboutBody }));

for (const p of site.projects) {
  const summary = (p.summary || [])
    .map((para) => `<p>${esc(para)}</p>`)
    .join("\n          ");
  const gallery = (p.gallery || [])
    .slice(0, 9)
    .map(
      (src) =>
        `<figure class="gallery-item"><img src="${esc(src)}" alt="" loading="lazy" /></figure>`
    )
    .join("\n          ");

  const body = `
    <article class="case-study">
      <header class="case-header">
        <a class="back-link" href="${asset("/work/")}">← All work</a>
        <p class="eyebrow">Case study</p>
        <h1>${esc(p.title)}</h1>
        ${p.tagline ? `<p class="case-tagline">${esc(p.tagline)}</p>` : ""}
      </header>
      ${p.cardImage || p.thumb ? `<div class="case-hero"><img src="${esc(p.cardImage || p.thumb)}" alt="" /></div>` : ""}
      <div class="case-content prose">
        <h2>Overview</h2>
        ${summary || "<p>Content migrated from the live portfolio. More detail coming soon.</p>"}
        <p class="legacy-note">Originally published at <a href="${esc(p.legacyUrl)}" target="_blank" rel="noopener noreferrer">quynhdo.ca</a>.</p>
      </div>
      ${gallery ? `<section class="case-gallery"><div class="gallery-grid">${gallery}</div></section>` : ""}
    </article>`;

  write(
    `work/${p.slug}/index.html`,
    shell({
      title: p.title,
      active: "work",
      body,
      description: p.tagline || p.summary?.[0]?.slice(0, 160) || "",
    })
  );
}

console.log(`Built ${site.projects.length + 3} pages → dist/`);
