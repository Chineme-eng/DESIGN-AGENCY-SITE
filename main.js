/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursor = document.createElement('div');
cursor.classList.add('cursor');
const follower = document.createElement('div');
follower.classList.add('cursor-follower');
document.body.appendChild(cursor);
document.body.appendChild(follower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* =============================================
   NAV — SCROLL EFFECT
   ============================================= */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* =============================================
   NAV — MOBILE HAMBURGER
   ============================================= */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* =============================================
   FAQ ACCORDION
   ============================================= */
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq__question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(i => i.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

/* =============================================
   CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sent! We\'ll be in touch.';
    btn.style.background = '#e8e0d0';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

/* =============================================
   SMOOTH ANCHOR SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =============================================
   HERO HEADLINE — STAGGER ON LOAD
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    setTimeout(() => heroContent.classList.add('visible'), 120);
  }
  const heroFeatured = document.querySelector('.hero__featured');
  if (heroFeatured) {
    setTimeout(() => heroFeatured.classList.add('visible'), 400);
  }
});

/* =============================================
   PARALLAX — subtle hero glow
   ============================================= */
const heroBgGlow = document.querySelector('.hero__bg-glow');
if (heroBgGlow) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.3;
    heroBgGlow.style.transform = `translateX(-50%) translateY(${y}px)`;
  }, { passive: true });
}

/* =============================================
   PORTFOLIO ITEMS — tilt on hover
   ============================================= */
document.querySelectorAll('.portfolio__item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    item.querySelector('.portfolio__img').style.transform =
      `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.querySelector('.portfolio__img').style.transform = '';
  });
});

/* =============================================
   TYPING / NUMBER COUNT-UP (stats)
   ============================================= */
function countUp(el, target, duration = 1200) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = '+' + Math.round(start) + '%';
  }, 16);
}

// Trigger count-up when portfolio stats become visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stat = entry.target;
      const text = stat.textContent;
      const match = text.match(/\+(\d+)%/);
      if (match) {
        countUp(stat, parseInt(match[1]));
        statsObserver.unobserve(stat);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.portfolio__stat').forEach(el => statsObserver.observe(el));
