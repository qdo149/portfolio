// Lightweight DOM simulation for the native carousel's navigation logic.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Element {
  events={}; attrs={}; classes=new Set(); styles={};
  classList={toggle:(name,on)=>{on?this.classes.add(name):this.classes.delete(name);},contains:name=>this.classes.has(name),remove:name=>this.classes.delete(name)};
  style={setProperty:(k,v)=>this.styles[k]=v};
  addEventListener(name,fn){this.events[name]=fn;}
  setAttribute(k,v){this.attrs[k]=v;}
  removeAttribute(k){delete this.attrs[k];}
  click(){this.events.click?.({target:this});}
}
for (const width of [366,1100]) {
  const cardWidth=width===366?327.6:500;
  const track=new Element();
  Object.assign(track,{clientWidth:width,scrollLeft:0,getBoundingClientRect:()=>({left:64,width}),scrollTo:({left})=>{track.scrollLeft=left;}});
  const cards=Array.from({length:10},(_,i)=>({getBoundingClientRect:()=>({left:64+i*(cardWidth+24)-track.scrollLeft,width:cardWidth})}));
  const previous=new Element(),next=new Element(),dots=Array.from({length:10},()=>new Element());
  const carousel={querySelector:s=>({'[data-carousel-track]':track,'[data-carousel-prev]':previous,'[data-carousel-next]':next})[s],querySelectorAll:s=>s.includes('.graphic-card')?cards:dots};
  const document={querySelector:()=>null,querySelectorAll:()=>[carousel]};
  const window={matchMedia:()=>({matches:true}),addEventListener:()=>{}};
  vm.runInNewContext(fs.readFileSync('src/assets/js/main.js','utf8'),{document,window,getComputedStyle:()=>({columnGap:'24px'}),setTimeout,clearTimeout});
  assert.equal(track.scrollLeft,0);
  previous.click(); assert.equal(track.scrollLeft,9*(cardWidth+24)); assert.equal(dots[9].attrs['aria-current'],'true');
  previous.click(); assert.equal(track.scrollLeft,8*(cardWidth+24));
  dots[9].click(); next.click(); assert.equal(track.scrollLeft,0);
  next.click(); next.click(); assert.equal(track.scrollLeft,2*(cardWidth+24));
  dots[5].click(); assert.equal(track.scrollLeft,5*(cardWidth+24));
  track.events.keydown({target:track,key:'Home',preventDefault:()=>{}}); assert.equal(track.scrollLeft,0);
  assert.equal(track.styles['--carousel-tail'],Math.max(0,width-cardWidth-24)+'px');
}
console.log('PASS: desktop/mobile looping, last-to-previous, rapid clicks, dots, keyboard, trailing space.');
