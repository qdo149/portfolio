import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createComponents } from "./figma-components.mjs";
import { projects as figmaProjects } from "../src/data/figma-projects.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const site = JSON.parse(fs.readFileSync(path.join(root, "src/data/site.json"), "utf8"));
const basePath = process.env.BASE_PATH || "";
const meta = {
  nab:{sector:"Banking · Merchant services",year:"2025–2026",role:"Senior Product Designer",result:"Creating efficient merchant experiences for small businesses across Australia and New Zealand.",skills:["Service design","Accessibility","AI enablement"]},
  "rogers-bank":{sector:"Fintech · Newcomer credit",year:"2023–2024",role:"Product Designer",result:"A seamless credit-card application process designed for newcomers to Canada.",skills:["User research","Responsive UX","Prototyping"]},
  "shaw-direct":{sector:"Telecom · E-commerce",year:"2022–2023",role:"UI/UX Designer",result:"Improving Shaw Direct’s plan builder and digital buy-flow.",skills:["Product analytics","Experimentation","Design systems"]},
  "genex-member-portal":{sector:"Member platform · B2B",year:"2023",role:"Lead UI/UX Designer",result:"A member portal that brings product updates, promotions and community together.",skills:["Information architecture","Product roadmap","Community UX"]},
  "huey-lam-digital-tailor-shop":{sector:"E-commerce · Retail",year:"2020",role:"Product Designer",result:"Bringing a custom tailor-shop experience online without losing its personal touch.",skills:["Contextual research","E-commerce","Brand system"]},
  "rogers-together-with-shaw":{sector:"Telecom · Digital experience",year:"2023–2024",role:"UI/UX Designer",result:"Product landing pages, campaign experiences and design-system contributions across Shaw and Rogers.",skills:["Visual design","Design systems","Responsive UX"]}
};
const order=["nab","rogers-bank","shaw-direct","genex-member-portal","huey-lam-digital-tailor-shop","rogers-together-with-shaw"];
const projects=[...site.projects].sort((a,b)=>(order.indexOf(a.slug)<0?99:order.indexOf(a.slug))-(order.indexOf(b.slug)<0?99:order.indexOf(b.slug)));
const esc=(s="")=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const asset=(p)=>{const base=p.startsWith("/assets/")?(process.env.ASSET_BASE_PATH||basePath):basePath;return base?`${base.replace(/\/$/,"")}${p}`:p;};
const clean=(src="")=>src.split(/\s+\d+w,/)[0].trim();
const write=(rel,html)=>{
  if(process.env.RELATIVE_URLS === "1") {
    html=html.replace(/(href|src)="\/(?!\/)([^"]*)"/g,(_,attribute,url)=>{
      const [pathname,hash] = url.split("#");
      let target=path.posix.relative(path.posix.dirname(rel),pathname||".")||".";
      if(!path.posix.extname(pathname)) target=target.replace(/\/$/,"")+"/";
      return `${attribute}="${target}${hash?'#'+hash:''}"`;
    });
  }
  const out=path.join(dist,rel);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);
};

const graphicProjects=[
  {slug:"genex-marketing",title:"GENEX",type:"Marketing graphic design",image:"https://www.quynhdo.ca/wp-content/uploads/2024/10/Front-GENEX.jpg",summary:"Marketing campaigns and visual systems for a global cooperative providing genetic and reproductive solutions to dairy and beef producers.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2023/03/URUS-4.png","https://www.quynhdo.ca/wp-content/uploads/2023/03/URUS-3-768x576.png"]},
  {slug:"rau-bistro",title:"Rau Bistro Vietnamese Street Food",type:"Branding · Visual design · Photography",image:"https://www.quynhdo.ca/wp-content/uploads/2024/10/Front-rau.jpg",summary:"A modernized identity combining Vietnamese cultural roots, an urban restaurant experience and an earthy visual direction.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2024/09/raubistro-new-03-1536x1280.jpg","https://www.quynhdo.ca/wp-content/uploads/2021/04/020217food4-768x576.jpeg"]},
  {slug:"urus",title:"URUS",type:"Corporate communication materials",image:"https://www.quynhdo.ca/wp-content/uploads/2025/02/home-URUS.jpg",summary:"Internal and external communications spanning global leadership events, email campaigns, newsletters and corporate-giving initiatives.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2025/02/Y-8155650721-URUS-Leadership-Conference-Theme_QD_Page_3-1536x1187.jpg","https://www.quynhdo.ca/wp-content/uploads/2025/02/Y-4804806957-URUS-2023-Holiday-ideas_URUS-Giving-Storyboard-scaled.jpg","https://www.quynhdo.ca/wp-content/uploads/2025/02/Y-4804806957-URUS-2023-Holiday-ideas_URUS-Giving-Storyboard4-scaled.jpg"]},
  {slug:"agricultural-companies",title:"Agricultural Companies",type:"Marketing collection",image:"https://www.quynhdo.ca/wp-content/uploads/2025/02/home-companies.jpg",summary:"A collection of campaign and communication design created for companies across the agriculture industry.",gallery:[]},
  {slug:"cozy-houses",title:"Cozy Houses",type:"Logo design",image:"https://www.quynhdo.ca/wp-content/uploads/2024/03/cozyhouses.png",summary:"A warm, approachable logo identity designed for a residential brand.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2024/04/Cozy-House-2.png"]},
  {slug:"blue-yolk",title:"Blue Yolk",type:"Logo design",image:"https://www.quynhdo.ca/wp-content/uploads/2021/05/blueyolk.jpg",summary:"A playful visual identity balancing bold colour, memorable form and friendly brand character.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2024/04/blue-yolk-final-logo.gif"]},
  {slug:"rrufa",title:"Royal Roads University Faculty Association",type:"Logo design",image:"https://www.quynhdo.ca/wp-content/uploads/2024/03/RRUFA.png",summary:"A clear institutional identity created for the Royal Roads University Faculty Association.",gallery:["https://www.quynhdo.ca/wp-content/uploads/2024/04/logo.png"]},
  {slug:"sunset-glass",title:"Sunset Glass",type:"Illustration work",image:"https://www.quynhdo.ca/wp-content/uploads/2020/11/gradient-mesh.jpg",summary:"An illustration study exploring transparency, colour transitions and atmospheric light.",gallery:[]},
  {slug:"emergency-love",title:"Emergency Love",type:"Digital drawing",image:"https://www.quynhdo.ca/wp-content/uploads/2021/04/scene-2.jpg",summary:"A digital illustration focused on character, emotion and cinematic composition.",gallery:[]},
  {slug:"transparency",title:"Transparency",type:"Illustration work",image:"https://www.quynhdo.ca/wp-content/uploads/2020/11/do_quynh_transparency.jpg",summary:"An experimental illustration using layered shapes and transparency to create depth.",gallery:[]}
];

const ui = createComponents({ asset, esc, site });
const productItems = projects.map(p => {
  const m = meta[p.slug] || {sector:"Product design",year:"",role:"Product Designer",result:p.tagline,skills:[]};
  return {...p, href:`/work/${p.slug}/`, category:m.sector, year:m.year, role:m.role,
    image:clean(p.cardImage||p.thumb), description:m.result, overview:m.result, tags:m.skills,
    gallery:(p.gallery||[]).map(clean).filter((x,i,a)=>x&&a.indexOf(x)===i).slice(0,8).map(src=>({src})),
    summary:(p.summary||[]).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean)};
});
const graphicItems = graphicProjects.map(p => {
  const imported = figmaProjects.find(f=>f.slug === (p.slug === "genex-marketing" ? "genex" : p.slug));
  if(imported) return {...imported, slug:p.slug, href:`/graphics/${p.slug}/`};
  return {...p, href:`/graphics/${p.slug}/`, category:p.type, role:"Graphic Designer",
    description:p.summary, overview:p.summary, tags:p.type.split(" · "),
    gallery:[p.image,...p.gallery].filter((s,i,a)=>s&&a.indexOf(s)===i).map(src=>({src}))};
});
const featured = productItems.filter(p=>order.includes(p.slug));
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
fs.cpSync(path.join(root,"src/assets"),path.join(dist,"assets"),{recursive:true});

write("index.html",ui.shell({title:"Product & Visual Designer",active:"home",body:ui.home({
  productCards:featured.slice(0,3).map((p,i)=>ui.card(p,{featured:i===0})).join(""),
  graphicCards:["rau-bistro","genex-marketing","urus"].map((slug,i)=>ui.card(graphicItems.find(p=>p.slug===slug),{featured:i===0})).join("")
})}));
write("work/index.html",ui.shell({title:"UI/UX Design",active:"work",body:
  ui.indexIntro("UI/UX Design","Selected work","Digital experiences across banking, fintech, telecom and member services.")+
  `<section class="work-section work-index container"><div class="project-grid">${featured.map((p,i)=>ui.card(p,{featured:i===0})).join("")}</div></section>`+ui.contact()
}));
write("about/index.html",ui.shell({title:"About",active:"about",body:
  ui.indexIntro("About","Creativity meets functionality.","A product designer with graphic design roots.")+
  `<section class="about-section container">${ui.aboutContent()}</section>`+ui.contact()
}));
const carousel=`<section class="graphics-section container"><div class="graphics-carousel-shell" data-carousel><div class="graphics-carousel-stage"><button class="carousel-button carousel-button--previous" type="button" data-carousel-prev aria-label="Previous graphic design project">←</button><div class="graphics-carousel" data-carousel-track tabindex="0" aria-label="Graphic design projects">${graphicItems.map(p=>ui.card(p,{graphic:true})).join("")}</div><button class="carousel-button carousel-button--next" type="button" data-carousel-next aria-label="Next graphic design project">→</button></div><div class="carousel-pagination" aria-label="Choose a graphic design project">${graphicItems.map((p,i)=>`<button class="carousel-dot${i===0?" is-active":""}" type="button" data-carousel-dot="${i}" aria-label="View ${esc(p.title)}"${i===0?' aria-current="true"':""}></button>`).join("")}</div></div></section>`;
write("graphics/index.html",ui.shell({title:"Graphic Design",active:"graphics",body:
  ui.indexIntro("Graphic Design","Visual stories.","Branding, campaigns, photography and illustration for companies and local businesses.")+carousel+ui.contact()
}));

for(const [items,active,backHref,backLabel] of [[productItems,"work","/work/","UI/UX Design"],[graphicItems,"graphics","/graphics/","Graphic Design"]]){
  items.forEach((p,i)=>{
    const body=ui.caseStudy(p,{prev:items[(i-1+items.length)%items.length],next:items[(i+1)%items.length],backHref,backLabel});
    const html=ui.shell({title:p.title,active,body,description:p.overview});
    write(p.href.slice(1)+"index.html",html);
    // Preserve the Figma Make URLs alongside the existing graphic project URLs.
    if(active==="graphics" && ["genex-marketing","rau-bistro","urus"].includes(p.slug)){
      write(`work/${p.slug==="genex-marketing"?"genex":p.slug}/index.html`,html);
    }
  });
}
console.log(`Built ${productItems.length+graphicItems.length+7} pages → dist/`);
