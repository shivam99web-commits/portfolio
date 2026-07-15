/* ============================================================
   WORQ Clone — Script
   ============================================================ */

/* ── Scroll to top ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Sticky nav shadow ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0)' : 'none';
});

/* ── Nav overlay ── */
const navToggle    = document.getElementById('navToggle');
const menuOverlay  = document.getElementById('menuOverlay');
const menuClose    = document.getElementById('menuClose');
const menuBackdrop = document.getElementById('menuBackdrop');

function openMenu() {
  menuOverlay.classList.add('open');
  menuBackdrop.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  menuOverlay.classList.remove('open');
  menuBackdrop.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuBackdrop.addEventListener('click', closeMenu);
menuOverlay.querySelectorAll('.menu-link').forEach(a =>
  a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── Work filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    workCards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.transition = 'opacity .25s, transform .25s';
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 260);
      }
    });
  });
});

/* ── Skill bars (triggered on scroll into view) ── */
const skillFills   = document.querySelectorAll('.skill-fill');
let skillsDone     = false;
const skillSection = document.getElementById('skills');

function triggerSkills(entries) {
  entries.forEach(e => {
    if (e.isIntersecting && !skillsDone) {
      skillsDone = true;
      skillFills.forEach(f => { f.style.width = f.dataset.pct + '%'; });
    }
  });
}

if ('IntersectionObserver' in window && skillSection) {
  new IntersectionObserver(triggerSkills, { threshold: 0.25 }).observe(skillSection);
} else {
  skillFills.forEach(f => { f.style.width = f.dataset.pct + '%'; });
}

/* ── Testimonials slider ── */
const track    = document.getElementById('testiTrack');
const viewport = track ? track.closest('.testi-viewport') : null;
const cards    = track ? [...track.querySelectorAll('.testi-card')] : [];
let idx        = 0;
const GAP      = 16;

function visibleCount() { return window.innerWidth > 700 ? 2 : 1; }

function setCardWidths() {
  if (!viewport || !cards.length) return;
  const count = visibleCount();
  const cardW = (viewport.offsetWidth - GAP * (count - 1)) / count;
  cards.forEach(c => { c.style.width = cardW + 'px'; });
}

function goTo(n) {
  if (!cards.length) return;
  const max = cards.length - visibleCount();
  idx = Math.max(0, Math.min(n, max));
  const w = cards[0].offsetWidth + GAP;
  track.style.transform = `translateX(-${idx * w}px)`;
}

function init() { setCardWidths(); goTo(0); }

document.getElementById('tNext')?.addEventListener('click', () => goTo(idx + 1));
document.getElementById('tPrev')?.addEventListener('click', () => goTo(idx - 1));
window.addEventListener('resize', init);
init();

// auto-advance
setInterval(() => {
  const max = cards.length - visibleCount();
  goTo(idx < max ? idx + 1 : 0);
}, 5000);

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── Scroll fade-in ── */
if ('IntersectionObserver' in window) {
  const animEls = document.querySelectorAll(
    '.service-card, .work-card, .award-card, .skill-item, .tl-item, .testi-card, .award-chip'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    obs.observe(el);
  });

  /* ── Service panel body reveal ── */
  const svcBodies = document.querySelectorAll('.svc-body');

  function revealSvcBodies() {
    svcBodies.forEach(el => {
      if (el.classList.contains('in-view')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        el.classList.remove('svc-hidden');
        el.classList.add('in-view');
      }
    });
  }

  /* Hide initially via JS so CSS fallback never leaves panels invisible */
  svcBodies.forEach(el => el.classList.add('svc-hidden'));

  /* Check on load, scroll, and after short delay for sticky panels */
  revealSvcBodies();
  window.addEventListener('scroll', revealSvcBodies, { passive: true });
  setTimeout(revealSvcBodies, 300);
}
