import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const site = JSON.parse(fs.readFileSync(path.join(root, "src/data/site.json"), "utf8"));
const basePath = process.env.BASE_PATH || "";
const meta = {
  nab:{sector:"Banking · Merchant services",year:"2025–2026",role:"Senior Product Designer",result:"Creating efficient merchant experiences for small businesses across Australia and New Zealand.",skills:["Service design","Accessibility","AI enablement"]},
  "rogers-bank":{sector:"Fintech · Newcomer credit",year:"2023–2024",role:"Product Designer",result:"A seamless credit-card application process designed for newcomers to Canada.",skills:["User research","Responsive UX","Prototyping"]},
  "shaw-direct":{sector:"Telecom · E-commerce",year:"2022–2023",role:"UI/UX Designer",result:"Improving Shaw Direct’s plan builder and digital buy-flow.",skills:["Product analytics","Experimentation","Design systems"]},
  "genex-member-portal":{sector:"Member platform · B2B",year:"2023",role:"Lead UI/UX Designer",result:"A member portal that brings product updates, promotions and community together.",skills:["Information architecture","Product roadmap","Community UX"]},
  "huey-lam-digital-tailor-shop":{sector:"E-commerce · Retail",year:"2020",role:"Product Designer",result:"Bringing a custom tailor-shop experience online without losing its personal touch.",skills:["Contextual research","E-commerce","Brand system"]}
};
const order=["nab","rogers-bank","shaw-direct","genex-member-portal","huey-lam-digital-tailor-shop"];
const projects=[...site.projects].sort((a,b)=>(order.indexOf(a.slug)<0?99:order.indexOf(a.slug))-(order.indexOf(b.slug)<0?99:order.indexOf(b.slug)));
const esc=(s="")=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const asset=(p)=>basePath?`${basePath.replace(/\/$/,"")}${p}`:p;
const clean=(src="")=>src.split(/\s+\d+w,/)[0].trim();
const write=(rel,html)=>{const out=path.join(dist,rel);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);};

function shell({title,active,body,description=site.hero.intro}){
  const links=[["home","/","Home"],["work","/work/","UI/UX Design"],["graphics","https://www.quynhdo.ca/graphics/","Graphic Design"],["about","/about/","About"]]
    .map(([id,href,label])=>`<a class="nav-link${active===id?" is-active":""}" href="${href.startsWith("http")?href:asset(href)}">${label}</a>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Quynh Do — Product Designer</title><meta name="description" content="${esc(description.slice(0,160))}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="${asset("/assets/css/main.css")}"><link rel="icon" href="${esc(site.assets.logo)}"></head><body><a class="skip-link" href="#content">Skip to content</a><header class="site-header"><a class="wordmark" href="${asset("/")}" aria-label="Quynh Do home"><img src="${esc(site.assets.logo)}" alt="qxyxhdodesign" width="100" height="65"></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" class="site-nav" aria-label="Main navigation">${links}</nav></header><main id="content">${body}</main><footer class="site-footer"><p>Let’s create something thoughtful together.</p><div class="footer-links"><a href="${esc(site.social.instagram)}" target="_blank" rel="noopener">Instagram</a><a href="${esc(site.social.linkedin)}" target="_blank" rel="noopener">LinkedIn</a><a href="${esc(site.social.email)}">Email</a></div><p class="copyright">© ${new Date().getFullYear()} Quynh Do</p></footer><script src="${asset("/assets/js/main.js")}" defer></script></body></html>`;
}

function card(p,index){
  const m=meta[p.slug]||{sector:"Product design",year:"",result:p.tagline};
  const img=clean(p.cardImage||p.thumb);
  return `<article class="project-card"><a href="${asset(`/work/${p.slug}/`)}" aria-label="View ${esc(p.title)} case study"><div class="project-media"${img?` style="background-image:url('${esc(img)}')"`:""}><span>${String(index+1).padStart(2,"0")}</span></div><div class="project-copy"><p class="meta">${esc(m.sector)}${m.year?` · ${esc(m.year)}`:""}</p><h3>${esc(p.title)}</h3><p>${esc(m.result)}</p><span class="case-link">View case study →</span></div></a></article>`;
}

fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
fs.cpSync(path.join(root,"src/assets"),path.join(dist,"assets"),{recursive:true});
const featured=projects.filter(p=>order.includes(p.slug));

const home=`<section class="hero"><img class="hero-avatar" src="${esc(site.assets.avatar)}" alt="Quynh Do" width="220" height="220"><h1>${esc(site.hero.greeting)}</h1><p>${esc(site.hero.intro)}</p><div class="hero-actions"><a class="button button--solid" href="${asset("/work/")}">UI/UX Projects</a><a class="button" href="https://www.quynhdo.ca/graphics/">Graphic Work</a></div><div class="hero-social"><a href="${esc(site.social.instagram)}">Instagram</a><a href="${esc(site.social.linkedin)}">LinkedIn</a><a href="${esc(site.social.email)}">Email</a></div></section><section class="work-section"><header class="section-title"><p>Selected work</p><h2>Product and UX design</h2><p>A collection of digital experiences shaped by research, collaboration and visual craft.</p></header><div class="project-grid">${featured.map((p,i)=>card(p,i)).join("")}</div></section>`;
write("index.html",shell({title:"Product Designer",active:"home",body:home}));

const work=`<section class="page-intro"><p class="eyebrow">UI/UX Design</p><h1>Selected work</h1><p>Digital experiences across banking, fintech, telecom and member services.</p></section><section class="work-section work-index"><div class="project-grid">${featured.map((p,i)=>card(p,i)).join("")}</div></section>`;
write("work/index.html",shell({title:"UI/UX Design",active:"work",body:work}));

const about=`<section class="about-hero"><div class="about-image"><img src="${esc(site.assets.avatar)}" alt="Quynh Do" width="560" height="680"></div><div class="about-copy"><p class="eyebrow">About me</p><h1>${esc(site.about.heading)}</h1><p class="about-lead">${esc(site.about.bio)}</p><p>I’m currently pursuing a software engineering program to deepen my technical understanding and bring an even stronger perspective to the way I design and collaborate.</p><a class="text-link" href="mailto:${esc(site.about.email)}">${esc(site.about.email)} →</a></div></section>`;
write("about/index.html",shell({title:"About",active:"about",body:about}));

for(const p of projects){
  const m=meta[p.slug]||{sector:"Product design",year:"",role:"Product Designer",result:p.tagline,skills:[]};
  const paras=(p.summary||[]).map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean);
  const gallery=(p.gallery||[]).map(clean).filter((x,i,a)=>x&&a.indexOf(x)===i).slice(0,8);
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  const body=`<article class="case-study"><header class="case-header"><a class="back-link" href="${asset("/work/")}">← UI/UX Design</a><p class="eyebrow">${esc(m.sector)}</p><h1>${esc(p.title)}</h1><p class="case-tagline">${esc(p.tagline||m.result)}</p><div class="case-facts"><div><span>Role</span><strong>${esc(m.role)}</strong></div><div><span>Timeline</span><strong>${esc(m.year)}</strong></div><div><span>Skills</span><strong>${esc((m.skills||[]).join(" · ")||"Product design")}</strong></div></div></header>${p.cardImage||p.thumb?`<figure class="case-hero"><img src="${esc(clean(p.cardImage||p.thumb))}" alt="${esc(p.title)} project overview"></figure>`:""}<section class="case-summary"><p class="eyebrow">Overview</p><h2>${esc(m.result)}</h2><div class="prose">${paras.map((x,i)=>`<p${i===0?' class="lead-paragraph"':""}>${esc(x)}</p>`).join("")||"<p>This project is being prepared for a fuller write-up.</p>"}</div></section>${gallery.length?`<section class="case-gallery"><p class="eyebrow">Selected work</p><div class="gallery-grid">${gallery.map((src,i)=>`<figure class="gallery-item${i===0?" gallery-item--wide":""}"><img src="${esc(src)}" alt="${esc(p.title)} design artifact ${i+1}" loading="lazy"></figure>`).join("")}</div></section>`:""}<nav class="next-project"><span>Next project</span><a href="${asset(`/work/${next.slug}/`)}">${esc(next.title)} →</a></nav></article>`;
  write(`work/${p.slug}/index.html`,shell({title:p.title,active:"work",body,description:m.result}));
}
console.log(`Built ${projects.length+3} pages → dist/`);
