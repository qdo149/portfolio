// Shared static components adapted from the user-supplied Figma Make export.
// Keep native links and existing routes rather than adding a second app runtime.
export function createComponents({ asset, esc, site }) {
  const tags = (items = []) => `<ul class="tag-list" aria-label="Project skills">${items.map(tag => `<li>${esc(tag)}</li>`).join("")}</ul>`;
  const socials = () => `<a href="${esc(site.social.linkedin)}" target="_blank" rel="noopener">LinkedIn</a><a href="${esc(site.social.instagram)}" target="_blank" rel="noopener">Instagram</a><a href="${esc(site.social.email)}">Email</a>`;
  const liveEmphasis = {
    "rogers-bank":["Those unfamiliar with the Canadian credit system:","Those aware of credit but uncertain about building credit in Canada:","Mobile-optimized design:","Simplified forms:","August 2024","Have the UXR team conduct user testing","Track key metrics"],
    "shaw-direct":["5.60% of customers exit the plan builder interface to revisit the packages page after their initial view.","Adding an edit block below the block indicating the package has been added","Adding a navigate link below the \"Added\" block","Shorten the header and ensure the sub-head text appears on a single line","Consider removing or resizing the “Back to shopping” buton","Explore replacing the “Add” CTAs with another design element","Implement a progress tracker for channel selection:","Revamp the channel selection interface with a counter:","Progressive Disclosure:","Feedback and Visibility of System Status:","Consistency:"],
    "genex-member-portal":["Member Profiles:","News and Updates Section:","Community Forum:","Event Registration:","Modern, User-Friendly Design:","Responsive Design:","user satisfaction rate of over 85%.","20% increase in member engagement."],
    "rogers-together-with-shaw":["UI/UX design","layout creation","photography selection","Self Protect","Home Security","MyShaw","removing redundant components","personalized messaging","easy navigation links"]
  };

  const inlineRichText = (p,text="") => {
    const source=String(text).trim();
    const phrases=[...(liveEmphasis[p.slug]||[])];
    const lead=source.match(/^([^.!?]{1,60}:)\s+.+/)?.[1];
    if(lead&&!phrases.includes(lead)) phrases.push(lead);
    const matches=[];
    phrases.sort((a,b)=>b.length-a.length).forEach(phrase=>{
      let start=0,index;
      while((index=source.indexOf(phrase,start))!==-1){
        if(!matches.some(match=>index<match.end&&index+phrase.length>match.start)) matches.push({start:index,end:index+phrase.length});
        start=index+phrase.length;
      }
    });
    if(!matches.length) return esc(source);
    matches.sort((a,b)=>a.start-b.start);
    let cursor=0,html='';
    matches.forEach(match=>{html+=esc(source.slice(cursor,match.start))+`<strong>${esc(source.slice(match.start,match.end))}</strong>`;cursor=match.end;});
    return html+esc(source.slice(cursor));
  };

  const richBlocks = (p,text="") => String(text).split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean).map(part=>{
    const lines=part.split(/\n/).map(line=>line.trim()).filter(Boolean);
    if(lines.length>1&&lines.every(line=>line.startsWith('•'))) return `<ul>${lines.map(line=>`<li>${inlineRichText(p,line.replace(/^•\s*/,''))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(line=>inlineRichText(p,line)).join('<br>')}</p>`;
  }).join('');

  const overviewContent = p => {
    const labels=/^(Background|Company Background|Role|Team|Teams|Timeline|Skills?|Scope)$/i;
    const tokens=(p.summary?.length?p.summary:[p.overview]).filter(Boolean).flatMap(text=>String(text).split(/\n+/).map(line=>line.trim()).filter(Boolean));
    let html='';
    for(let i=0;i<tokens.length;i++){
      const token=tokens[i];
      if(token.startsWith('•')){
        const items=[];
        while(i<tokens.length&&tokens[i].startsWith('•')){items.push(tokens[i].replace(/^•\s*/,''));i++;}
        i--;
        html+=`<ul class="overview-list">${items.map(item=>`<li>${inlineRichText(p,item)}</li>`).join('')}</ul>`;
      }else if(labels.test(token)){
        const next=tokens[i+1];
        if(next&&!labels.test(next)&&!next.startsWith('•')){html+=`<p><strong>${esc(token)}:</strong> ${inlineRichText(p,next)}</p>`;i++;}
        else html+=`<p class="overview-label"><strong>${esc(token)}:</strong></p>`;
      }else html+=`<p>${inlineRichText(p,token)}</p>`;
    }
    return html;
  };

  function shell({ title, active, body, description = site.hero.intro }) {
    const links = [["work", "/work/", "UI/UX Design"], ["graphics", "/graphics/", "Graphic Design"], ["about", "/about/", "About"]];
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Quynh Do</title><meta name="description" content="${esc(description.slice(0,160))}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="${asset('/assets/css/main.css')}"><link rel="icon" href="${esc(site.assets.logo)}"></head><body><a class="skip-link" href="#content">Skip to content</a><header class="site-header"><div class="header-inner"><a class="wordmark" href="${asset('/')}">Quynh Do</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav class="site-nav" id="site-nav" aria-label="Main navigation">${links.map(([id,href,label])=>`<a class="nav-link${active===id?' is-active':''}" ${active===id?'aria-current="page"':''} href="${asset(href)}">${label}</a>`).join('')}<a class="nav-link" href="${asset('/#contact')}">Contact</a></nav><a class="availability" href="${esc(site.social.linkedin)}" target="_blank" rel="noopener"><span aria-hidden="true"></span>Available for work</a></div></header><main id="content">${body}</main><footer class="site-footer container"><p>© ${new Date().getFullYear()} Quynh Do</p><div class="footer-links">${socials()}</div></footer><script src="${asset('/assets/js/main.js')}" defer></script></body></html>`;
  }

  function card(p, { graphic = false, featured = false } = {}) {
    return `<article class="project-card${graphic?' graphic-card':''}${featured?' project-card--featured':''}"${p.bg?` style="--project-bg:${esc(p.bg)}"`:''}><a href="${asset(p.href)}"><div class="project-media"><img src="${esc(p.image)}" alt="${esc(p.title)} project" loading="lazy" width="960" height="640"></div><div class="project-copy"><p class="meta">${esc(p.category)}${p.year?' · '+esc(p.year):''}</p><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${tags(p.tags)}<span class="case-link">View project</span></div></a></article>`;
  }

  function contact() {
    return `<section id="contact" class="contact-section container"><div class="contact-card"><div><p class="eyebrow">Let's connect</p><h2>Grab a virtual<br>bubble tea?</h2><p>Whether it’s a product that needs design thinking, a brand identity, or just a conversation — I’d love to connect.</p></div><a class="button button--solid" href="${esc(site.social.email)}">Say hello</a></div></section>`;
  }

  function aboutContent() {
    return `<div class="about-grid"><div><h2>At the intersection of creativity and functionality.</h2><div class="prose"><p>${esc(site.about.bio)}</p><p>My graphic design background gives my product work a level of visual precision that’s hard to retrofit — I care as much about how something looks as how it works.</p><p>I’m currently studying software engineering to strengthen my technical foundation and expand my impact as a product designer.</p></div><div class="social-pills">${socials()}</div></div><figure class="about-portrait"><img src="${asset(site.assets.about || site.assets.avatar)}" alt="Illustrated portrait of Quynh Do outside the Fairmont Palliser" width="1024" height="683" loading="lazy"><figcaption><span>Currently</span>Open to opportunities</figcaption></figure></div>`;
  }

  function home({ productCards }) {
    return `<section class="hero hero--intro container"><img class="hero-avatar" src="${esc(site.assets.avatar)}" alt="Quynh Do" width="200" height="200" fetchpriority="high"><p class="eyebrow">Product & UX designer</p><h1 aria-label="${esc(site.hero.greeting)}"><span class="typing-reserve" aria-hidden="true">${esc(site.hero.greeting)}</span><span class="typing-display" data-typewriter aria-hidden="true">${esc(site.hero.greeting)}</span></h1><div class="hero-bottom"><p>${esc(site.hero.intro)}</p><div class="hero-actions"><a class="button" href="${asset('/work/')}">UI/UX projects</a><a class="text-link" href="#contact">Let's connect</a></div></div><a class="scroll-cue" href="#work">Scroll to explore</a></section><section id="work" class="work-section container"><header class="section-title"><h2>Selected Work</h2><p>Product & UX design</p></header><div class="project-grid">${productCards}</div><a class="text-link section-link" href="${asset('/work/')}">Explore all UI/UX projects</a></section><section id="about" class="about-section container"><header class="section-title"><h2>About</h2></header>${aboutContent()}</section>${contact()}`;
  }

  function indexIntro(label, title, description) {
    return `<section class="page-intro container"><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1><p>${esc(description)}</p></section>`;
  }

  function caseStudy(p, { prev, next, backHref = '/work/', backLabel = 'UI/UX Design' } = {}) {
    const gallery = p.gallery || [];
    const blocks = [];
    if (p.legacyBlocks?.length) {
      blocks.push(`<section class="case-section case-overview"><h2 class="eyebrow">Overview</h2><div class="prose">${overviewContent(p)}</div></section>`);
    } else {
      if (p.overview) blocks.push(`<section class="case-section case-overview"><h2 class="eyebrow">Overview</h2><p class="case-lead">${esc(p.overview)}</p></section>`);
      if (p.problem) blocks.push(`<section class="case-section"><h2 class="eyebrow">The problem</h2><div class="prose"><p>${esc(p.problem)}</p></div></section>`);
      if (Array.isArray(p.summary) && p.summary.length) blocks.push(`<section class="case-section"><h2 class="eyebrow">Project details</h2><div class="prose">${p.summary.map(t=>`<p>${esc(t)}</p>`).join('')}</div></section>`);
    }
    if (p.legacyBlocks?.length) {
      const figure = block => `<figure class="legacy-visual"><img src="${esc(block.src)}" alt="${esc(block.alt || p.title + ' project visual')}" loading="lazy">${block.alt?`<figcaption>${esc(block.alt)}</figcaption>`:''}</figure>`;
      const paragraph = block => richBlocks(p,block.text);
      const genexLayout = () => {
        const source = p.legacyBlocks;
        const at = heading => source.findIndex(block => block.type === 'h2' && block.text.replace(/\s+/g,' ').trim() === heading);
        const section = (heading, nextHeading) => source.slice(at(heading) + 1, nextHeading ? at(nextHeading) : source.length);
        const standard = (heading, nextHeading) => {
          let listOpen = false;
          const body = section(heading, nextHeading).map(block => {
            let html = '';
            if (block.type !== 'li' && listOpen) { html += '</ul>'; listOpen = false; }
            if (block.type === 'image') return html + figure(block);
            if (block.type === 'h2') return html + `<h3>${esc(block.text)}</h3>`;
            if (block.type === 'li') { if (!listOpen) { html += '<ul>'; listOpen = true; } return html + `<li>${inlineRichText(p,block.text)}</li>`; }
            return html + paragraph(block);
          }).join('') + (listOpen ? '</ul>' : '');
          return `<section class="case-story-section"><h2>${esc(heading)}</h2>${body}</section>`;
        };
        const background = section('Client Background','Project Scope');
        const backgroundIntro = background.find(block=>block.type==='p');
        const backgroundImage = background.find(block=>block.type==='image');
        const backgroundItems = background.reduce((items,block,index)=>{
          if(block.type==='h2') items.push({heading:block.text,text:background[index+1]?.type==='p'?background[index+1].text:''});
          return items;
        },[]);
        const goals = section('I. Defining Business Goals','II. Building Digital Roadmap');
        const goalItems = goals.reduce((items,block,index)=>{
          if(block.type==='image') items.push({image:block,heading:goals[index+1]?.text||'',text:goals[index+2]?.text||''});
          return items;
        },[]);
        const roadmap = section('II. Building Digital Roadmap','III. Key Insights from User Research');
        const roadmapText = roadmap.find(block=>block.type==='p');
        const roadmapImages = roadmap.filter(block=>block.type==='image');
        const insight = section('III. Key Insights from User Research','IV. Building Sitemap​');
        return `<section class="case-story-section genex-background"><h2>Client Background</h2>${paragraph(backgroundIntro)}<div class="genex-background-grid">${figure(backgroundImage)}<div class="genex-background-list">${backgroundItems.map(item=>`<article><h3>${esc(item.heading)}</h3><p>${inlineRichText(p,item.text)}</p></article>`).join('')}</div></div></section>`+
          standard('Project Scope','DESIGN PROCESS​')+
          `<section class="case-story-section genex-section-label"><h2>DESIGN PROCESS</h2></section>`+
          `<section class="case-story-section genex-goals"><h2>I. Defining Business Goals</h2>${goals[0]?.type==='p'?paragraph(goals[0]):''}<div class="genex-goal-grid">${goalItems.map(item=>`<article>${figure(item.image)}<h3>${esc(item.heading)}</h3><p>${inlineRichText(p,item.text)}</p></article>`).join('')}</div></section>`+
          `<section class="case-story-section"><h2>II. Building Digital Roadmap</h2>${roadmapText?paragraph(roadmapText):''}<div class="genex-roadmap" aria-label="Four phases of the digital roadmap">${roadmapImages.map(figure).join('')}</div></section>`+
          `<section class="case-story-section genex-insight"><div><h2>III. Key Insights from User Research</h2>${insight.filter(block=>block.type==='p').map(paragraph).join('')}</div>${insight.filter(block=>block.type==='image').map(figure).join('')}</section>`+
          standard('IV. Building Sitemap​','V. Wireframes')+
          standard('V. Wireframes','VI. User Interface Components')+
          standard('VI. User Interface Components','DELIVERABLES')+
          `<section class="case-story-section genex-section-label"><h2>DELIVERABLES</h2></section>`+
          standard('I. Sign in/ Sign up Flow','II. User Dashboard & Profile Management:')+
          standard('II. User Dashboard & Profile Management:','III. News, Community & Support')+
          standard('III. News, Community & Support','IV. Prototype')+
          standard('IV. Prototype','CONCLUSION')+
          standard('CONCLUSION');
      };
      if (p.slug === 'genex-member-portal') {
        blocks.push(`<section class="case-section case-section--wide legacy-case-content genex-content">${genexLayout()}</section>`);
      } else {
      let listOpen = false;
      let sectionOpen = false;
      let sectionHeading = '';
      const sectionCarousel = heading => {
        const carousel = p.caseCarousels?.find(item=>item.heading===heading);
        if (!carousel) return '';
        return `<div class="nab-carousel-section" aria-label="${esc(heading)} images"><div class="graphics-carousel-shell nab-carousel-shell" data-carousel><div class="graphics-carousel-stage"><button class="carousel-button carousel-button--previous" type="button" data-carousel-prev aria-label="Previous image">←</button><div class="graphics-carousel nab-carousel" data-carousel-track tabindex="0" aria-label="${esc(heading)} images">${carousel.images.map(image=>`<figure class="nab-carousel-item" data-carousel-item><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"></figure>`).join('')}</div><button class="carousel-button carousel-button--next" type="button" data-carousel-next aria-label="Next image">→</button></div><div class="carousel-pagination">${carousel.images.map((_,index)=>`<button class="carousel-dot${index===0?' is-active':''}" type="button" data-carousel-dot="${index}" aria-label="View image ${index+1}"${index===0?' aria-current="true"':''}></button>`).join('')}</div></div></div>`;
      };
      const content = p.legacyBlocks.map(block => {
        let html = '';
        if (block.type !== 'li' && listOpen) { html += '</ul>'; listOpen = false; }
        if (block.type === 'image') return html + `<figure class="legacy-visual"><img src="${esc(block.src)}" alt="${esc(block.alt || p.title + ' project visual')}" loading="lazy">${block.alt?`<figcaption>${esc(block.alt)}</figcaption>`:''}</figure>`;
        if (block.type === 'h2') { if (sectionOpen) html += sectionCarousel(sectionHeading) + '</section>'; sectionOpen = true; sectionHeading = block.text; return html + `<section class="case-story-section"><h2>${esc(block.text)}</h2>`; }
        if (block.type === 'h3') return html + `<h3>${esc(block.text)}</h3>`;
        if (block.type === 'li') {
          if (!listOpen) { html += '<ul>'; listOpen = true; }
          const lines=block.text.split(/\n+/).map(line=>line.trim()).filter(Boolean);
          const item=lines.length>1?`<strong>${esc(lines[0])}</strong><br>${lines.slice(1).map(line=>inlineRichText(p,line)).join('<br>')}`:inlineRichText(p,lines[0]||'');
          return html + `<li>${item}</li>`;
        }
        return html + richBlocks(p,block.text);
      }).join('') + (listOpen ? '</ul>' : '') + (sectionOpen ? sectionCarousel(sectionHeading) + '</section>' : '');
      blocks.push(`<section class="case-section case-section--wide legacy-case-content">${content}</section>`);
      }
    }
    if (p.process?.length) blocks.push(`<section class="case-section case-section--wide"><h2 class="eyebrow">Process</h2><div class="process-grid">${p.process.map(step=>`<article><p class="eyebrow phase">${esc(step.phase)}</p><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></article>`).join('')}</div></section>`);
    if (gallery.length) blocks.push(`<section class="case-section case-section--wide"><h2 class="eyebrow">Visuals</h2><div class="gallery-grid">${gallery.map((img,i)=>`<figure class="gallery-item${i===0?' gallery-item--wide':''}"><div><img src="${esc(img.src)}" alt="${esc(img.alt||p.title+' artwork '+(i+1))}" loading="lazy"></div><figcaption><span>${esc(img.caption||p.title+' — selected work')}</span><span>${String(i+1).padStart(2,'0')}</span></figcaption></figure>`).join('')}</div></section>`);
    if (p.results?.length) blocks.push(`<section class="case-section case-section--wide"><h2 class="eyebrow">Outcomes</h2><div class="outcomes-grid">${p.results.map(r=>`<article><p class="result-value">${esc(r.value)}</p><h3>${esc(r.metric)}</h3><p>${esc(r.label)}</p></article>`).join('')}</div></section>`);
    const meta = [['Role',p.role],['Duration',p.duration],['Team',p.team],['Year',p.year]].filter(([,v])=>v);
    p.image = p.coverImage || p.image;
    return `<article class="case-study${p.slug === 'genex-member-portal' ? ' case-study--genex' : ''}"><div class="case-cover"${p.bg?` style="--project-bg:${esc(p.bg)}"`:''}>${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)} project overview" fetchpriority="high">`:''}<div class="case-cover-shade"></div><div class="case-cover-copy container"><a class="back-link" href="${asset(backHref)}">Back to ${esc(backLabel)}</a><p class="eyebrow">${esc(p.category)}${p.year?' · '+esc(p.year):''}</p><h1>${esc(p.title)}</h1></div></div><div class="case-facts-wrap"><dl class="case-facts container">${meta.map(([l,v])=>`<div><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div><div class="case-body container">${blocks.join('')}<div class="case-tags">${tags(p.tags)}</div><nav class="project-navigation" aria-label="Other projects">${prev?`<a href="${asset(prev.href)}"><span>Previous project</span><strong>${esc(prev.title)}</strong></a>`:'<div></div>'}${next?`<a href="${asset(next.href)}"><span>Next project</span><strong>${esc(next.title)}</strong></a>`:''}</nav></div></article>`;
  }

  return { shell, card, contact, aboutContent, home, indexIntro, caseStudy };
}
