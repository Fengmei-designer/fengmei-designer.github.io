(() => {
 const nav=document.getElementById('yolo-nav');
 if(!nav)return;
 let spacer=document.getElementById('yolo-nav-spacer');
 if(!spacer){spacer=document.createElement('div');spacer.id='yolo-nav-spacer';spacer.setAttribute('aria-hidden','true');nav.after(spacer)}
 const sync=()=>{const height=nav.getBoundingClientRect().height;spacer.style.height=height+'px';document.documentElement.style.setProperty('--yolo-nav-height',height+'px')};
 const update=()=>nav.classList.toggle('yolo-nav-scrolled',window.scrollY>12);
 window.addEventListener('scroll',update,{passive:true});
 window.addEventListener('pageshow',update);
 new ResizeObserver(sync).observe(nav);sync();update();
})();
