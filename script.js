/* ============================================
   KINGYM & King Padel Lagonisi — script.js
   ============================================ */

/* ---------- AOS Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
});

/* ---------- Header Scroll Effect ---------- */
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 40);

  // Hide header on fast scroll down, show on scroll up
  if (scrollY > lastScroll + 4 && scrollY > 200) {
    header.style.transform = 'translateY(-100%)';
  } else if (scrollY < lastScroll - 4 || scrollY < 100) {
    header.style.transform = 'translateY(0)';
  }
  lastScroll = scrollY;
}, { passive: true });

header.style.transition = 'background 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)';

/* ---------- Mobile Nav Toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- Active Nav Link on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- Hero Parallax ---------- */
const heroBg = document.getElementById('heroBg');

if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const limit    = window.innerHeight;
    if (scrolled < limit) {
      heroBg.style.transform = `scale(1.12) translateY(${scrolled * 0.18}px) translateX(-2%)`;
    }
  }, { passive: true });
}

/* ---------- Carousel ---------- */
(function initCarousel() {
  const viewport = document.querySelector('.carousel__viewport');
  const inner    = document.querySelector('.carousel__track-inner');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');

  if (!inner || !viewport) return;

  const cards   = Array.from(inner.children);
  const total   = cards.length;
  let current   = 0;
  let autoTimer = null;

  // Set card widths to viewport width for reliable layout
  function resize() {
    const w = viewport.clientWidth;
    cards.forEach(card => { card.style.width = w + 'px'; });
    inner.style.width = (w * total) + 'px';
    inner.style.transform = `translateX(-${current * w}px)`;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Κριτική ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    const w = viewport.clientWidth;
    inner.style.transform = `translateX(-${current * w}px)`;
    dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch / swipe support
  let touchStartX = 0;
  const swipeThreshold = 50;

  viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > swipeThreshold) delta > 0 ? next() : prev();
  }, { passive: true });

  // Auto-advance
  function startAuto()  { autoTimer = setInterval(next, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  startAuto();

  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAuto);
  }
})();

/* ---------- Schedule Row Stagger ---------- */
(function animateScheduleRows() {
  const rows = document.querySelectorAll('.schedule__day-col');
  if (!rows.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rows.forEach((row, i) => {
          row.style.opacity = '0';
          row.style.transform = 'translateY(24px)';
          row.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`;
          requestAnimationFrame(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          });
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const wrapper = document.querySelector('.schedule__wrapper');
  if (wrapper) observer.observe(wrapper);
})();

/* ---------- Smooth Scroll Offset (for fixed header) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Counter Animation for rating badge ---------- */
(function animateRating() {
  const badge = document.querySelector('.hero__badge');
  if (!badge) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        badge.style.animation = 'fadeSlideDown 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards';
        observer.disconnect();
      }
    });
  });

  observer.observe(badge);
})();

/* ---------- CSS Animations injection (for AOS fallback) ---------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
