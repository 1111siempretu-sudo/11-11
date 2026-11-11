(() => {
  const { nombre, inicio, fotos } = window.NOSOTROS;
  const day = s => new Date(s + 'T00:00:00');
  const pad = n => String(n).padStart(2, '0');
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fecha = s => day(s).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const data = fotos.map((f, i) => ({ ...f, n: i + 1, days: Math.max(0, Math.round((day(f.fecha) - day(inicio)) / 864e5)) }));
  const heart = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C5 15.5 1.5 12 1.5 7.6A5.1 5.1 0 0 1 12 5.2a5.1 5.1 0 0 1 10.5 2.4C22.5 12 19 15.5 12 21Z" fill="currentColor"/></svg>';
  const cardsEl = document.querySelector('.cards'), codesEl = document.querySelector('.codes'), belt = document.querySelector('.belt');
  const fx = document.querySelector('.fx'), ctx = fx.getContext('2d');
  const numberEl = document.querySelector('.badge-number');
  const particles = [], reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cw = 0, ch = 0, gap = 0, span = 0, period = 0, lx = 0, dpr = 1;
  let off = 0, vel = 0, hover = 0, last = performance.now(), activeId = -1, shown = 0;
  let dragging = false, pointerId = null, lastX = 0, lastMove = 0;
  const palette = ['#E11D5A', '#F43F7A', '#FB6F9A', '#FFA3BF', '#FFC9D9', '#FFE3EC', '#FFF3F6'];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const mod = (n, m) => ((n % m) + m) % m;
  const hash = (a, b, c) => { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = ((h ^ (h >>> 13)) * 1274126177) | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  function build() {
    cardsEl.innerHTML = data.map((d, i) => `<article class="card" data-i="${i}"><div class="photo" style="background-image:url('${d.src}');background-position:${d.pos || '50% 50%'}"></div></article>`).join('');
    codesEl.innerHTML = data.map(d => `<div class="code"><div class="code-html">${esc('💕 ' + d.titulo + '\n\n' + d.frase.join('\n'))}</div><div class="code-meta">${esc('// ' + fecha(d.fecha) + '\n// recuerdo ' + pad(d.n) + ' de ' + pad(data.length) + '\n// con todo mi amor')}</div></div>`).join('');
  }
  function measure() {
    const card = cardsEl.querySelector('.card'); if (!card) return;
    const r = card.getBoundingClientRect(); cw = r.width; ch = r.height;
    gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) / 100 * innerWidth;
    span = cw + gap; period = span * data.length; lx = innerWidth / 2; dpr = Math.min(devicePixelRatio || 1, 2);
    fx.width = Math.round(belt.clientWidth * dpr); fx.height = Math.round(belt.clientHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!off) off = innerWidth / 2 - .62 * cw;
  }
  const position = i => mod(off + i * span + span, period) - span;
  function applyCard(el, code, x, cut) {
    el.style.transform = `translate3d(${x}px,0,0)`;
    if (cut > 0) { el.style.clipPath = `inset(0 0 0 ${cut}px round 0 ${innerWidth * .016}px ${innerWidth * .016}px 0)`; el.style.webkitMaskImage = `linear-gradient(90deg, transparent ${cut}px, #000 ${cut + 26}px)`; }
    else { el.style.clipPath = 'none'; el.style.webkitMaskImage = 'none'; }
    code.style.transform = `translate3d(${x}px,0,0)`;
    code.style.clipPath = `inset(0 ${Math.max(0, cw - cut)}px 0 0)`;
    code.style.visibility = cut > 0 ? 'visible' : 'hidden';
  }
  function spawn(x, y, idx) { const life = .3 + hash(idx, Math.floor(x), Math.floor(y)) * .8; particles.push({ x, y, vx: -30 + hash(idx, 2, 4) * 70 + vel * .6, vy: -25 + hash(idx, 3, 5) * 50, life, size: .8 + hash(idx, 5, 6) * 1.8, color: palette[Math.floor(hash(idx, 6, 7) * palette.length)] }); }
  function drawFx(t, dt, crossings) {
    ctx.clearRect(0, 0, belt.clientWidth, belt.clientHeight);
    const yTop = 70;
    for (const c of crossings) {
      const w = Math.min(150, c.x + cw - lx); if (w <= 0) continue;
      const haze = ctx.createLinearGradient(lx, 0, lx + w, 0); haze.addColorStop(0, 'rgba(225,29,90,.4)'); haze.addColorStop(1, 'rgba(225,29,90,0)'); ctx.fillStyle = haze; ctx.fillRect(lx, yTop, w, ch);
      const R = cw * .3, start = Math.max(c.cut, 0), end = Math.min(cw, start + R + 30), cols = Math.ceil(end / 3);
      for (let gx = Math.floor(start / 3); gx < cols; gx++) {
        const sx = c.x + gx * 3, d = sx - lx, p = Math.pow(clamp(1 - d / R, 0, 1), 1.7); if (p <= 0) continue;
        for (let row = -5; row < Math.ceil(ch / 3) + 5; row++) {
          const inside = row >= 0 && row <= ch / 3;
          const q = inside ? p * .92 : p * .16 * clamp(1 - Math.abs(row - (row < 0 ? -1 : ch / 3)) / 5, 0, 1);
          if (hash(gx, row, c.index) >= q) continue;
          if (!reduced && hash(gx, row, Math.floor(t * 9) + 97) < .22) continue;
          const h2 = hash(row, gx, c.index + 31);
          ctx.fillStyle = palette[d < 10 ? 4 + Math.floor(h2 * 3) : Math.floor(h2 * h2 * 7)];
          const s = 1.1 + h2 * 1.7;
          ctx.fillRect(sx + (hash(row, gx, 8) - .5) * 1.6, yTop + row * 3 + (hash(gx, row, 9) - .5) * 1.6, s, s);
        }
      }
      if (!reduced) for (let s = 0; s < 3; s++) if (Math.random() < .7) spawn(lx + Math.random() * 30, yTop - 10 + Math.random() * (ch + 20), c.index);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 2.2); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const target = reduced ? 0 : -0.036 * innerWidth * (1 - .6 * hover);
    if (!dragging) { vel += (target - vel) * (1 - Math.exp(-1.4 * dt)); off += vel * dt; }
    const cardEls = cardsEl.querySelectorAll('.card'), photoEls = cardsEl.querySelectorAll('.photo'), codeEls = codesEl.querySelectorAll('.code'), crossings = [];
    let active = null, prog = 0;
    cardEls.forEach((el, i) => {
      const x = position(i), cut = clamp(lx - x, 0, cw);
      applyCard(el, codeEls[i], x, cut);
      photoEls[i].style.transform = `translate3d(${(lx - x - cw / 2) * .04}px,0,0) scale(1.16)`;
      if (cut > 0 && cut < cw) { if (!active || x > active.x) { active = { i, x }; prog = cut / cw; } crossings.push({ x, cut, index: i }); }
    });
    hover += (((belt.matches(':hover') && !dragging) ? 1 : 0) - hover) * clamp(dt * 4, 0, 1);
    if (active) {
      if (active.i !== activeId) { activeId = active.i; shown = 0; }
      shown += (data[active.i].days * prog - shown) * clamp(dt * 14, 0, 1);
      numberEl.textContent = new Date(data[active.i].fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    drawFx(now / 1000, dt, crossings);
    requestAnimationFrame(frame);
  }
  belt.addEventListener('pointerdown', e => { dragging = true; pointerId = e.pointerId; lastX = e.clientX; lastMove = performance.now(); belt.classList.add('dragging'); belt.setPointerCapture(pointerId); });
  belt.addEventListener('pointermove', e => { if (!dragging || e.pointerId !== pointerId) return; const now = performance.now(), dx = e.clientX - lastX, ms = Math.max(8, now - lastMove); off += dx; vel = dx / ms * 1000 * .8 + vel * .2; lastX = e.clientX; lastMove = now; });
  const up = () => { if (!dragging) return; dragging = false; pointerId = null; belt.classList.remove('dragging'); };
  belt.addEventListener('pointerup', up); belt.addEventListener('pointercancel', up);
  belt.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); vel -= e.deltaX * 6; } }, { passive: false });
  build(); requestAnimationFrame(() => { measure(); requestAnimationFrame(frame); }); addEventListener('resize', measure);
})();
