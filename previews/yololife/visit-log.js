/* Optional, asynchronous visit logging. A failed request never affects the page. */
(() => {
  try {
    if (window.top !== window || window.__yoloVisitLog ||
        location.hostname !== 'fengmei-designer.github.io') return;
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    if (!['/yololife', '/yololife/product/luna-series'].includes(path)) return;
    window.__yoloVisitLog = true;
    const endpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSda99ucuv6iJN_GBFWiuyRSdP4zHzb9aRwqDXiXT-NpQketHw/formResponse';
    const isTest = new URLSearchParams(location.search).has('visit_test');
    const page = (isTest ? 'TEST ' : '') + path + '/';
    let sent = false, scheduled = false, wasVisible = false, generation = 0;

    function send() {
      if (sent || !wasVisible) return;
      sent = true;
      try {
        const id = (isTest ? 'TEST-' : '') + crypto.randomUUID();
        const body = new URLSearchParams({
          'entry.2082802235': id,
          'entry.1296246206': page,
          fvv: '1', pageHistory: '0'
        });
        // No cookie, referrer, redirect, UI changes, or synchronous dependency.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        fetch(endpoint, {
          method: 'POST', mode: 'no-cors', credentials: 'omit',
          referrerPolicy: 'no-referrer', keepalive: true,
          body, signal: controller.signal
        }).catch(() => {}).finally(() => clearTimeout(timeout));
      } catch (_) { /* Browsing must work even when analytics is unavailable. */ }
    }

    function schedule() {
      if (document.prerendering || document.visibilityState !== 'visible') return;
      wasVisible = true;
      if (sent || scheduled) return;
      scheduled = true;
      const current = generation;
      const run = () => { if (current === generation) send(); };
      // Give rendering and interaction priority. Quick departures flush below.
      if ('requestIdleCallback' in window) requestIdleCallback(run, {timeout: 2000});
      else setTimeout(run, 600);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') send(); else schedule();
    });
    document.addEventListener('prerenderingchange', schedule, {once: true});
    window.addEventListener('pagehide', send);
    window.addEventListener('pageshow', event => {
      if (event.persisted) {
        generation++; sent = false; scheduled = false; wasVisible = false;
        schedule();
      }
    });
    schedule();
  } catch (_) { /* Analytics must never interrupt the website. */ }
})();
