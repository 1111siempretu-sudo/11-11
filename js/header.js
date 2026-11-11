(() => {
  const D = window.NOSOTROS || {}, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hd = $('#hd'), bar = $('#hdBar'), links = $('#hdLinks'), ind = links.querySelector('.hd-ind'), anchors = [...links.querySelectorAll('a')];
  const burger = $('#hdBurger'), rnd = (a, b) => a + Math.random() * (b - a), PK = ['#ff2e7e', '#ff8fb8', '#ffd86b', '#b9a2ff', '#fff'];
  const HE = '<svg viewBox="0 0 24 22" style="width:100%;height:100%"><use href="#v-heart"/></svg>';

  /* Contador de días juntos (sube al cargar) */
  const dEl = $('#hdDays'), S = new Date((D.inicio || '2025-11-11') + 'T00:00:00-05:00'), total = Math.max(0, Math.floor((Date.now() - S) / 864e5));
  if (reduced || total < 2) dEl.textContent = total.toLocaleString('es-CO');
  else { const t0 = performance.now() + 700; const step = t => { const k = Math.min(1, Math.max(0, (t - t0) / 1600)), e = 1 - Math.pow(1 - k, 3); dEl.textContent = Math.round(total * e).toLocaleString('es-CO'); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

  /* Indicador deslizante */
  let active = null, hovered = null;
  const place = a => { if (!a) { ind.style.setProperty('--o', 0); return; } ind.style.setProperty('--x', a.offsetLeft + 'px'); ind.style.setProperty('--w', a.offsetWidth + 'px'); ind.style.setProperty('--o', 1); };
  anchors.forEach(a => { a.addEventListener('pointerenter', () => { hovered = a; place(a); }); });
  links.addEventListener('pointerleave', () => { hovered = null; place(active); });
  addEventListener('resize', () => place(hovered || active));
  document.fonts && document.fonts.ready.then(() => place(hovered || active));

  /* Scroll: progreso, encogido, ocultar al bajar, sección activa */
  const secs = anchors.map(a => $(a.getAttribute('href'))), menuLinks = $$('.hd-menu a');
  let lastY = scrollY, tick = false;
  const upd = () => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    hd.classList.toggle('sc', y > 40);
    if (!hd.classList.contains('open')) hd.classList.toggle('off', y > 380 && y > lastY + 4 ? true : (y < lastY - 4 || y < 380) ? false : hd.classList.contains('off'));
    lastY = y;
    let cur = null; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= innerHeight * .4) cur = i; });
    const next = cur == null ? null : anchors[cur];
    if (next !== active) { active = next; anchors.forEach(a => a.classList.toggle('on', a === active)); if (!hovered) place(active); }
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();

  /* Luz que sigue al cursor dentro de la barra */
  bar.addEventListener('pointermove', e => { const r = bar.getBoundingClientRect(); bar.style.setProperty('--mx', (e.clientX - r.left) + 'px'); });

  /* Corazones al tocar */
  function hearts(x, y, n = 12) {
    if (reduced) return;
    for (let i = 0; i < n; i++) { const el = document.createElement('div'), a = rnd(0, 6.28), d = rnd(40, 130), s = rnd(10, 22); el.className = 'burst'; el.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;color:${PK[i % 5]};--dx:${Math.cos(a) * d}px;--dy:${-rnd(50, 160)}px;--rot:${rnd(-70, 70)}deg`; el.innerHTML = HE; document.body.appendChild(el); el.addEventListener('animationend', () => el.remove()); }
  }
  const cta = $('.hd-cta'); cta.addEventListener('click', () => { const r = cta.getBoundingClientRect(); hearts(r.left + r.width / 2, r.top + r.height / 2, 18); });
  $('.hd-brand').addEventListener('click', e => { const r = e.currentTarget.getBoundingClientRect(); hearts(r.left + 18, r.top + r.height / 2, 9); });

  /* Menú móvil */
  const setMenu = o => { hd.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú'); if (o) hd.classList.remove('off'); };
  burger.addEventListener('click', () => setMenu(!hd.classList.contains('open')));
  menuLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('pointerdown', e => { if (hd.classList.contains('open') && !hd.contains(e.target)) setMenu(false); });

  /* Titular con un leve movimiento al mover el cursor */
  const hero = $('.stage .hero');
  if (hero && fine && !reduced) addEventListener('pointermove', e => { if (scrollY > innerHeight) return; hero.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3)); hero.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3)); }, { passive: true });
})();
