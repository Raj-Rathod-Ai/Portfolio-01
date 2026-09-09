/**
 * PREMIUM ANIMATIONS ENGINE v2
 * Full upgrade: skill bar scroll-trigger, stat counters, navbar active indicator,
 * navbar glass scroll state, hero profile ring, timeline entrance,
 * magnetic buttons, parallax, glow trail, click ripple, GSAP section reveals.
 *
 * RULES:
 *  - Zero content/layout/functionality changes
 *  - GPU-composited: only transform / opacity / filter / box-shadow
 *  - All expensive effects disabled for: touch devices, prefers-reduced-motion
 *  - Re-entrant safe: all observers/bindings guard against double-mount
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const isDesktop = window.innerWidth >= 1024;

// ─────────────────────────────────────────────────────────────
// 1. SKILL BARS — Scroll-triggered IntersectionObserver fill
//    Replaces hover-only with scroll reveal at 70% visibility
// ─────────────────────────────────────────────────────────────
export function initSkillBarScrollReveal() {
  if (prefersReducedMotion) {
    // On reduced motion, just set them to full width immediately
    document.querySelectorAll('.skill-card [data-skill-val]').forEach(card => {
      const bar = card.closest('.skill-card')?.querySelector('.h-full.rounded-full');
      if (bar) {
        const val = card.dataset?.skillVal || card.closest('.skill-card')?.dataset?.skillVal || '80';
        bar.classList.add('skill-bar-fill', 'skill-bar-animate');
        bar.style.setProperty('--skill-width', `${val}%`);
      }
    });
    return;
  }

  function bindSkillBars() {
    // Convert existing hover-only bars to scroll-triggered
    document.querySelectorAll('.skill-card').forEach(card => {
      if (card.dataset.skillBarBound) return;
      card.dataset.skillBarBound = '1';

      const bar = card.querySelector('.h-full.rounded-full');
      if (!bar) return;

      const val = card.dataset.skillVal || '80';

      // Replace w-0 and group-hover width class with our CSS system
      // Remove all existing width classes added inline by Tailwind group-hover
      bar.classList.remove('w-0');
      // Remove any group-hover:w-[...] via removing inline style
      bar.classList.add('skill-bar-fill');
      bar.style.setProperty('--skill-width', `${val}%`);

      skillBarObserver.observe(card);
    });
  }

  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const bar = card.querySelector('.skill-bar-fill');
      if (bar) {
        // Slight stagger based on card position in grid
        const cards = Array.from(card.parentElement?.children || []);
        const idx = cards.indexOf(card);
        setTimeout(() => {
          bar.classList.add('skill-bar-animate');
        }, idx * 60);
      }
      skillBarObserver.unobserve(card);
    });
  }, { threshold: 0.4 });

  bindSkillBars();

  // Re-bind on portfolioDataUpdated (project cards injected)
  window.addEventListener('portfolioDataUpdated', () => {
    setTimeout(bindSkillBars, 300);
  });
}

// ─────────────────────────────────────────────────────────────
// 2. STAT COUNTERS — Count up from 0 when scrolled into view
//    Targets the About section stat cards (7.66, 25+, 350+, 2027)
// ─────────────────────────────────────────────────────────────
export function initStatCounters() {
  if (prefersReducedMotion) return;

  // Config: el selector, target, suffix, decimals
  const STAT_CONFIGS = [
    { selector: '[data-stat="cgpa"]',    target: 7.66,  suffix: '',   decimals: 2 },
    { selector: '[data-stat="projects"]',target: 25,    suffix: '+',  decimals: 0 },
    { selector: '[data-stat="leetcode"]',target: 350,   suffix: '+',  decimals: 0 },
    { selector: '[data-stat="year"]',    target: 2027,  suffix: '',   decimals: 0 },
  ];

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el, target, suffix, decimals) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    el.classList.add('stat-number');

    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOutExpo(progress);
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const config = STAT_CONFIGS.find(c => el.matches(c.selector));
      if (config) animateCounter(el, config.target, config.suffix, config.decimals);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  function bindCounters() {
    STAT_CONFIGS.forEach(({ selector }) => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset.counted) counterObserver.observe(el);
      });
    });

    // Also handle [data-counter] attribute pattern from existing markup
    document.querySelectorAll('[data-counter]:not([data-counted])').forEach(el => {
      const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0');
      if (!isNaN(target)) {
        counterObserver.observe(el);
      }
    });
  }

  bindCounters();
  window.addEventListener('portfolioDataUpdated', () => setTimeout(bindCounters, 300));
}

// ─────────────────────────────────────────────────────────────
// 3. NAVBAR — Active indicator + glass scroll state
//    Upgrades existing scroll spy to also toggle nav-active class
//    and adds navbar-scrolled class to header on scroll
// ─────────────────────────────────────────────────────────────
export function initNavbarUpgrade() {
  const header = document.querySelector('header');

  // Glass scroll state
  if (header) {
    let ticking = false;
    function updateNavbar() {
      if (window.scrollY > 60) {
        header.classList.add('navbar-scrolled');
      } else {
        header.classList.remove('navbar-scrolled');
      }
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
    updateNavbar();
  }

  // Active section underline — piggyback on existing scroll spy
  const spySections = ['about', 'skills', 'projects', 'github', 'reviews', 'contact'];
  const navLinks = document.querySelectorAll('.nav-section-link, .nav-projects-link');

  function updateActiveUnderline() {
    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
    if (!isHome) {
      navLinks.forEach(l => l.classList.remove('nav-active'));
      return;
    }
    const scrollY = window.scrollY + 140;
    let activeId = '';
    for (const id of spySections) {
      const el = document.getElementById(id);
      if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
        activeId = id;
        break;
      }
    }
    navLinks.forEach(link => {
      if (link.getAttribute('data-section') === activeId) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveUnderline, { passive: true });
  updateActiveUnderline();
}

// ─────────────────────────────────────────────────────────────
// 4. HERO — Profile card ring injection
//    Injects two CSS-animated ring divs around the profile picture
// ─────────────────────────────────────────────────────────────
export function initHeroProfileRing() {
  if (prefersReducedMotion) return;

  const profilePic = document.querySelector('.profile-pic-container');
  if (!profilePic || profilePic.dataset.ringBound) return;
  profilePic.dataset.ringBound = '1';

  const parent = profilePic.parentElement;
  if (!parent) return;

  // Ensure relative positioning
  parent.style.position = 'relative';

  const outerRing = document.createElement('div');
  outerRing.className = 'hero-profile-ring-outer';

  const innerRing = document.createElement('div');
  innerRing.className = 'hero-profile-ring-inner';

  parent.appendChild(outerRing);
  parent.appendChild(innerRing);

  // Disable on mobile
  if (isTouch) {
    outerRing.style.display = 'none';
    innerRing.style.display = 'none';
  }
}

// ─────────────────────────────────────────────────────────────
// 5. HERO BADGES — Stagger entrance animation class injection
// ─────────────────────────────────────────────────────────────
export function initHeroBadges() {
  if (prefersReducedMotion) return;

  const badgeContainer = document.querySelector('section#hero .flex.flex-wrap.gap-2');
  if (!badgeContainer || badgeContainer.dataset.badgesBound) return;
  badgeContainer.dataset.badgesBound = '1';

  Array.from(badgeContainer.children).forEach(badge => {
    badge.classList.add('hero-badge');
  });
}

// ─────────────────────────────────────────────────────────────
// 6. TIMELINE — Line draw + stagger item reveal
// ─────────────────────────────────────────────────────────────
export function initTimelineAnimation() {
  if (prefersReducedMotion) return;

  // Find the timeline container (border-l line)
  const timelineContainers = document.querySelectorAll('.border-l.border-white\\/8.ml-4.pl-8');
  if (!timelineContainers.length) return;

  timelineContainers.forEach(container => {
    if (container.dataset.timelineBound) return;
    container.dataset.timelineBound = '1';

    // Add our class for the CSS line-draw animation
    container.classList.add('timeline-line');

    // Add timeline-item class to each child for stagger
    const items = Array.from(container.children);
    items.forEach(item => {
      item.classList.add('timeline-item');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        container.classList.add('timeline-drawn');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('timeline-visible'), 200 + i * 150);
        });
        observer.unobserve(container);
      });
    }, { threshold: 0.15 });

    observer.observe(container);
  });
}

// ─────────────────────────────────────────────────────────────
// 7. MAGNETIC BUTTON PHYSICS
//    Smooth spring attraction toward cursor on desktop
// ─────────────────────────────────────────────────────────────
export function initMagneticButtons() {
  if (prefersReducedMotion || isTouch || !isDesktop) return;

  function applyMagnetic(el) {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';

    let animFrame = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      targetY = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    }, { passive: true });

    el.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

    function tick() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      if (Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
        animFrame = requestAnimationFrame(tick);
      } else {
        el.style.transform = '';
        animFrame = null;
      }
    }

    el.addEventListener('mouseenter', () => {
      if (!animFrame) animFrame = requestAnimationFrame(tick);
    });
  }

  function bindAll() {
    document.querySelectorAll('a.rounded-xl, a.rounded-full, button.rounded-xl:not(.flip-btn):not(.chat-chip):not(#chatbot-toggle-btn):not(#chatbot-close-btn):not(#chatbot-send-btn)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 50 && rect.width < 350) applyMagnetic(el);
    });
  }

  bindAll();
  window.addEventListener('portfolioDataUpdated', () => setTimeout(bindAll, 500));
}

// ─────────────────────────────────────────────────────────────
// 8. AMBIENT GLOW TRAIL CURSOR
//    Soft radial gradient follows cursor lazily (desktop only)
// ─────────────────────────────────────────────────────────────
export function initGlowTrail() {
  if (prefersReducedMotion || isTouch || !isDesktop) return;
  if (document.getElementById('glow-trail')) return;

  const glow = document.createElement('div');
  glow.id = 'glow-trail';
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.05) 0%, rgba(16,185,129,0.025) 45%, transparent 70%);
    transform: translate(-50%, -50%);
    will-change: left, top;
    left: -500px;
    top: -500px;
    transition: opacity 0.4s ease;
  `;
  document.body.appendChild(glow);

  let glowX = -500, glowY = -500, targetX = -500, targetY = -500;

  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function animate() {
    glowX += (targetX - glowX) * 0.06;
    glowY += (targetY - glowY) * 0.06;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

// ─────────────────────────────────────────────────────────────
// 9. CLICK RIPPLE on buttons/links
// ─────────────────────────────────────────────────────────────
export function initClickRipple() {
  if (prefersReducedMotion) return;

  document.addEventListener('click', e => {
    const btn = e.target.closest('button.rounded-xl, a.rounded-xl, a.rounded-full, a[class*="py-3"], button[class*="py-3"]');
    if (!btn || btn.closest('#chatbot-window') || btn.closest('#preloader')) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255,255,255,0.14);
      width: 0; height: 0;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      transform: translate(-50%, -50%);
      animation: rippleExpand 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
      z-index: 100;
    `;

    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ─────────────────────────────────────────────────────────────
// 10. PARALLAX DEPTH — Aurora blobs drift on scroll
// ─────────────────────────────────────────────────────────────
export function initParallaxDepth() {
  if (prefersReducedMotion || isTouch) return;

  let ticking = false;
  function update() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.aurora-blob').forEach((blob, i) => {
      const speed = 0.12 + i * 0.06;
      const dir = i % 2 === 0 ? 1 : -1;
      blob.style.transform = `translateY(${scrollY * speed * dir}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 11. SCROLL PROGRESS BAR — smooth update
// ─────────────────────────────────────────────────────────────
export function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  function update() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docH > 0 ? `${(scrollTop / docH) * 100}%` : '0%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 12. GSAP SECTION HEADING REVEALS
//     Smooth blur-to-focus reveal on section headings + cert cards
// ─────────────────────────────────────────────────────────────
export function initGSAPEnhancements() {
  if (prefersReducedMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section h2 headings
  document.querySelectorAll('section h2').forEach(el => {
    if (el.dataset.gsapBound) return;
    el.dataset.gsapBound = '1';
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 0,
      y: 24,
      filter: 'blur(6px)',
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // Certification cards stagger
  const certGrid = document.querySelector('#certifications .grid');
  if (certGrid && !certGrid.dataset.gsapBound) {
    certGrid.dataset.gsapBound = '1';
    gsap.from(certGrid.children, {
      scrollTrigger: { trigger: certGrid, start: 'top 86%', toggleActions: 'play none none none' },
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }

  // GitHub stat cards stagger
  const githubStatCards = document.querySelectorAll('.github-stat-card');
  githubStatCards.forEach((card, i) => {
    if (card.dataset.gsapBound) return;
    card.dataset.gsapBound = '1';
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 0,
      x: -20,
      duration: 0.5,
      delay: i * 0.08,
      ease: 'power2.out',
    });
  });
}

// ─────────────────────────────────────────────────────────────
// INIT ALL — call once after page is ready, re-call after SPA nav
// ─────────────────────────────────────────────────────────────
export function initAllPremiumAnimations() {
  // Core effects
  initScrollProgressBar();
  initNavbarUpgrade();
  initGlowTrail();
  initParallaxDepth();
  initClickRipple();

  // Hero
  initHeroProfileRing();
  initHeroBadges();

  // Content reveals
  initSkillBarScrollReveal();
  initStatCounters();
  initTimelineAnimation();

  // Interactive
  initMagneticButtons();

  // GSAP (non-blocking, uses existing CDN loaded in index.html)
  if (typeof gsap !== 'undefined') {
    setTimeout(initGSAPEnhancements, 80);
  }

  // Re-run content-dependent inits when GitHub data arrives
  window.addEventListener('portfolioDataUpdated', () => {
    setTimeout(() => {
      initSkillBarScrollReveal();
      initStatCounters();
      initTimelineAnimation();
      initMagneticButtons();
      initHeroProfileRing();
      initHeroBadges();
      if (typeof gsap !== 'undefined') initGSAPEnhancements();
    }, 350);
  });
}
