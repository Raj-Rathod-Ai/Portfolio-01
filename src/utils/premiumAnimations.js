/**
 * PREMIUM AI-NATIVE ANIMATIONS ENGINE
 * Upgrade layer — adds sophisticated micro-interactions, GPU-accelerated effects,
 * magnetic buttons, scroll-triggered reveals, depth parallax, and cursor enhancements.
 *
 * RULES:
 *  - No content changes, no layout shifts
 *  - Only transform / opacity / filter / box-shadow for GPU compositing
 *  - Reduced-motion support via prefers-reduced-motion media query
 *  - Desktop + mobile performance safe
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const isDesktop = window.innerWidth >= 1024;

// ─────────────────────────────────────────────────────────────
// 1. MAGNETIC BUTTON EFFECT
//    Buttons with class .magnetic-btn get pulled toward cursor
// ─────────────────────────────────────────────────────────────
export function initMagneticButtons() {
  if (prefersReducedMotion || isTouch) return;

  function applyMagnetic(el) {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';

    let animFrame = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      targetX = x * 0.38;
      targetY = y * 0.38;
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);

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

  // Apply to all magnetic targets
  function bindAll() {
    document.querySelectorAll(
      'a[class*="rounded"], button:not(.flip-btn):not(.chat-chip):not(#chatbot-toggle-btn):not(#chatbot-close-btn):not(#chatbot-send-btn)'
    ).forEach(el => {
      // Only apply to visible, non-tiny buttons
      const rect = el.getBoundingClientRect();
      if (rect.width > 40 && rect.width < 400) applyMagnetic(el);
    });
  }

  // Run on initial load and re-run when page content changes
  bindAll();
  window.addEventListener('portfolioDataUpdated', () => setTimeout(bindAll, 500));
}

// ─────────────────────────────────────────────────────────────
// 2. ENHANCED SCROLL REVEALS
//    Staggered children reveal with blur-to-focus spring easing
// ─────────────────────────────────────────────────────────────
export function initEnhancedScrollReveals() {
  if (prefersReducedMotion) {
    // Immediately make all visible if reduced motion
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('active');

      // Stagger direct children if .stagger-children class present
      if (el.classList.contains('stagger-children')) {
        const children = Array.from(el.children);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.07}s`;
          child.classList.add('active');
        });
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('active');
    } else {
      observer.observe(el);
    }
  });

  // Re-observe when new content is injected (project cards, etc.)
  window.addEventListener('portfolioDataUpdated', () => {
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.active)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('active');
        } else {
          observer.observe(el);
        }
      });
    }, 200);
  });
}

// ─────────────────────────────────────────────────────────────
// 3. GLOW TRAIL CURSOR UPGRADE
//    Adds a soft colored ambient glow that follows cursor
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
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%);
    transform: translate(-50%, -50%);
    will-change: left, top;
    transition: opacity 0.4s ease;
    left: -500px;
    top: -500px;
  `;
  document.body.appendChild(glow);

  let glowX = -500, glowY = -500;
  let targetX = -500, targetY = -500;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function animateGlow() {
    glowX += (targetX - glowX) * 0.065;
    glowY += (targetY - glowY) * 0.065;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

// ─────────────────────────────────────────────────────────────
// 4. ANIMATED COUNTER FOR STAT NUMBERS
//    Numbers count up when scrolled into view
// ─────────────────────────────────────────────────────────────
export function initCounterAnimations() {
  if (prefersReducedMotion) return;

  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || el.textContent.replace(/[0-9.]/g, '').trim();
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : (target % 1 !== 0 ? 2 : 0);
    const duration = 1400;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = target * easedProgress;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function bindCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  bindCounters();
  window.addEventListener('portfolioDataUpdated', () => setTimeout(bindCounters, 300));
}

// ─────────────────────────────────────────────────────────────
// 5. PARALLAX DEPTH EFFECT ON HERO ELEMENTS
//    Subtle vertical movement at different speeds on scroll
// ─────────────────────────────────────────────────────────────
export function initParallaxDepth() {
  if (prefersReducedMotion || isTouch) return;

  let ticking = false;
  let lastScrollY = 0;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(scrollY / maxScroll, 1);

    // Aurora blobs — slow parallax drift
    const blobs = document.querySelectorAll('.aurora-blob');
    blobs.forEach((blob, i) => {
      const speed = 0.15 + i * 0.08;
      const direction = i % 2 === 0 ? 1 : -1;
      blob.style.transform = `translateY(${scrollY * speed * direction}px)`;
    });

    // Hero section — very subtle translate
    const heroSection = document.querySelector('#hero, .hero-section, section:first-of-type');
    if (heroSection && scrollY < window.innerHeight) {
      const progress = scrollY / window.innerHeight;
      heroSection.style.setProperty('--scroll-progress', progress.toFixed(3));
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 6. PREMIUM CARD HOVER GLOW BORDER TRACE
//    Cards get an animated gradient border on hover
// ─────────────────────────────────────────────────────────────
export function initCardGlowBorders() {
  if (prefersReducedMotion) return;

  // Listen for mouse position on skill cards and certification cards
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.skill-card, .cert-card, .glass-card, .spotlight-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${x}%`);
    card.style.setProperty('--glow-y', `${y}%`);
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 7. SMOOTH NAVBAR SCROLL SHRINK
//    Navbar compresses and glass-ifies on scroll
// ─────────────────────────────────────────────────────────────
export function initNavbarScrollEffect() {
  const header = document.querySelector('header, #navbar-header-mount header, nav');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 60;
    const isScrollingDown = scrollY > lastScrollY;

    if (isScrolled) {
      header.style.setProperty('--navbar-blur', '20px');
      header.style.setProperty('--navbar-bg', 'rgba(13, 17, 23, 0.92)');
    } else {
      header.style.setProperty('--navbar-blur', '0px');
      header.style.setProperty('--navbar-bg', 'rgba(13, 17, 23, 0.4)');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 8. TYPING INDICATOR PULSE ON HERO TITLE
//    Adds a subtle breathing animation to title area
// ─────────────────────────────────────────────────────────────
export function initHeroSubtleAnimations() {
  if (prefersReducedMotion) return;

  // Add ambient glow pulse to hero profile image
  const profileImg = document.querySelector('.profile-pic-container, img[alt*="Raj"]');
  if (profileImg) {
    profileImg.style.animation = 'profileGlowPulse 4s ease-in-out infinite';
  }
}

// ─────────────────────────────────────────────────────────────
// 9. LINK HOVER RIPPLE EFFECT
//    Buttons get a subtle ripple on click
// ─────────────────────────────────────────────────────────────
export function initClickRipple() {
  if (prefersReducedMotion) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a.rounded-xl, a.rounded-lg, a.rounded-full, a[class*="py-"]');
    if (!btn || btn.closest('#chatbot-window') || btn.closest('#preloader')) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.15);
      width: 0;
      height: 0;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      animation: rippleExpand 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      z-index: 100;
    `;

    // Only add ripple to relatively positioned elements
    const position = getComputedStyle(btn).position;
    if (position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ─────────────────────────────────────────────────────────────
// 10. SECTION ENTRANCE ORCHESTRATION
//     Uses GSAP if available, falls back to CSS transitions
// ─────────────────────────────────────────────────────────────
export function initGSAPEnhancements() {
  if (prefersReducedMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate section headings with a premium split-word reveal
  document.querySelectorAll('.section-heading, h2.font-jakarta, h2.font-outfit').forEach(heading => {
    if (heading.dataset.gsapBound) return;
    heading.dataset.gsapBound = '1';

    gsap.from(heading, {
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 28,
      filter: 'blur(8px)',
      duration: 0.85,
      ease: 'power3.out',
    });
  });

  // Skill cards stagger reveal
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    if (card.dataset.gsapBound) return;
    card.dataset.gsapBound = '1';

    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.55,
      delay: (i % 6) * 0.05,
      ease: 'power2.out',
    });
  });
}

// ─────────────────────────────────────────────────────────────
// 11. SCROLL PROGRESS GLOW UPDATE
//     Enhances the existing scroll progress bar with live glow
// ─────────────────────────────────────────────────────────────
export function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 12. PREMIUM LINK HOVER UNDERLINE TRACE
//     Nav links get a flowing gradient underline trace on hover
// ─────────────────────────────────────────────────────────────
export function initNavLinkEffects() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('nav a, header a').forEach(link => {
    if (link.dataset.navBound) return;
    link.dataset.navBound = '1';
    link.classList.add('nav-link-premium');
  });
}

// ─────────────────────────────────────────────────────────────
// INIT ALL — call this after DOM is ready
// ─────────────────────────────────────────────────────────────
export function initAllPremiumAnimations() {
  // Core interactive effects
  initGlowTrail();
  initMagneticButtons();
  initEnhancedScrollReveals();
  initCounterAnimations();
  initCardGlowBorders();
  initClickRipple();
  initParallaxDepth();
  initNavbarScrollEffect();
  initHeroSubtleAnimations();
  initScrollProgressBar();
  initNavLinkEffects();

  // GSAP enhancements (non-blocking, uses existing GSAP CDN)
  if (typeof gsap !== 'undefined') {
    setTimeout(initGSAPEnhancements, 100);
  }

  // Re-initialize magnetic buttons after project cards render
  window.addEventListener('portfolioDataUpdated', () => {
    setTimeout(() => {
      initMagneticButtons();
      initCounterAnimations();
      if (typeof gsap !== 'undefined') initGSAPEnhancements();
    }, 400);
  });
}
