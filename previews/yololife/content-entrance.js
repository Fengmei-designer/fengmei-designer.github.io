/* Reveal each item only when scrolling brings it into the visible viewport. */
(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const seen=new WeakSet(),registered=new WeakSet(),pending=new Set(),running=new Map();
 const selectors=[
  '.categories > a','.shop-section > header','.shop-section > .rail > *',
  '.accessory-grid > *','#pSideL .WKD8F2yP','.fd-hero',
  '.figma-detail-story > section > h2','.figma-detail-story > section > p',
  '.fd-highlights > p','.fd-features > *','.fd-scene > img',
  '.fd-views > *','.fd-home > *','#pSideR .PA5dpJF_ > h1',
  '#pSideR .PA5dpJF_ > .__3OV0rt05','#pSideR .detail-rating',
  '#pSideR .detail-price-row','#pSideR .detail-vat','#pSideR .exo-block',
  '#pSideR .detail-services','#luna-reviews > h2','.review-summary',
  '.review-filters','.review-pagination','#review-list > *','.services > div','.columns > section','.legal'
 ].join(',');
 const style=document.createElement('style');
 style.textContent='[data-entrance="pending"]{opacity:0!important}@media(prefers-reduced-motion:reduce){[data-entrance="pending"]{opacity:1!important}}';document.head.append(style);
 let frame=null;try{frame=window.frameElement}catch{}
 function enter(el,delay=0){
  if(seen.has(el)||preference.matches)return;seen.add(el);pending.delete(el);observer.unobserve(el);
  const animation=el.animate([{opacity:0,translate:'0 32px'},{opacity:1,translate:'0 0'}],{duration:800,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  el.dataset.entrance='running';running.set(el,animation);
  animation.onfinish=animation.oncancel=()=>{running.delete(el);el.dataset.entrance='shown'};
 }
 function revealGroup(elements){
  const groups=new Map();
  elements.forEach(el=>{if(!pending.has(el))return;const key=el.parentElement;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(el)});
  groups.forEach(els=>els.sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1).forEach((el,i)=>enter(el,Math.min(i*85,340))));
 }
 const observer=new IntersectionObserver(entries=>{
  if(frame){scheduleFrame();return}
  revealGroup(entries.filter(e=>e.isIntersecting&&e.intersectionRatio>=.15).map(e=>e.target));
 },{threshold:[0,.15],rootMargin:'0px 0px -64px 0px'});
 // The footer has its own iframe. Check its position in the parent page so
 // lazy loading the iframe cannot play the footer animation off screen.
 let frameRequest=0;
 function scheduleFrame(){if(!frame||frameRequest)return;frameRequest=requestAnimationFrame(()=>{
  frameRequest=0;const f=frame.getBoundingClientRect(),host=window.parent;
  const visible=[];
  pending.forEach(el=>{const r=el.getBoundingClientRect();const top=r.top+f.top,bottom=r.bottom+f.top;
   const height=Math.min(bottom,host.innerHeight-64)-Math.max(top,0);
   if(r.height>0&&height>=Math.min(r.height*.15,(host.innerHeight-64)*.5)&&r.right+f.left>0&&r.left+f.left<host.innerWidth)visible.push(el);
  });revealGroup(visible);
 })}
 function register(){document.querySelectorAll(selectors).forEach(el=>{
  if(registered.has(el))return;registered.add(el);pending.add(el);el.dataset.entrance='pending';observer.observe(el);
 });scheduleFrame()}
 document.addEventListener('focusin',event=>{const el=event.target.closest('[data-entrance]');if(!el)return;if(pending.has(el))enter(el);running.get(el)?.finish()});
 register();const mutations=new MutationObserver(register);mutations.observe(document.body,{childList:true,subtree:true});
 if(frame){window.parent.addEventListener('scroll',scheduleFrame,{passive:true});window.parent.addEventListener('resize',scheduleFrame);window.addEventListener('resize',scheduleFrame)}
 preference.addEventListener('change',event=>{if(!event.matches)return;observer.disconnect();mutations.disconnect();
  pending.forEach(el=>el.dataset.entrance='shown');pending.clear();running.forEach(a=>a.cancel());running.clear();
  if(frame){window.parent.removeEventListener('scroll',scheduleFrame);window.parent.removeEventListener('resize',scheduleFrame)}
 });
})();
