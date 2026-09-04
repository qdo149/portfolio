import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const pages = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    if (e.isDirectory()) walk(path.join(dir,e.name));
    else if(e.name.endsWith('.html')) pages.push(path.join(dir,e.name));
  }
}
walk(root);
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(homepage.includes('class="hero-avatar"'), 'Homepage includes original avatar');
assert(homepage.includes('data-typewriter'), 'Homepage includes typing greeting');
assert(!homepage.includes('<h2>Graphic Design</h2>'), 'No graphic design section on homepage');
assert(homepage.includes('Selected Work'), 'Homepage keeps product and UX projects');
let links = 0;
for (const page of pages) {
  const html = fs.readFileSync(page,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${page}: one main heading`);
  assert(!/undefined|\[object Object\]/.test(html),`${page}: unresolved content`);
  for (const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(mailto:|https?:)/.test(href) && !(base && href.startsWith(base+'/'))) continue;
    const normalized = base && href.startsWith(base) ? href.slice(base.length) : href;
    const [pathname, hash] = normalized.split('#');
    const relative = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    let target = pathname === '/' ? path.join(root,'index.html') : relative ? path.resolve(pathname.startsWith('/')?root:path.dirname(page),relative) : page;
    if (relative && !path.extname(target)) target=path.join(target,'index.html');
    assert(target.startsWith(root), 'Route escaped output');
    assert(fs.existsSync(target),`Missing target ${href} in ${page}`);
    if (hash) assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Missing anchor ${href}`);
    links++;
  }
}
for (const slug of ['nab','rogers-bank','shaw-direct','genex-member-portal','huey-lam-digital-tailor-shop','rogers-together-with-shaw','genex','rau-bistro','urus']) {
  assert(fs.existsSync(path.join(root,'work',slug,'index.html')));
}
const graphics=fs.readFileSync(path.join(root,'graphics/index.html'),'utf8');
assert.equal((graphics.match(/data-carousel-dot=/g)||[]).length,10);
assert.equal((graphics.match(/graphic-card/g)||[]).length,10);
const genex=fs.readFileSync(path.join(root,'work/genex/index.html'),'utf8');
for(const section of ['Overview','The problem','Process','Visuals','Outcomes']) assert(genex.includes(section));
console.log(`PASS: ${pages.length} pages, ${links} local links/assets, 10 carousel cards, Figma case-study sections.`);
