(() => {
  const D = window.NOSOTROS;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const PINKS = ['#e11d5a', '#f43f7a', '#fb6f9a', '#ffa3bf', '#ffc9d9'];
  const HEART = '<svg viewBox="0 0 24 22" aria-hidden="true"><use href="#v-heart"/></svg>';

  /* ───────────── Fondo vectorial + parallax ───────────── */
  const layers = { far: $('#L-far'), mid: $('#L-mid'), near: $('#L-near') };
  const ASPECT = { 'v-heart': 22 / 24, 'v-flower': 1, 'v-spark': 1, 'v-cloud': 90 / 220, 'v-bow': 36 / 60 };
  const seeded = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  function vineTile() {
    const leaf = 'M0 0C6-12 22-16 32-9C24 3 9 8 0 0Z';
    let g = '';
    for (let n = 0; n < 4; n++) {
      const y = n * 180;
      g += `<path d="M60 ${y}C110 ${y + 60} 10 ${y + 120} 60 ${y + 180}" fill="none" stroke="#a9c496" stroke-width="3" stroke-linecap="round"/>`;
      g += `<path d="${leaf}" transform="translate(74 ${y + 45}) rotate(-30)" fill="#b8cfa6"/>`;
      g += `<path d="${leaf}" transform="translate(46 ${y + 135}) scale(-1 1) rotate(-30)" fill="#c6dbb4"/>`;
      g += `<path d="${leaf}" transform="translate(60 ${y + 90}) scale(.62) rotate(-70)" fill="#b8cfa6" opacity=".8"/>`;
      if (n % 2 === 0) {
        const cx = 104, cy = y + 34;
        g += `<path d="M74 ${y + 45}Q92 ${y + 40} ${cx} ${cy}" fill="none" stroke="#a9c496" stroke-width="2"/>`;
        for (let k = 0; k < 5; k++) { const a = k * 72 * Math.PI / 180; g += `<circle cx="${cx + Math.sin(a) * 6}" cy="${cy - Math.cos(a) * 6}" r="4.6" fill="#ffb3c9"/>`; }
        g += `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#ffd9a0"/>`;
      }
    }
    const svg = `<svg xmlns="${NS}" width="150" height="720" viewBox="0 0 150 720">${g}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  function deco(layer, id, o) {
    const w = o.w, h = w * (ASPECT[id] || 1);
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'deco' + (o.o ? ' o' : '') + (o.cls ? ' ' + o.cls : ''));
    s.setAttribute('width', w); s.setAttribute('height', h);
    s.style.cssText = `left:${o.x}%;top:${o.y}px;color:${o.c};opacity:${o.a};transform:rotate(${o.r || 0}deg);--d:${o.d || 7}s;--dl:${o.dl || 0}s`;
    const u = document.createElementNS(NS, 'use'); u.setAttribute('href', '#' + id);
    s.appendChild(u); layer.appendChild(s);
  }

  function buildBG() {
    const H = document.documentElement.scrollHeight, r = seeded(7);
    const R = (a, b) => a + r() * (b - a);
    Object.values(layers).forEach(l => l.innerHTML = '');
    const screens = H / innerHeight;
    // lejos: nubes y corazones grandes de contorno
    for (let i = 0; i < Math.round(screens * 2.2) + 2; i++)
      deco(layers.far, 'v-cloud', { w: R(220, 460), x: R(-6, 88), y: R(0, H), c: '#fff', a: R(.07, .16) });
    for (let i = 0; i < Math.round(screens * 1.6) + 2; i++)
      deco(layers.far, 'v-heart', { w: R(160, 330), x: R(-4, 90), y: R(0, H), c: '#ffb3c9', a: R(.35, .6), o: true, r: R(-24, 24) });
    // medio: enredaderas, corazones rellenos, lazos, flores
    const vl = document.createElement('div'), vr = document.createElement('div');
    vl.className = 'vine l'; vr.className = 'vine r';
    vl.style.backgroundImage = vr.style.backgroundImage = vineTile();
    layers.mid.append(vl, vr);
    for (let i = 0; i < Math.round(screens * 4) + 4; i++) {
      const side = r() < .5;
      deco(layers.mid, 'v-heart', { w: R(34, 86), x: side ? R(2, 22) : R(76, 96), y: R(0, H), c: pick(['#ffa3bf', '#ffc9d9', '#fb6f9a']), a: R(.4, .7), r: R(-30, 30), cls: 'bob', d: R(5, 9), dl: -R(0, 6) });
    }
    for (let i = 0; i < Math.round(screens * 1.3) + 2; i++)
      deco(layers.mid, 'v-bow', { w: R(60, 110), x: R(4, 90), y: R(0, H), c: '#ffb3c9', a: R(.45, .7), r: R(-18, 18), cls: 'bob', d: R(6, 10), dl: -R(0, 6) });
    for (let i = 0; i < Math.round(screens * 2.6) + 3; i++) {
      const side = r() < .5;
      deco(layers.mid, 'v-flower', { w: R(44, 92), x: side ? R(-1, 14) : R(84, 98), y: R(0, H), c: pick(['#ffc9d9', '#ffb3c9', '#ffd6e3']), a: R(.55, .85), r: R(0, 72) });
    }
    // cerca: destellos y mini corazones
    for (let i = 0; i < Math.round(screens * 9) + 8; i++)
      deco(layers.near, 'v-spark', { w: R(10, 24), x: R(1, 98), y: R(0, H), c: pick(['#fff', '#ffd9a0', '#ffc9d9']), a: .9, cls: 'tw', d: R(2, 5), dl: -R(0, 4) });
    for (let i = 0; i < Math.round(screens * 6) + 6; i++)
      deco(layers.near, 'v-heart', { w: R(12, 30), x: R(1, 98), y: R(0, H), c: pick(PINKS), a: R(.5, .85), r: R(-25, 25), cls: 'bob', d: R(4, 8), dl: -R(0, 6) });
    for (let i = 0; i < Math.round(screens * 3) + 3; i++)
      deco(layers.near, 'v-flower', { w: R(20, 40), x: R(1, 98), y: R(0, H), c: pick(['#fb6f9a', '#ffa3bf']), a: R(.6, .85), r: R(0, 72), cls: 'bob', d: R(6, 10), dl: -R(0, 6) });
  }

  let tx = 0, ty = 0, cx = 0, cy = 0, sy = scrollY;
  const glow = $('.glow');
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  function parallax() {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06; sy += (scrollY - sy) * .1;
    Object.values(layers).forEach(l => {
      const k = +l.dataset.k, m = +l.dataset.m;
      l.style.transform = `translate3d(${(-cx * m).toFixed(2)}px,${(sy * k - cy * m * .7).toFixed(2)}px,0)`;
    });
    glow.style.transform = `translate3d(${(-cx * 18).toFixed(1)}px,${(-cy * 18 - sy * .06).toFixed(1)}px,0)`;
    requestAnimationFrame(parallax);
  }
  buildBG();
  if (!reduced) requestAnimationFrame(parallax);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildBG, 350); });
  addEventListener('load', () => setTimeout(buildBG, 300));
  document.fonts && document.fonts.ready.then(() => setTimeout(buildBG, 200));

  /* ───────────── Aparición al hacer scroll ───────────── */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.classList.contains('cifras')) countUp();
  }), { threshold: .18 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ───────────── Cursor y partículas ───────────── */
  function burst(x, y, n = 10, spread = 90, size = 15) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      const a = Math.random() * Math.PI * 2, d = rnd(spread * .35, spread);
      el.className = 'burst';
      el.style.cssText = `left:${x}px;top:${y}px;width:${size * rnd(.7, 1.3)}px;height:${size * rnd(.7, 1.3)}px;color:${pick(PINKS)};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--rot:${rnd(-80, 80)}deg`;
      el.innerHTML = HEART; el.firstChild.style.cssText = 'width:100%;height:100%';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }
  function rain(n = 40) {
    if (reduced) return;
    const box = $('#rain');
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'petal';
      p.style.cssText = `left:${rnd(0, 100)}%;--s:${rnd(10, 22)}px;--t:${rnd(5, 9)}s;--dl:${rnd(0, 1.8)}s;--sw:${rnd(-90, 90)}px;filter:hue-rotate(${rnd(-14, 14)}deg)`;
      box.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  if (fine) {
    document.documentElement.classList.add('has-cursor');
    const dot = $('.cur-dot'), ring = $('.cur-ring'), label = $('span', ring);
    let px = innerWidth / 2, py = innerHeight / 2, rx = px, ry = py, lastX = px, lastY = py, acc = 0;
    addEventListener('pointermove', e => {
      px = e.clientX; py = e.clientY;
      dot.classList.remove('hide'); ring.classList.remove('hide');
      acc += Math.hypot(px - lastX, py - lastY); lastX = px; lastY = py;
      if (acc > 36 && !reduced) {
        acc = 0;
        const t = document.createElement('div');
        t.className = 'trail';
        t.style.cssText = `left:${px}px;top:${py}px;color:${pick(PINKS)};--dx:${rnd(-24, 24)}px;--dy:${rnd(18, 54)}px;--rot:${rnd(-60, 60)}deg`;
        t.innerHTML = HEART; t.firstChild.style.cssText = 'width:100%;height:100%';
        document.body.appendChild(t);
        t.addEventListener('animationend', () => t.remove());
      }
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      ring.classList.toggle('is-link', !!t.closest('a,button,.planta'));
    });
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup', () => ring.classList.remove('is-down'));
    document.documentElement.addEventListener('pointerleave', () => { dot.classList.add('hide'); ring.classList.add('hide'); });
    (function loop() {
      rx += (px - rx) * .2; ry += (py - ry) * .2;
      dot.style.transform = `translate3d(${px}px,${py}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    })();
  }
  addEventListener('pointerdown', e => burst(e.clientX, e.clientY, 7, 70, 12));

  /* Brillo y ondas en botones */
  document.addEventListener('pointermove', e => {
    const b = e.target.closest && e.target.closest('.btn');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
    b.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });
  document.addEventListener('click', e => {
    const b = e.target.closest('.btn, .nav-pill');
    if (!b) return;
    const r = b.getBoundingClientRect(), sz = Math.max(r.width, r.height);
    const rp = document.createElement('span');
    rp.className = 'ripple';
    rp.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
    b.appendChild(rp); rp.addEventListener('animationend', () => rp.remove());
  });

  /* ───────────── Rosa vectorial que se arma pétalo a pétalo ───────────── */
  const PALETAS = [
    ['#ff9fbb', '#ff6b97', '#f43f7a', '#e11d5a', '#b8123f'],
    ['#ffd2b8', '#ffb08a', '#ff8d6b', '#f0653f', '#c9442a'],
    ['#f6d3ff', '#e3a9f5', '#cd7be6', '#b455d1', '#8e34a8'],
    ['#fff6ef', '#ffe3d2', '#ffc9b0', '#ffa98c', '#e98568'],
    ['#ffc2d1', '#ff94b0', '#ff6b8f', '#e63e69', '#b81b45']
  ];
  const PETALO = 'M0 0C-30-8-34-50 0-62C34-50 30-8 0 0Z';
  function rosaSVG(pal, delay = 0, cls = 'rosa') {
    const anillos = [[6, 1, 0], [5, .8, 36], [5, .6, 18], [4, .43, 45], [3, .27, 0]];
    let g = '';
    anillos.forEach(([n, sc, off], i) => {
      for (let k = 0; k < n; k++) {
        const a = off + k * 360 / n + rnd(-5, 5);
        const d = (delay + i * .3 + k * .06).toFixed(2);
        g += `<g transform="translate(100 108) rotate(${a.toFixed(1)}) scale(${sc})"><path class="petalo" style="--d:${d}s;--r0:${rnd(-50, 50).toFixed(0)}deg" d="${PETALO}" fill="${pal[i]}" stroke="rgba(120,0,40,.22)" stroke-width="1.2"/><path class="petalo" style="--d:${d}s;--r0:0deg" d="M0 -8C-6 -26-4 -44 0 -54" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-linecap="round"/></g>`;
      }
    });
    g += `<path class="petalo" style="--d:${(delay + 1.55).toFixed(2)}s" d="M100 100c9 0 13 8 8 13s-15 1-13-8" fill="none" stroke="${pal[4]}" stroke-width="2.4" stroke-linecap="round"/>`;
    return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true">${g}</svg>`;
  }

  /* ───────────── Ventana emergente ───────────── */
  const modal = $('#modal'), box = $('#modalBox');
  let lastFocus = null, timers = [];
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); };
  function openModal(node) {
    lastFocus = document.activeElement;
    box.innerHTML = ''; box.appendChild(node);
    modal.hidden = false; document.body.style.overflow = 'hidden';
    $('.modal-x', modal).focus({ preventScroll: true });
  }
  function closeModal() {
    timers.forEach(clearTimeout); timers = [];
    modal.hidden = true; box.innerHTML = ''; document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function palabras(text, start = 0, step = .07) {
    let i = 0;
    return text.split(' ').map(w => `<span class="w" style="animation-delay:${(start + step * i++).toFixed(2)}s">${esc(w)}</span>`).join(' ');
  }

  function abrirCarta(c, srcBtn) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="env"><div class="env-back"></div><div class="env-paper"></div><div class="env-front"></div><div class="env-flap"></div><div class="env-seal">${HEART}</div></div>`;
    openModal(wrap);
    const env = $('.env', wrap);
    if (srcBtn) { const r = srcBtn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 12, 110, 16); }
    later(() => env.classList.add('open'), 350);
    later(() => { env.classList.add('gone'); rain(16); }, 1900);
    later(() => {
      let delay = .35, html = '';
      c.texto.forEach(l => { html += palabras(l, delay) + '<br>'; delay += l.split(' ').length * .07; });
      box.innerHTML = `<article class="letter"><svg class="mini-heart" viewBox="0 0 24 22" aria-hidden="true"><use href="#v-heart"/></svg><h3>${esc(c.titulo)}</h3><p>${html}</p><p class="firma"><span class="w" style="animation-delay:${(delay + .3).toFixed(2)}s">— ${esc(c.firma)}</span></p></article>`;
    }, 2450);
  }

  let rosaIdx = 0;
  function abrirRosa(msg, opts = {}) {
    const wrap = document.createElement('div');
    const render = m => {
      if (opts.hito) {
        wrap.innerHTML = `<div class="rosa-card hito"><h4>${esc(opts.titulo || '')}</h4>${rosaSVG(PALETAS[rosaIdx++ % PALETAS.length], .15)}<p>${palabras(m, 1.6, .06)}</p><button class="btn btn-hot" type="button" data-close><span class="code">seguir()</span>Seguir sembrando 💕</button></div>`;
        rain(opts.lluvia || 30);
        return;
      }
      wrap.innerHTML = `<div class="rosa-card">${rosaSVG(PALETAS[rosaIdx++ % PALETAS.length], .15)}<p>${palabras(m, 1.9, .08)}</p><button class="btn btn-hot" type="button" data-otra><span class="code">otra_rosa()</span>Otra rosa</button></div>`;
      rain(14);
    };
    render(msg);
    wrap.addEventListener('click', e => {
      if (!e.target.closest('[data-otra]')) return;
      render(pick(D.piropos));
    });
    openModal(wrap);
    later(() => { const r = $('.rosa', wrap).getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 16, 150, 18); }, 1600);
  }

  /* ───────────── Sobres ───────────── */
  const sobresEl = $('#sobres');
  function crearSobre(c, i) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sobre'; b.style.transitionDelay = (i % 4) * 90 + 'ms';
    b.setAttribute('aria-label', 'Abrir carta: ' + c.titulo);
    b.innerHTML = `<span class="sobre-in"><span class="sobre-flap"></span><span class="sobre-seal">${HEART}</span><span class="sobre-info"><b>${esc(c.titulo)}</b><small>carta_${String(i + 1).padStart(3, '0')}.abrir()</small></span></span>`;
    b.addEventListener('click', () => abrirCarta(c, b));
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 14 + 'deg');
      b.style.setProperty('--rx', ((e.clientY - r.top) / r.height - .5) * -14 + 'deg');
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--rx', '0deg'); b.style.setProperty('--ry', '0deg'); });
    sobresEl.appendChild(b); io.observe(b);
  }
  D.crearSobre = crearSobre; D.abrirCarta = abrirCarta;

  /* ───────────── Jardín ───────────── */
  const plantas = $('#plantas'), contador = $('#contador'), bubble = $('#bubble');
  let nPlantas = 0, bt, lastPiropo = '';
  const xs = [];
  function showBubble(t) {
    bubble.textContent = t; bubble.classList.add('on');
    clearTimeout(bt); bt = setTimeout(() => bubble.classList.remove('on'), 5200);
  }
  const HITOS = {
    11: { titulo: 'Once rosas, mi amor 💕', lluvia: 34, msg: 'Once rosas, como nuestro 11 de noviembre. Si cada una fuera un motivo para quererte, ya me quedé corto, porque desde que llegaste todo en mí florece sin pedir permiso. Contigo el tiempo se vuelve suave, los días se visten de domingo y hasta mis lunes saben a ti. Gracias por ser mi casa, mi calma y mi mejor casualidad. Aquí van estas once flores con todo mi corazón, y las que faltan, siempre serán para ti.' },
    111: { titulo: '¡Ciento once rosas! 🌹💕', lluvia: 70, msg: 'Ciento once rosas, y ninguna le llega a la belleza de tu risa. Si pudiera, te sembraría un jardín en cada abrazo, un cielo nuevo en cada mañana y un 11 de noviembre en cada día del calendario. Eres mi persona favorita en este mundo y en todos los que se me ocurran. Gracias por quedarte, por mirarme así y por hacerme sentir tan querido y tan en casa. Prometo cuidarte, hacerte reír y elegirte de nuevo todos los días, hoy, mañana y por siempre. Te amo, mi vida, con el corazón entero y las manos llenas de flores. Por siempre tú 💕' }
  };
  const hechos = new Set();
  function hito(n) {
    const h = HITOS[n]; if (!h || hechos.has(n)) return;
    hechos.add(n); stopHold();
    setTimeout(() => { abrirRosa(h.msg, { hito: true, titulo: h.titulo, lluvia: h.lluvia }); }, 1300);
  }
  function plantar(e, xPct) {
    const msg = pick(D.piropos);
    let best = 50, bd = -1;
    if (typeof xPct === 'number') { best = clamp(xPct, 4, 96); }
    else for (let i = 0; i < 14; i++) {
      const x = rnd(6, 94), d = xs.length ? Math.min(...xs.map(v => Math.abs(v - x))) : 99;
      if (d > bd) { bd = d; best = x; }
    }
    xs.push(best);
    if (xs.length > 60) { xs.shift(); plantas.firstChild.remove(); }
    const h = rnd(80, 190), s = rnd(58, 92);
    const pl = document.createElement('button');
    pl.type = 'button'; pl.className = 'planta';
    pl.style.cssText = `left:${best}%;--h:${h}px;--s:${s}px`;
    pl.setAttribute('aria-label', 'Abrir el mensaje de esta rosa');
    pl.innerHTML = `<i class="tallo"></i><i class="hoja a"></i><i class="hoja b"></i><span class="flor">${rosaSVG(pick(PALETAS), 1, 'rosa-s')}</span>`;
    $('.rosa-s', pl).style.cssText = 'width:100%;height:100%;overflow:visible';
    pl.addEventListener('click', () => abrirRosa(msg));
    plantas.appendChild(pl);
    nPlantas++;
    contador.textContent = nPlantas + (nPlantas === 1 ? ' rosa plantada' : ' rosas plantadas');
    const g = $('#jardinBox').getBoundingClientRect();
    later2(() => burst(g.left + g.width * best / 100, g.bottom - g.height * .03 - h, 9, 80, 13), 1900);
    if (nPlantas === 6) showBubble('Sigue haciendo clic: el jardín entero florece para ti.');
    if (nPlantas === 12) showBubble('Ya casi tenemos un jardín entero. Y todo es para ti.');
    hito(nPlantas);
  }
  /* Clic (o mantener presionado) en cualquier parte del jardín siembra rosas */
  let holdT = null;
  function stopHold() { clearInterval(holdT); holdT = null; }
  const jbox = $('#jardinBox');
  jbox.addEventListener('pointerdown', e => {
    if (e.button > 0 || e.target.closest('.garden-ui,.planta,.bubble')) return;
    const at = ev => { const g = jbox.getBoundingClientRect(); return (ev.clientX - g.left) / g.width * 100; };
    let lastX = at(e);
    plantar(e, lastX);
    if (e.pointerType === 'mouse') {
      const mv = ev => { lastX = at(ev); };
      jbox.addEventListener('pointermove', mv);
      stopHold(); holdT = setInterval(() => plantar(null, lastX + rnd(-3, 3)), 260);
      const up = () => { stopHold(); jbox.removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointerup', up);
    }
  });
  const later2 = (fn, ms) => setTimeout(fn, ms);
  $('#plantar').addEventListener('click', plantar);
  $('#piropo').addEventListener('click', e => {
    let t; do { t = pick(D.piropos); } while (t === lastPiropo && D.piropos.length > 1);
    lastPiropo = t; showBubble(t);
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 10, 100, 14);
  });

  /* ───────────── Contadores ───────────── */
  function countUp() {
    const start = new Date(D.inicio + 'T00:00:00-05:00'), now = new Date();
    const ms = Math.max(0, now - start);
    const targets = [['#n-dias', Math.floor(ms / 864e5)], ['#n-horas', Math.floor(ms / 36e5)], ['#n-latidos', Math.floor(ms / 6e4 * 70)]];
    const t0 = performance.now(), dur = reduced ? 1 : 2400;
    (function step(t) {
      const p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
      targets.forEach(([sel, v]) => { $(sel).textContent = Math.round(v * e).toLocaleString('es-CO'); });
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ───────────── Botones con rosa / corazón final ───────────── */
  $$('[data-rosa]').forEach(b => b.addEventListener('click', () => abrirRosa(b.dataset.rosa)));
  $('#corazon').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 28, 240, 22);
    rain(60);
    setTimeout(() => abrirRosa('Te amo. Gracias por este primer año & por todos los que nos faltan por vivir juntos.'), 900);
  });
})();
