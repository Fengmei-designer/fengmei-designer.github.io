(() => {
 const contact=document.querySelector('.whatsapp-contact');
 if(!contact)return;
 const trigger=contact.querySelector('button');
 const open=value=>{contact.classList.toggle('is-open',value);trigger.setAttribute('aria-expanded',String(value));};
 contact.addEventListener('pointerenter',()=>{contact.classList.remove('is-dismissed');open(true)});
 contact.addEventListener('pointerleave',()=>open(false));
 trigger.addEventListener('focus',()=>{contact.classList.remove('is-dismissed');open(true)});
 trigger.addEventListener('click',()=>{contact.classList.remove('is-dismissed');open(true)});
 contact.addEventListener('focusout',e=>{if(!contact.contains(e.relatedTarget))open(false)});
 document.addEventListener('pointerdown',e=>{if(!contact.contains(e.target)){contact.classList.add('is-dismissed');open(false)}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){contact.classList.add('is-dismissed');open(false)}});
})();
