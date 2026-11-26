(() => {
  const tools = document.querySelector('.page-tools');
  const bar = document.getElementById('pStickyTabBar');
  if (!tools) return;
  const update = () => {
    tools.classList.toggle('visible', window.scrollY > 1000);
    const rect = bar?.getBoundingClientRect();
    const obstruction = rect && rect.height && rect.top < innerHeight ? Math.max(0, innerHeight - rect.top) : 0;
    tools.style.bottom = `${obstruction + 24}px`;
  };
  tools.querySelector('#back-top').addEventListener('click', () => {
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({top: 0, behavior});
  });
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update, {passive: true});
  if (bar && 'ResizeObserver' in window) new ResizeObserver(update).observe(bar);
  update();
})();
