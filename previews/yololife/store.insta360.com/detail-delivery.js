(() => {
 const cities=['Dubai','Abu Dhabi','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'];
 let selected='Dubai';try{selected=localStorage.getItem('yolo-delivery-region')||selected}catch{}
 if(!cities.includes(selected))selected='Dubai';
 const markup=`<img class="yolo-truck" src="/yololife/store.insta360.com/assets/detail-ui/delivery.svg" alt=""><div class="yolo-delivery-copy"><div class="yolo-delivery-row"><label for="yolo-delivery-region">Deliver to</label><select id="yolo-delivery-region" aria-label="Delivery destination">${cities.map(c=>`<option${c===selected?' selected':''}>${c}</option>`).join('')}</select></div><p>Estimated shipping and arrival dates confirmed at checkout.</p></div>`;
 function sync(){
 const target=document.querySelector('#pStickyTabBar .__3qiGnpsF');
 if(!target||target.querySelector('#yolo-delivery-region'))return;
 target.classList.add('yolo-delivery');target.innerHTML=markup;
 const select=target.querySelector('select');select.value=selected;select.addEventListener('change',()=>{selected=select.value;try{localStorage.setItem('yolo-delivery-region',selected)}catch{}});
 }
 new MutationObserver(sync).observe(document.getElementById('__next')||document.body,{childList:true,subtree:true});sync();
})();
