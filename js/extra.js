(() => {
  const D = window.NOSOTROS, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a); let ready = false;

  /* Collage */
  const cl = $('#collage'), HE = '<svg viewBox="0 0 24 22" style="width:100%;height:100%"><use href="#v-heart"/></svg>', PK = ['#ff2e7e', '#ff8fb8', '#ffd86b', '#b9a2ff', '#fff'];
  function hearts(x, y, n = 8) { if (reduced) return; for (let i = 0; i < n; i++) { const el = document.createElement('div'), a = rnd(0, 6.28), d = rnd(40, 120), s = rnd(10, 22); el.className = 'burst'; el.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;color:${PK[i % 5]};--dx:${Math.cos(a) * d}px;--dy:${-rnd(50, 150)}px;--rot:${rnd(-70, 70)}deg`; el.innerHTML = HE; document.body.appendChild(el); el.addEventListener('animationend', () => el.remove()); } }
  const card = (src, i, parent) => { const a = document.createElement('a'); a.className = 'col'; a.style.setProperty('--r', rnd(-3, 3).toFixed(1) + 'deg'); a.innerHTML = `<div class="ph"><img src="${src}" alt="" loading="lazy"></div><i class="gl"></i><span class="pin">${HE}</span>`;
    if (fine && !reduced) { a.addEventListener('pointermove', e => { const r = a.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; a.style.setProperty('--rx', (-py * 14).toFixed(1) + 'deg'); a.style.setProperty('--ry', (px * 16).toFixed(1) + 'deg'); a.style.setProperty('--gx', (px + .5) * 100 + '%'); a.style.setProperty('--ix', (-px * 18).toFixed(1) + 'px'); a.style.setProperty('--iy', (-py * 18).toFixed(1) + 'px'); }); a.addEventListener('pointerleave', () => ['--rx', '--ry', '--ix', '--iy'].forEach(k => a.style.setProperty(k, '0'))); a.addEventListener('pointerenter', e => hearts(e.clientX, e.clientY, 7)); }
    a.addEventListener('click', () => { const r = a.getBoundingClientRect(); hearts(r.left + r.width / 2, r.top + r.height / 2, 16); });
    parent.appendChild(a); };
  const cc = [0, 1].map(() => { const d = document.createElement('div'); d.className = 'cc'; cl.appendChild(d); return d; }), hh = [0, 0];
  D.collage.forEach((src, i) => { const r = (D.ratios && D.ratios[src.split('/').pop().replace('.jpg', '')]) || 1.3, k = hh[0] <= hh[1] ? 0 : 1; hh[k] += r + .12; card(src, i, cc[k]); });
  D.collageR.forEach((src, i) => card(src, i, $('#collageR')));

  const vc = $('#videoCard'); for (let i = 0; i < 6; i++) { const s = document.createElement('span'); s.className = 'vh'; s.style.cssText = `left:${i % 2 ? rnd(-6, 2) : rnd(96, 104)}%;top:${rnd(5, 90)}%;width:${rnd(14, 30)}px;color:${PK[i % 5]};animation-delay:${-rnd(0, 6).toFixed(1)}s;animation-duration:${rnd(5, 9).toFixed(1)}s`; s.innerHTML = HE; vc.appendChild(s); }
  /* Cintas de fotos que corren sin parar */
  /* Cintas: cada foto sale una sola vez; el espacio vacío entre vueltas evita que se vea repetida */
  const filasCinta = [];
  [['cintaA', D.cintaA], ['cintaB', D.cintaB]].forEach(([id, list]) => { const row = document.getElementById(id); for (let k = 0; k < 2; k++) { const g = document.createElement('div'); list.forEach((n, i) => { const f = document.createElement('figure'); f.className = 't'; f.style.setProperty('--r', (((i * 7 + k) % 5) - 2) * .8 + 'deg'); f.innerHTML = `<img src="img2/t/${n}.jpg" alt="" draggable="false">`; g.appendChild(f); }); if (k) g.setAttribute('aria-hidden', 'true'); row.appendChild(g); } filasCinta.push(row); });
  const ajustarCintas = () => filasCinta.forEach(row => {
    const gs = [...row.children]; gs.forEach(g => g.style.paddingRight = '');
    const gap = parseFloat(getComputedStyle(gs[0]).paddingRight) || 0, base = gs[0].getBoundingClientRect().width;
    const maxW = Math.max(...[...gs[0].children].map(f => f.getBoundingClientRect().width));
    const extra = Math.max(0, Math.ceil(innerWidth + maxW + gap - base));
    gs.forEach(g => g.style.paddingRight = (gap + extra) + 'px');
    row.style.setProperty('--dur', Math.max(30, (base + extra) / 55).toFixed(1) + 's');
  });
  Promise.all([...document.querySelectorAll('.cinta img')].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))).then(ajustarCintas);
  addEventListener('resize', ajustarCintas); ajustarCintas();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.col').forEach(c => io.observe(c));

  /* Stickers de fotos dispersos por la página */
  const st = {}; // stickers eliminados: repetían fotos
  Object.entries(st).forEach(([id, list]) => { const s = document.getElementById(id); if (!s) return; list.forEach(([n, pos]) => { const im = document.createElement('img'); im.className = 'sticker'; im.src = D.galeria[n]; im.alt = ''; im.style.cssText = `${pos};transform:rotate(${rnd(-9, 9).toFixed(1)}deg)`; im.dataset.speed = rnd(-.14, .14).toFixed(2); s.appendChild(im); }); });

  /* Parallax por scroll, barra de progreso y spotlight */
  const items = $$('[data-speed]'), prog = $('#progress');
  let ticking = false;
  const upd = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight; prog.style.width = (scrollY / max * 100) + '%';
    sceneTick();
    if (reduced) return;
    items.forEach(el => { const r = el.parentElement.getBoundingClientRect(); const d = (r.top + r.height / 2 - innerHeight / 2) * +el.dataset.speed; el.style.translate = `0 ${d.toFixed(1)}px`; });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  ['#dias', '#final'].forEach(id => { const s = $(id); if (!s) return; const sp = document.createElement('div'); sp.className = 'spot'; s.prepend(sp); s.addEventListener('pointermove', e => { const r = s.getBoundingClientRect(); sp.style.setProperty('--mx', e.clientX - r.left + 'px'); sp.style.setProperty('--my', e.clientY - r.top + 'px'); }); });

  /* Botones magnéticos */
  if (fine && !reduced) $$('.btn,.nav-pill,.hero-button').forEach(b => { b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .35}px`; }); b.addEventListener('pointerleave', () => b.style.translate = ''); });

  /* Títulos que suben palabra por palabra */
  $$('.head h2,.final h2').forEach(h => { let i = 0; const wrap = n => { if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) { f.append(t); return; } const o = document.createElement('span'), w = document.createElement('span'); o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top'; w.style.cssText = `display:inline-block;transform:translateY(110%);transition:transform .9s cubic-bezier(.2,.8,.2,1) ${(i++ * .09).toFixed(2)}s`; w.textContent = t; w.className = 'sw'; o.append(w); f.append(o); }); n.replaceWith(f); } else [...n.childNodes].forEach(wrap); }; wrap(h); const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('.sw').length; e.target.querySelectorAll('.sw').forEach(w => w.style.transform = 'none'); ob.disconnect(); } }), { threshold: .3 }); ob.observe(h); });

  /* Contador en vivo */
  const S = new Date(D.inicio + 'T00:00:00-05:00'), A = new Date(D.aniversario + 'T00:00:00-05:00'), set = (id, v) => $('#' + id).textContent = v, p2 = n => String(n).padStart(2, '0');
  let confeti = false;
  function tick() {
    const now = new Date(), ms = Math.max(0, now - S);
    const bn = new Date(now - 5 * 36e5), bs = new Date(S - 5 * 36e5); /* calendario de Bogotá (UTC-5) para cualquier dispositivo */
    let y = bn.getUTCFullYear() - bs.getUTCFullYear(), m = bn.getUTCMonth() - bs.getUTCMonth(), d = bn.getUTCDate() - bs.getUTCDate();
    if (d < 0) { m--; d += new Date(Date.UTC(bn.getUTCFullYear(), bn.getUTCMonth(), 0)).getUTCDate(); } if (m < 0) { y--; m += 12; }
    set('v-dias', Math.floor(ms / 864e5).toLocaleString('es-CO')); set('v-y', y); set('v-m', m); set('v-d', d); [['v-y', y, 'año', 'años'], ['v-m', m, 'mes', 'meses'], ['v-d', d, 'día', 'días']].forEach(([i, n, a, b]) => $('#' + i).nextElementSibling.textContent = n === 1 ? a : b);
    set('v-h', p2(Math.floor(ms / 36e5) % 24)); set('v-mi', p2(Math.floor(ms / 6e4) % 60)); set('v-s', p2(Math.floor(ms / 1e3) % 60));
    set('v-horas', Math.floor(ms / 36e5).toLocaleString('es-CO')); set('v-lat', Math.floor(ms / 6e4 * 70).toLocaleString('es-CO'));
    const f = $('#faltan'), left = A - now, hoy = now >= A && now - A < 864e5;
    $('#aro').style.strokeDashoffset = 327 * (1 - Math.min(1, ms / (A - S)));
    if (hoy) { f.textContent = '¡Hoy cumplimos nuestro primer año, mi amor!'; if (!confeti) { confeti = true; lluvia(); } }
    else if (left > 0) { const dd = Math.floor(left / 864e5), hh = Math.floor(left % 864e5 / 36e5), mm = Math.floor(left % 36e5 / 6e4), ss = Math.floor(left % 6e4 / 1e3), u = (n, a, b) => `${n} ${n === 1 ? a : b}`;
      const t = dd > 0 ? `${u(dd, 'día', 'días')} & ${u(hh, 'hora', 'horas')}` : hh > 0 ? `${u(hh, 'hora', 'horas')} & ${u(mm, 'minuto', 'minutos')}` : mm > 0 ? `${u(mm, 'minuto', 'minutos')} & ${u(ss, 'segundo', 'segundos')}` : u(ss, 'segundo', 'segundos');
      f.textContent = `Faltan ${t} para nuestro primer año.`; }
    else f.textContent = 'Ya cumplimos nuestro primer año, y lo que viene.';
  }
  function lluvia() { if (reduced) return; for (let i = 0; i < 90; i++) { const c = document.createElement('i'); c.className = 'conf'; c.style.cssText = `left:${rnd(0, 100)}%;background:${['#ff2e7e', '#ffd86b', '#b9a2ff', '#ff7a59', '#fff'][i % 5]};--t:${rnd(3, 6)}s;--dl:${rnd(0, 2)}s;--sw:${rnd(-120, 120)}px;border-radius:${i % 2 ? '50%' : '2px'}`; document.body.appendChild(c); c.addEventListener('animationend', () => c.remove()); } }
  tick(); setInterval(tick, 1000);
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { tick(); o.disconnect(); } }, { threshold: .3 }).observe($('.vivo'));
  $('#corazon').addEventListener('click', lluvia);

  /* ===== Escenas fijas: tambor + amanecer ===== */
  const sp = s => { const r = s.getBoundingClientRect(), h = s.offsetHeight - innerHeight; return Math.min(1, Math.max(0, -r.top / h)); }, cl01 = v => Math.min(1, Math.max(0, v)), sm = (a, b, v) => { const t = cl01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const drum = $('#recuerdos'), dr = $('#dr'), dp = $('#dphoto'), dc = $('#dcount'), n = D.fotos.length, STEP = 15, lis = [], pics = [];
  D.fotos.forEach((f, i) => { const li = document.createElement('li'); li.textContent = f.titulo; if (f.titulo.length > 26) li.style.setProperty('--k', (26 / f.titulo.length).toFixed(2)); /* frases largas: letra más pequeña para que quepan */ dr.appendChild(li); lis.push(li); const p = document.createElement('i'); p.style.backgroundImage = `url('${f.src}')`; p.style.backgroundPosition = f.pos; dp.appendChild(p); pics.push(p); });
  const fl = $('#flood'), sol = $('#sol'), fa = $('#fa'), fb = $('#fb'), fst = fl.querySelector('.stage2');
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');
  function sceneTick() {
    if (!ready) return;
    const vh = innerHeight;
    if (drum.getBoundingClientRect().top < vh && drum.getBoundingClientRect().bottom > 0) {
      let pos = sp(drum) * (n - 1), f = pos % 1; pos = Math.floor(pos) + (f * f * (3 - 2 * f)); if (pos > n - 1) pos = n - 1;
      dr.style.transform = `translateZ(${-vh * .4}px)`;
      lis.forEach((li, i) => { const d = i - pos, a = d * STEP; li.style.transform = `rotateX(${-a}deg) translateZ(${vh * .4}px)`; li.style.opacity = Math.max(0, 1 - Math.abs(d) / 4.2).toFixed(2); li.classList.toggle('on', Math.abs(d) < .5); });
      pics.forEach((p, i) => { const d = i - pos, o = cl01(1 - Math.abs(d) * 1.5); p.style.opacity = o.toFixed(2); p.style.transform = `translateY(${d * 36}px) scale(${1 + Math.abs(d) * .08}) rotate(${d * 3}deg)`; });
      dp.style.setProperty('--rot', (Math.sin(pos * 1.3) * 3).toFixed(1) + 'deg');
      const k = Math.round(pos), ft = D.fotos[k]; dc.textContent = `${p2(k + 1)} / ${p2(n)} · ${new Date(ft.fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
    const r = fl.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) {
      const p = sp(fl), flood = sm(.45, .95, p);
      sol.style.transform = `translateX(-50%) scale(${(.1 + sm(0, .85, p) * 1.1).toFixed(3)})`;
      fst.style.background = `rgb(${mix([22, 5, 15], [255, 46, 126], flood)})`;
      const ta = sm(.05, .35, p), tb = sm(.3, .62, p);
      fa.style.opacity = ta; fa.style.filter = `blur(${((1 - ta) * 16).toFixed(1)}px)`; fa.style.transform = `translateY(${((1 - ta) * 40).toFixed(0)}px)`;
      fb.style.opacity = tb; fb.style.filter = `blur(${((1 - tb) * 16).toFixed(1)}px)`; fb.style.transform = `translateY(${((1 - tb) * 40).toFixed(0)}px)`;
    }
  }
  const fw = $('#footWord'); fw.innerHTML = [...fw.textContent].map((c, i) => `<span style="--d:${(i * .07).toFixed(2)}s">${c}</span>`).join('');
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { fw.classList.add('in'); o.disconnect(); } }, { threshold: .3 }).observe(fw);
  ready = true; sceneTick(); addEventListener('resize', sceneTick);

  /* ===== Cartas: filtros, paginación, carta de hoy ===== */
  const sob = $('#sobres'), mas = $('#cMas'), cont = $('#cCont'); let voz = -1, lista = [], shownN = 0;
  const abrir = c => { const b = sob.children[c.n - 1]; D.abrirCarta(c, b || null); };
  function pintar(reset) {
    if (reset) { sob.innerHTML = ''; shownN = 0; lista = D.cartas.filter(c => voz < 0 || c.voz === voz); }
    lista.slice(shownN, shownN + 24).forEach(c => D.crearSobre(c, c.n - 1)); shownN = Math.min(lista.length, shownN + 24);
    cont.textContent = `${shownN} de ${lista.length} cartas`; mas.style.display = shownN >= lista.length ? 'none' : '';
  }
  mas.addEventListener('click', () => pintar(false));
  $('#cAzar').addEventListener('click', () => abrir(D.cartas[Math.floor(Math.random() * D.cartas.length)]));
  $('#cHoy').addEventListener('click', () => abrir(D.cartas[Math.max(0, Math.floor((new Date() - S) / 864e5)) % D.cartas.length]));
  pintar(true);
})();

/* ===== Video: se reproduce solo y en silencio ===== */
(() => {
  const v = document.getElementById('vidSolo'); if (!v) return;
  v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.removeAttribute('controls');
  const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  go();
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? go() : v.pause()), { threshold: .25 }).observe(v);
  ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev => addEventListener(ev, function f() { if (v.paused) go(); removeEventListener(ev, f); }, { once: true, passive: true }));
})();

/* ===== Botón de mensaje: una sola vez, a un contacto específico (WhatsApp) ===== */
(() => {
  const btn = document.getElementById('msgBtn'); if (!btn) return;
  const NUMERO = '573028232007'; // 57 (Colombia) + 3028731717
  const MENSAJE = 'Mi amor, acabo de llegar al final de nuestra página 💕 Gracias por este primer año a tu lado, por cada risa, cada abrazo y cada día. Te amo hoy, mañana y por siempre. Por siempre tú 💕';
  const KEY = 'mensaje-enviado-v1', txt = document.getElementById('msgTxt'), note = document.getElementById('msgNote');
  const yaEnviado = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const bloquear = () => { btn.disabled = true; btn.classList.add('sent'); txt.textContent = 'Mensaje enviado 💕'; note.textContent = 'Ya llegó mi mensaje. Gracias por leerlo.'; };
  if (yaEnviado()) bloquear();
  btn.addEventListener('click', () => {
    if (btn.disabled || yaEnviado()) { bloquear(); return; }
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    bloquear();
    window.open('https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(MENSAJE), '_blank', 'noopener');
  });
})();

/* ===== Música suave: empieza sola al llegar a "Momentos" (sin botón) ===== */
(() => {
  const a = document.getElementById('bgAudio'), sec = document.getElementById('galeria');
  if (!a || !sec) return;
  const VOL = 0.3, FADE = 3000;
  let sonando = false, llegó = false, fadeT = null;
  a.volume = 0; a.loop = false; /* suena una sola vez */
  const btn = document.getElementById('audioBtn'); let detenido = false; /* detenido: lo pausó ella/él o ya terminó */
  const fadeTo = v => { clearInterval(fadeT); const v0 = a.volume, t0 = performance.now(); fadeT = setInterval(() => { const p = Math.min(1, (performance.now() - t0) / FADE); a.volume = Math.max(0, Math.min(1, v0 + (v - v0) * p)); if (p >= 1) clearInterval(fadeT); }, 60); };
  const sonar = () => {
    if (sonando || detenido) return;
    a.muted = false;
    const p = a.play();
    if (p && p.then) p.then(() => { sonando = true; fadeTo(VOL); }).catch(() => {}); else { sonando = true; fadeTo(VOL); }
  };
  // Desbloqueo: en el primer toque/clic/tecla en cualquier parte, el navegador permite audio después
  let desbloqueado = false;
  const desbloquear = () => {
    if (desbloqueado) return; desbloqueado = true;
    if (llegó) { sonar(); return; }
    a.volume = 0; const p = a.play();
    if (p && p.then) p.then(() => { if (!llegó) a.pause(); else { sonando = true; fadeTo(VOL); } }).catch(() => { desbloqueado = false; });
  };
  ['pointerdown', 'keydown', 'touchend', 'click'].forEach(ev => addEventListener(ev, () => { desbloquear(); if (llegó && !sonando) sonar(); }, { passive: true }));
  const revisar = () => {
    if (llegó) return;
    const r = sec.getBoundingClientRect();
    if (r.top < innerHeight * .65 && r.bottom > innerHeight * .2) { llegó = true; window.__audioLlego = true; sonar(); }
  };
  if (btn) {
    a.addEventListener('playing', () => { if (window.__audioLlego && !detenido) btn.classList.add('vis'); });
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pausar = !detenido;
      detenido = pausar; btn.classList.toggle('off', pausar); btn.setAttribute('aria-pressed', String(pausar));
      const t = pausar ? 'Reanudar música' : 'Pausar música'; btn.setAttribute('aria-label', t); btn.title = t;
      if (pausar) { clearInterval(fadeT); a.pause(); sonando = false; } else sonar();
    });
  }
  a.addEventListener('ended', () => { clearInterval(fadeT); sonando = false; detenido = true; if (btn) btn.classList.remove('vis'); });
  addEventListener('scroll', revisar, { passive: true }); addEventListener('resize', revisar); revisar();
})();

/* ===== Pantalla de entrada: un toque desbloquea el audio para todo el recorrido ===== */
(() => {
  const ov = document.getElementById('entrada'), b = document.getElementById('entrarBtn');
  if (!ov || !b) return;
  const a = document.getElementById('bgAudio');
  const entrar = () => {
    // desbloquea el audio dentro del gesto del usuario (queda en pausa hasta "Momentos")
    if (a) { try { a.muted = false; a.volume = 0; const p = a.play(); if (p && p.then) p.then(() => { if (!window.__audioLlego) a.pause(); }).catch(() => {}); } catch (e) {} }
    document.body.classList.remove('bloq');
    ov.classList.add('fuera');
    setTimeout(() => ov.remove(), 1000);
  };
  b.addEventListener('click', entrar);
  addEventListener('keydown', e => { if (e.key === 'Enter' && document.getElementById('entrada')) entrar(); });
  setTimeout(() => b.focus({ preventScroll: true }), 100);
})();
