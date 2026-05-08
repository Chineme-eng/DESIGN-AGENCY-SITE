/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function trackRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(trackRing);
})();

document.querySelectorAll('a, button, [data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorRing.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorRing.classList.remove('hover');
  });
});

/* ============================================
   NAV — SCROLL
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ============================================
   NAV — MOBILE
   ============================================ */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');

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

/* ============================================
   FADE-UP ON SCROLL
   ============================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    // Stagger siblings in the same parent grid/list
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll('.fade-up:not(.in)')];
    const sibIdx = siblings.indexOf(el);
    const extraDelay = parent.classList.contains('fade-up') ? 0 : sibIdx * 55;
    setTimeout(() => el.classList.add('in'), delay + extraDelay);
    observer.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ============================================
   HERO — IMMEDIATE REVEAL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero .fade-up');
  heroEls.forEach(el => {
    const d = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), 100 + d);
  });
});

/* ============================================
   FAQ ACCORDION
   ============================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ============================================
   CONTACT FORM
   ============================================ */
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cform.querySelector('button[type="submit"]');
    btn.textContent = '✓ Request sent — we\'ll be in touch soon.';
    btn.style.background = '#1a1a1a';
    btn.style.color = '#d4c9b8';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Submit your request';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      cform.reset();
    }, 4000);
  });
}

/* ============================================
   SMOOTH ANCHOR SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
  });
});

/* ============================================
   PORTFOLIO — TILT + COUNT-UP ON HOVER
   ============================================ */
document.querySelectorAll('.folio-item').forEach(item => {
  const img  = item.querySelector('.folio-item__img');
  const stat = item.querySelector('.folio-stat');
  const target = parseInt(stat?.dataset.target || 0);
  let animated = false;

  item.addEventListener('mouseenter', () => {
    if (!animated) {
      animated = true;
      let n = 0;
      const step = () => {
        n = Math.min(n + Math.ceil(target / 20), target);
        stat.textContent = '+' + n + '%';
        if (n < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    // 3D tilt starts
    item.addEventListener('mousemove', onTilt);
  });

  item.addEventListener('mouseleave', () => {
    img.style.transform = '';
    item.removeEventListener('mousemove', onTilt);
  });

  function onTilt(e) {
    const r   = item.getBoundingClientRect();
    const x   = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y   = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    img.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
    img.style.transition = 'transform 0.1s linear';
  }
});

/* ============================================
   AMBIENT BLOB — MOUSE PARALLAX
   ============================================ */
const blob1 = document.querySelector('.ambient__blob--1');
window.addEventListener('mousemove', e => {
  const dx = (e.clientX / window.innerWidth  - 0.5) * 30;
  const dy = (e.clientY / window.innerHeight - 0.5) * 20;
  if (blob1) blob1.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px)`;
}, { passive: true });

/* ============================================
   HERO SCROLL PARALLAX
   ============================================ */
const heroH1 = document.querySelector('.hero__h1');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroH1) heroH1.style.transform = `translateY(${y * 0.18}px)`;
}, { passive: true });

/* ============================================
   TICKER — PAUSE ON HOVER
   ============================================ */
const tickerEl = document.getElementById('ticker');
const marquee2 = document.getElementById('marquee2');
[tickerEl, marquee2].forEach(el => {
  if (!el) return;
  el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
  el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
});
