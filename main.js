/* ══════════════════════════════════════════
   GRAIN — canvas-based animated noise
══════════════════════════════════════════ */
const canvas = document.getElementById('grainCanvas');
const ctx    = canvas.getContext('2d');
let gw, gh;

function resizeGrain() {
  gw = canvas.width  = window.innerWidth;
  gh = canvas.height = window.innerHeight;
}
resizeGrain();
window.addEventListener('resize', resizeGrain, { passive: true });

function drawGrain() {
  const imageData = ctx.createImageData(gw, gh);
  const data      = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = data[i+1] = data[i+2] = v;
    data[i+3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawGrain);
}
drawGrain();

/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const cur     = document.getElementById('cur');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function raf() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(raf);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hov'); curRing.classList.add('hov'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); curRing.classList.remove('hov'); });
});

/* ══════════════════════════════════════════
   NAV SCROLL
══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

/* ══════════════════════════════════════════
   MOBILE NAV
══════════════════════════════════════════ */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  drawer.classList.toggle('open');
});
drawer.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
  })
);

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const d  = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), d);
    io.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ══════════════════════════════════════════
   HERO — IMMEDIATE STAGGER
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .fade-up').forEach(el => {
    const d = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), 80 + d);
  });
});

/* ══════════════════════════════════════════
   FAQ
══════════════════════════════════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cform.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓  Request received — we\'ll be in touch soon.';
    btn.style.background = 'rgba(147,97,255,0.15)';
    btn.style.color = 'rgba(200,170,255,0.9)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      cform.reset();
    }, 4500);
  });
}

/* ══════════════════════════════════════════
   SMOOTH ANCHOR
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════
   PORTFOLIO — TILT + COUNT-UP
══════════════════════════════════════════ */
document.querySelectorAll('.folio-item').forEach(item => {
  const img    = item.querySelector('.folio-img');
  const stat   = item.querySelector('.f-stat');
  const target = parseInt(stat?.dataset.target || 0);
  let counted  = false;

  function onTilt(e) {
    const r = item.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    img.style.transform        = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
    img.style.transitionDuration = '0.08s';
  }

  item.addEventListener('mouseenter', () => {
    if (!counted && stat) {
      counted = true;
      let n = 0;
      const step = () => {
        n = Math.min(n + Math.ceil(target / 18), target);
        stat.textContent = '+' + n + '%';
        if (n < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    item.addEventListener('mousemove', onTilt);
  });

  item.addEventListener('mouseleave', () => {
    img.style.transitionDuration = '0.5s';
    img.style.transform = '';
    item.removeEventListener('mousemove', onTilt);
  });
});

/* ══════════════════════════════════════════
   AMBIENT — MOUSE PARALLAX
══════════════════════════════════════════ */
const blob1 = document.querySelector('.amb--1');
const blob2 = document.querySelector('.amb--2');
window.addEventListener('mousemove', e => {
  const fx = (e.clientX / window.innerWidth  - 0.5);
  const fy = (e.clientY / window.innerHeight - 0.5);
  if (blob1) blob1.style.transform = `translateX(calc(-50% + ${fx * 35}px)) translateY(${fy * 25}px) scale(1)`;
  if (blob2) blob2.style.transform = `translateX(${-fx * 20}px) translateY(${-fy * 18}px) scale(1)`;
}, { passive: true });

/* ══════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════ */
const heroH1  = document.querySelector('.hero__h1');
const heroSub = document.querySelector('.hero__sub');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroH1)  heroH1.style.transform  = `translateY(${y * 0.16}px)`;
  if (heroSub) heroSub.style.transform = `translateY(${y * 0.09}px)`;
}, { passive: true });

/* ══════════════════════════════════════════
   TICKER PAUSE ON HOVER
══════════════════════════════════════════ */
[document.getElementById('ticker'), document.getElementById('mq2')].forEach(el => {
  if (!el) return;
  el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
  el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
});

/* ══════════════════════════════════════════
   VIDEO — ensure autoplay
══════════════════════════════════════════ */
const vid = document.querySelector('.hero__video');
if (vid) {
  vid.play().catch(() => {
    // autoplay blocked — video stays as static frame
    vid.load();
  });
}

/* ══════════════════════════════════════════
   TESTIMONIAL CAROUSEL
══════════════════════════════════════════ */
(function() {
  const track  = document.getElementById('testiTrack');
  const dots   = document.querySelectorAll('.testi-dot');
  const prev   = document.getElementById('testiPrev');
  const next   = document.getElementById('testiNext');
  if (!track) return;

  const total  = document.querySelectorAll('.testi-slide').length;
  let current  = 0;
  let timer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  next.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  prev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  dots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.idx); startAuto(); }));

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  // Pause on hover
  track.closest('.testi-card').addEventListener('mouseenter', () => clearInterval(timer));
  track.closest('.testi-card').addEventListener('mouseleave', startAuto);

  startAuto();
})();
