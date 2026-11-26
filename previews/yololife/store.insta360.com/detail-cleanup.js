(() => {
 function clean(){
  document.querySelectorAll('#pSideL img[src*="TechRadar_PC.png"],#pSideL img[src*="luna_cnet.svg"]').forEach(img=>img.remove());
 }
 clean();new MutationObserver(clean).observe(document.getElementById('__next')||document.body,{childList:true,subtree:true});
})();
