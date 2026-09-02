import { fetchGitHubRepositories } from './api/github.js';
import { getProjectCategory, UPCOMING_PROJECTS } from './utils/categorize.js';
import { isGroupProject } from './utils/helpers.js';
import { initRouter } from './router.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { Chatbot } from './components/Chatbot.js';
import { commandPalette } from './components/CommandPalette.js';
import { initMagneticCursor } from './utils/magneticCursor.js';
import { initCardTilt } from './utils/cardTilt.js';
import { trackVisit, trackInteraction, getApiBaseUrl } from './utils/analytics.js';

// Pre-warm Render backend server immediately on page load to prevent cold start delay
(function prewarmBackend() {
  try {
    const apiUrl = getApiBaseUrl();
    if (apiUrl) {
      fetch(apiUrl + '/api/health', { cache: 'no-store' }).catch(() => {});
    }
  } catch (e) {}
})();

// Multi-Resume Selection Modal Controller
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');

  const openModal = () => {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.resume-modal-trigger');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResumeModal);
} else {
  initResumeModal();
}

// Global interaction listener for clicks on GitHub, Live Demo, View Details, and Category links
document.addEventListener('click', (e) => {
  const target = e.target;
  
  // 1. GitHub Code links
  const githubLink = target.closest('a[href*="github.com"]');
  if (githubLink) {
    const card = githubLink.closest('.flip-card, .spotlight-card') || document;
    const titleEl = card.querySelector('h3, h4, h2');
    const title = titleEl ? titleEl.textContent.trim() : 'GitHub Repo';
    const catEl = card.querySelector('[class*="cat-badge"]');
    const category = catEl ? catEl.textContent.trim() : 'General';
    trackInteraction('github_click', title, category, githubLink.href);
    return;
  }

  // 2. Live Demo links & TruthLens random switcher
  const linkEl = target.closest('a');
  if (linkEl) {
    const href = linkEl.getAttribute('href') || '';
    if (href.includes('truthlens5.netlify.app') || href.includes('truthlens5.streamlit.app') || linkEl.hasAttribute('data-random-urls')) {
      const truthLensPool = ['https://truthlens5.netlify.app/', 'https://truthlens5.streamlit.app/'];
      const randomUrl = truthLensPool[Math.floor(Math.random() * truthLensPool.length)];
      linkEl.setAttribute('href', randomUrl);
    }

    if (linkEl.textContent.toLowerCase().includes('demo')) {
      const card = linkEl.closest('.flip-card, .spotlight-card') || document;
      const titleEl = card.querySelector('h3, h4, h2');
      const title = titleEl ? titleEl.textContent.trim() : 'Live Demo';
      const catEl = card.querySelector('[class*="cat-badge"]');
      const category = catEl ? catEl.textContent.trim() : 'General';
      trackInteraction('live_demo_click', title, category, linkEl.href);
      return;
    }
  }

  // 3. View Details buttons
  const detailsBtn = target.closest('a[href*="/projects/"]');
  if (detailsBtn) {
    const card = detailsBtn.closest('.flip-card, .cat-card-premium') || document;
    const titleEl = card.querySelector('h3, h4, h2');
    const title = titleEl ? titleEl.textContent.trim() : 'Project Details';
    const catEl = card.querySelector('[class*="cat-badge"]');
    const category = catEl ? catEl.textContent.trim() : 'General';
    trackInteraction('view_details', title, category, detailsBtn.href);
    return;
  }

  // 4. Category card clicks
  const catCard = target.closest('.cat-card-premium');
  if (catCard) {
    const titleEl = catCard.querySelector('h4, h3');
    const title = titleEl ? titleEl.textContent.trim() : 'Category Card';
    trackInteraction('category_click', title, title, catCard.href);
    return;
  }
});

// Global navbar/footer/chatbot instances
const navbar = new Navbar();
const footer = new Footer();
const chatbot = new Chatbot();

export function applyBossOverrides(reposList) {
  try {
    const raw = localStorage.getItem('boss_project_overrides');
    if (!raw) return reposList;
    const overrides = JSON.parse(raw);
    return reposList.map(r => {
      const match = overrides[r.name] || overrides[r.name.toLowerCase()];
      if (match) {
        return {
          ...r,
          isGroup: typeof match.isGroup === 'boolean' ? match.isGroup : r.isGroup,
          featured: typeof match.featured === 'boolean' ? match.featured : r.featured
        };
      }
      return r;
    });
  } catch (e) {
    return reposList;
  }
}

export function sortReposWithFeaturedTop(reposList) {
  const overridesApplied = applyBossOverrides(reposList);
  const realFeatured = overridesApplied.filter(r => r.featured && !r.isUpcoming);
  const realNonFeatured = overridesApplied.filter(r => !r.featured && !r.isUpcoming);
  const upcoming = overridesApplied.filter(r => r.isUpcoming);

  const sortByLatest = (arr) => [...arr].sort((a, b) => 
    new Date(b.updated_at || b.pushed_at || b.created_at || 0) - new Date(a.updated_at || a.pushed_at || a.created_at || 0)
  );

  return [...sortByLatest(realFeatured), ...sortByLatest(realNonFeatured), ...upcoming];
}

/**
 * Initialize HTML5 Canvas backdrop node-vertex particles animation.
 */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  
  const isMobile = window.innerWidth < 768;
  const NODE_COUNT = isMobile ? 22 : 65;
  const MAX_DIST = isMobile ? 100 : 145;
  let mouse = { x: null, y: null, radius: isMobile ? 100 : 170 };

  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // Interactive speed-burst clicks
  window.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    nodes.forEach(n => {
      const dx = n.x - clickX;
      const dy = n.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pushRadius = isMobile ? 180 : 300;
      if (dist < pushRadius) {
        const force = (pushRadius - dist) / pushRadius;
        n.vx += (dx / dist) * force * (isMobile ? 8 : 15);
        n.vy += (dy / dist) * force * (isMobile ? 8 : 15);
      }
    });
  });

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Load initial random nodes
  for (let i = 0; i < NODE_COUNT; i++) {
    const baseVx = (Math.random() - 0.5) * 0.6;
    const baseVy = (Math.random() - 0.5) * 0.6;
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: baseVx,
      vy: baseVy,
      baseVx: baseVx,
      baseVy: baseVy,
      r: Math.random() * 1.5 + 1.2
    });
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      // Friction
      n.vx += (n.baseVx - n.vx) * 0.05;
      n.vy += (n.baseVy - n.vy) * 0.05;

      // Wall reflections
      if (n.x < 0 || n.x > window.innerWidth) {
        n.vx *= -1;
        n.baseVx *= -1;
      }
      if (n.y < 0 || n.y > window.innerHeight) {
        n.vy *= -1;
        n.baseVy *= -1;
      }

      // Cursor push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x += (dx / dist) * force * 1.8;
          n.y += (dy / dist) * force * 1.8;
        }
      }
    });

    // Draw lines & triangles
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx1 = nodes[i].x - nodes[j].x;
        const dy1 = nodes[i].y - nodes[j].y;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        if (dist1 < MAX_DIST) {
          if (!isMobile) {
            for (let k = j + 1; k < nodes.length; k++) {
              const dx2 = nodes[j].x - nodes[k].x;
              const dy2 = nodes[j].y - nodes[k].y;
              const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

              const dx3 = nodes[k].x - nodes[i].x;
              const dy3 = nodes[k].y - nodes[i].y;
              const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

              if (dist2 < MAX_DIST && dist3 < MAX_DIST) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.lineTo(nodes[k].x, nodes[k].y);
                ctx.closePath();

                const avgDist = (dist1 + dist2 + dist3) / 3;
                const opacity = (1 - avgDist / MAX_DIST) * 0.15;
                ctx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.fill();
              }
            }
          }

          // Draw connector line
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist1 / MAX_DIST) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.95)';
      ctx.fill();
    }
    requestAnimationFrame(drawCanvas);
  }
  
  drawCanvas();
}

/**
 * Register scroll-spying observers for section elements.
 */
function initIntersectionObservers() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
      // Do NOT remove 'active' so cards stay revealed once seen
    });
  }, { threshold: 0.03, rootMargin: '0px 0px -30px 0px' });

  window.initializeObservers = () => {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      // If already in viewport on mount, immediately activate
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      } else {
        revealObserver.observe(el);
      }
    });
  };

  window.initializeObservers();
}

/**
 * Handle hover cursor coordinates on premium cards.
 */
function initMouseSpotlight() {
  document.addEventListener('mousemove', (e) => {
    // spotlight-card (detail view) + flip-card-front
    document.querySelectorAll('.spotlight-card, .flip-card-front').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}


/**
 * Initialize loading preloader progression page overlays.
 */
function initPreloader(onLoadedCallback) {
  const brand = document.getElementById('preloader-brand');
  const bar = document.getElementById('pl-bar');
  const status = document.getElementById('pl-status');
  const perc = document.getElementById('pl-perc');
  const preloader = document.getElementById('preloader');

  if (!brand || !preloader) {
    onLoadedCallback();
    return;
  }

  // Multi-Color Glowing Hologram Character Stagger Suite
  const text = 'RAJ RATHOD';
  const colors = ['#818cf8', '#a855f7', '#38bdf8', '#34d399', '#fbbf24', '#f472b6'];
  brand.innerHTML = '';

  const chars = Array.from(text).map((c) => {
    const span = document.createElement('span');
    span.textContent = c === ' ' ? '\u00A0' : c;
    span.style.cssText = 'font-family:\'Outfit\',\'Plus Jakarta Sans\',sans-serif;font-weight:900;display:inline-block;opacity:0;filter:blur(24px);transform:translateY(22px) scale(0.92);background:linear-gradient(135deg,#ffffff 20%,#c7d2fe 60%,#a5b4fc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;will-change:filter,opacity,transform;transition:opacity 0.6s cubic-bezier(0.16,1,0.3,1),filter 0.6s cubic-bezier(0.16,1,0.3,1),transform 0.6s cubic-bezier(0.16,1,0.3,1),text-shadow 0.25s;';
    brand.appendChild(span);
    return span;
  });

  // Stagger reveal each letter with blur-to-focus and flowing text shimmer
  chars.forEach((span, i) => {
    setTimeout(() => {
      span.style.opacity = '1';
      span.style.filter = 'blur(0)';
      span.style.transform = 'translateY(0) scale(1)';
      setTimeout(() => {
        span.classList.add('text-flow-gradient');
      }, 400);
    }, i * 75 + 160);
  });

  // Interactive Neon Hover effect on individual characters
  chars.forEach((span) => {
    span.addEventListener('mouseenter', () => {
      const col = colors[Math.floor(Math.random() * colors.length)];
      span.style.webkitTextFillColor = col;
      span.style.transform = 'translateY(-10px) scale(1.12)';
      span.style.filter = `drop-shadow(0 0 25px ${col}) drop-shadow(0 0 50px ${col}88)`;
    });
    span.addEventListener('mouseleave', () => {
      span.style.webkitTextFillColor = 'transparent';
      span.style.transform = 'translateY(0) scale(1)';
      span.style.filter = 'none';
    });
  });

  // Laser Progress Bar Animation & Status Stepper
  let progress = 0;
  const statusSteps = [
    'Initializing Neural Engine...',
    'Loading AI Architectures & Models...',
    'Synchronizing 21 Live Deployments...',
    'Calibrating Multi-Turn Assistant...',
    'Portfolio Ready.'
  ];
  let currentStepIdx = 0;

  const preloaderInterval = setInterval(() => {
    progress += Math.random() * 3.6 + 1.4;

    if (progress >= 100) {
      progress = 100;
      clearInterval(preloaderInterval);

      if (bar) bar.style.width = '100%';
      if (perc) perc.textContent = '100%';
      if (status) status.textContent = 'Portfolio Ready.';

      setTimeout(() => {
        preloader.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s ease, transform 0.75s ease';
        preloader.style.opacity = '0';
        preloader.style.filter = 'blur(16px)';
        preloader.style.transform = 'scale(1.03)';
        document.documentElement.classList.remove('noscroll');

        setTimeout(() => {
          if (preloader.parentNode) preloader.remove();
          onLoadedCallback(); // Initialize SPA routes
        }, 800);
      }, 300);
      return;
    }

    if (bar) bar.style.width = `${progress}%`;
    if (perc) perc.textContent = `${Math.floor(progress)}%`;

    const stepIdx = Math.min(
      Math.floor(progress / (100 / statusSteps.length)),
      statusSteps.length - 1
    );
    if (stepIdx !== currentStepIdx && status) {
      currentStepIdx = stepIdx;
      status.textContent = statusSteps[stepIdx];
    }
  }, 35);
}

/**
 * Initialize Lenis Smooth Scroll engine for ultra-smooth inertia scrolling.
 */
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;
  try {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;
  } catch (e) {
    console.warn('Lenis smooth scroll initialization warning:', e);
  }
}

/**
 * Run application bootsrap load.
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Force dark mode
  document.documentElement.classList.add('dark');
  
  // Render static Navbar and Footer placeholders in index.html shells
  const headerPlaceholder = document.getElementById('navbar-header-mount');
  const footerPlaceholder = document.getElementById('footer-mount');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = navbar.render();
  }
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footer.render();
  }

  // Bind active spotlight glows, background particles canvas, and Lenis smooth scroll
  initNeuralCanvas();
  initMouseSpotlight();
  initLenisSmoothScroll();

  // Load and merge local database with live API repositories
  let repos = [];
  let meta = [];
  try {
    const metaRes = await fetch('/src/data/projects.json');
    meta = await metaRes.json();
  } catch (err) {
    console.error('Failed to load local projects metadata:', err.message);
  }

  // Load global database project overrides if backend connected (with timeout guard)
  try {
    const apiUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const overrideRes = await fetch(apiUrl + '/api/project-overrides', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (overrideRes.ok && overrideRes.headers.get('content-type')?.includes('application/json')) {
      const data = await overrideRes.json();
      if (data && data.overrides && Object.keys(data.overrides).length > 0) {
        localStorage.setItem('boss_project_overrides', JSON.stringify(data.overrides));
      }
    }
  } catch (err) {}

  const processAndSetRepos = (rawGithubRepos) => {
    const merged = rawGithubRepos.map(repo => {
      const match = meta.find(m => m.repo && m.repo.toLowerCase() === (repo.name || '').toLowerCase());
      const category = getProjectCategory(repo, meta);
      const isGroup = isGroupProject(repo.name, meta);
      const featured = match ? match.featured === true : false;
      return {
        ...repo,
        category,
        isGroup,
        featured
      };
    });
    UPCOMING_PROJECTS.forEach(up => {
      const exists = merged.some(r => r.name.toLowerCase() === up.name.toLowerCase());
      if (!exists) merged.unshift(up);
    });
    const sorted = sortReposWithFeaturedTop(merged);
    window.portfolioData = { repos: sorted, meta };
    return sorted;
  };

  // Register real-time background sync callback from github.js
  window.onGitHubReposSynced = (liveRepos) => {
    if (Array.isArray(liveRepos) && liveRepos.length > 0) {
      processAndSetRepos(liveRepos);
    }
  };

  try {
    const githubRepos = await fetchGitHubRepositories();
    repos = processAndSetRepos(githubRepos);
  } catch (err) {
    console.error('Failed fetching repository datasets:', err.message);
    repos = processAndSetRepos(UPCOMING_PROJECTS);
  }

  // Trigger preloader and start routing on completion
  initPreloader(() => {
    // Setup navbar, footer, and AI Chatbot
    navbar.setup();
    footer.setup();

    const chatMount = document.createElement('div');
    chatMount.id = 'chatbot-mount';
    chatMount.innerHTML = chatbot.render();
    document.body.appendChild(chatMount);
    chatbot.setup();

    // Register animations, 3D tilt, command palette, and routes
    initIntersectionObservers();
    initMagneticCursor();
    initCardTilt();
    commandPalette.setup();
    initRouter();

    // Background auto-sync engine: Silently fetch fresh GitHub repositories & URLs
    const syncFreshRepos = async () => {
      try {
        const fresh = await fetchGitHubRepositories(true);
        if (fresh && Array.isArray(fresh) && fresh.length > 0) {
          const freshMapped = fresh.map(repo => {
            const match = meta.find(m => m.repo.toLowerCase() === repo.name.toLowerCase());
            const category = getProjectCategory(repo, meta);
            const isGroup = isGroupProject(repo.name, meta);
            const featured = match ? match.featured === true : false;
            return { ...repo, category, isGroup, featured };
          });
          UPCOMING_PROJECTS.forEach(up => {
            if (!freshMapped.some(r => r.name.toLowerCase() === up.name.toLowerCase())) {
              freshMapped.unshift(up);
            }
          });
          const updatedRepos = sortReposWithFeaturedTop(freshMapped);
          window.portfolioData = { repos: updatedRepos, meta };
          window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: { repos: updatedRepos } }));
        }
      } catch (e) {
        console.log('Background repo auto-sync notice:', e.message);
      }
    };

    // Trigger immediate background sync after load
    setTimeout(syncFreshRepos, 200);

    // Periodic auto-sync every 5 minutes to keep new GitHub repos completely synchronized
    setInterval(syncFreshRepos, 5 * 60 * 1000);

    // Auto-revalidate whenever user switches back to portfolio tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncFreshRepos();
      }
    });
  });
});
