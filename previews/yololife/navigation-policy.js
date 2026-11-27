(()=>{
'use strict';
const detail='/yololife/product/luna-series/';
const home='/yololife/';
const isDetail=/\/product\/luna-series(?:\/|$)/.test(location.pathname);
const isHome=location.pathname===home||location.pathname===home+'index.html';
let isHomeFooter=false;try{isHomeFooter=window.frameElement?.id==='yolo-vivo-footer'}catch{}
const homeLinks=isHome||isHomeFooter;
const isBuy=el=>el.matches('[data-buy-now]')||/^(buy\s*now)$/i.test(el.textContent.trim());
function clean(){
 document.querySelectorAll('a,area').forEach(a=>{
  if(homeLinks||isBuy(a)){
   if(a.getAttribute('href')!==detail)a.setAttribute('href',detail);
   if(isHomeFooter)a.setAttribute('target','_top');else a.removeAttribute('target');
   a.removeAttribute('ping');a.removeAttribute('download');
   if(isBuy(a))a.setAttribute('data-buy-now','');
  }
  else {a.removeAttribute('href');a.removeAttribute('target');a.removeAttribute('ping');a.removeAttribute('download');}
 });
 document.querySelectorAll('button,span').forEach(el=>{if(isBuy(el))el.setAttribute('data-buy-now','');});
}
function intercept(e){
 const el=e.target instanceof Element?e.target:null;if(!el)return;
 if(isDetail&&el.closest('#yolo-nav')){e.preventDefault();e.stopImmediatePropagation();if(e.type==='click')location.assign(home);return;}
 // Real anchors retain normal keyboard, middle-click and new-tab behavior.
 const homeAnchor=homeLinks&&el.closest('a,area');
 if(homeAnchor){homeAnchor.setAttribute('href',detail);if(isHomeFooter)homeAnchor.setAttribute('target','_top');else homeAnchor.removeAttribute('target');e.stopImmediatePropagation();return;}
 if(isHome&&el.closest('.offline-nav-links button')){e.preventDefault();e.stopImmediatePropagation();if(e.type==='click')location.assign(detail);return;}
 const buy=el.closest('[data-buy-now]');
 if(buy){e.preventDefault();e.stopImmediatePropagation();if(e.type==='click')location.assign(detail);return;}
 if(el.closest('a,area,#yolo-nav,.offline-nav-links')){e.preventDefault();e.stopImmediatePropagation();}
}
window.addEventListener('click',intercept,true);window.addEventListener('auxclick',intercept,true);
window.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
function start(){if(isDetail){const nav=document.querySelector('#yolo-nav');if(nav)nav.style.cursor='pointer';const logo=document.querySelector('#yolo-nav a');if(logo){logo.tabIndex=0;logo.setAttribute('role','button');logo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();location.assign(home)}})}}clean();new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
