// ================= CUSTOM CURSOR =================
const dot = document.getElementById('custom-cursor-dot');
const ring = document.getElementById('custom-cursor-ring');
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateCursor() {
  dotX += (mouseX - dotX) * 0.2;
  dotY += (mouseY - dotY) * 0.2;
  if (dot) { dot.style.left = `${dotX}px`; dot.style.top = `${dotY}px`; }
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  if (ring) { ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; }
  requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

const hoverables = 'a, button, input, textarea, [role="button"], .spotlight-card';
document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverables)) document.body.classList.add('cursor-hover'); });
document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverables)) document.body.classList.remove('cursor-hover'); });


// ================= PRELOADER =================
const loaderFill = document.getElementById('loader-fill');
const loaderPerc = document.getElementById('loader-perc');
let progress = 0;

const preloaderInterval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(preloaderInterval);
    setTimeout(() => {
      const loaderScreen = document.getElementById('preloader');
      if (loaderScreen) {
        loaderScreen.style.opacity = '0';
        loaderScreen.style.transition = 'opacity 0.4s ease';
        document.documentElement.classList.remove('noscroll');
        setTimeout(() => {
          loaderScreen.style.display = 'none';
          initScrollReveals();
        }, 400);
      }
    }, 150);
  }
  if (loaderFill) loaderFill.style.width = `${progress}%`;
  if (loaderPerc) loaderPerc.textContent = `${progress}%`;
}, 30);


// ================= SCROLL REPLAY CONTROLLER =================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    } else {
      // Replays when scrolling back up/down
      entry.target.classList.remove('active');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

function initScrollReveals() {
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Skills section observer to fill progress bars dynamically on reveal
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const skillBars = skillsSection.querySelectorAll('.skill-card .h-full');
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const card = bar.closest('.skill-card');
            const val = card.dataset.skillVal || '0';
            bar.style.width = val + '%';
          });
        } else {
          skillBars.forEach(bar => {
            bar.style.width = '0%';
          });
        }
      });
    }, { threshold: 0.1 });
    skillsObserver.observe(skillsSection);
  }
}


// ================= SCROLL PROGRESS BAR =================
window.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
    scrollProgress.style.width = scrolled + '%';
  }
}, { passive: true });


// ================= DYNAMIC SPOTLIGHT TRACKER =================
document.addEventListener('mousemove', (e) => {
  const spotlightCards = document.querySelectorAll('.spotlight-card, .skill-card');
  spotlightCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


const canvas = document.getElementById('neural-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let nodes = [];
  const NODE_COUNT = 65;
  const MAX_DIST = 145;
  let mouse = { x: null, y: null, radius: 170 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Sharp high-DPI scaling for Retina/High-Res screens
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

  // Ingest initial nodes
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.5 + 1.2
    });
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update node positions and handle boundary collisions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
      if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

      // Cursor push effect
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

    // Draw triangles (polygons)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx1 = nodes[i].x - nodes[j].x;
        const dy1 = nodes[i].y - nodes[j].y;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        if (dist1 < MAX_DIST) {
          // Check for mutual connection with a third node to form a triangle
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
              const opacity = (1 - avgDist / MAX_DIST) * 0.2;
              ctx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
              ctx.fill();
            }
          }

          // Draw connecting line
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist1 / MAX_DIST) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw node vertex point
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.95)';
      ctx.fill();
    }
    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();
}


// ================= MOBILE DRAWER =================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

function openMobileMenu() { mobileMenu?.classList.remove('translate-x-full'); }
function closeMobileMenu() { mobileMenu?.classList.add('translate-x-full'); }

mobileMenuBtn?.addEventListener('click', openMobileMenu);
mobileMenuClose?.addEventListener('click', closeMobileMenu);


// Force dark mode initially
document.documentElement.classList.add('dark');


// ================= NAVIGATION OBSERVER =================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) currentId = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('text-primary', a.getAttribute('href') === `#${currentId}`);
    a.classList.toggle('text-gray-400', a.getAttribute('href') !== `#${currentId}`);
  });
}, { passive: true });


// ================= STAR RATING SYSTEM =================
let selectedRating = 5;
const starContainer = document.getElementById('review-stars-selector');
const ratingInput = document.getElementById('rev-rating');

if (starContainer) {
  const stars = starContainer.querySelectorAll('i');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      if (ratingInput) ratingInput.value = selectedRating;
      stars.forEach((s, i) => {
        if (i < selectedRating) {
          s.className = 'fa-solid fa-star text-accent cursor-pointer';
        } else {
          s.className = 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
        }
      });
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.className = i < val
          ? 'fa-solid fa-star text-accent cursor-pointer'
          : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
      });
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => {
        s.className = i < selectedRating
          ? 'fa-solid fa-star text-accent cursor-pointer'
          : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
      });
    });
  });
}


// Base URL configuration for Backend deployed on Render & Frontend on Netlify
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://portfolio-raj-qda3.onrender.com';

// ================= REVIEWS RENDERER =================
async function renderReviews() {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;
  
  let reviews = [];
  try {
    const res = await fetch(API_BASE_URL + '/api/reviews');
    if (!res.ok) throw new Error('API failed');
    reviews = await res.json();
  } catch (err) {
    console.warn('Backend reviews request failed, falling back to localStorage.', err);
    reviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]');
    if (reviews.length === 0) {
      reviews = [
        {
          name: 'Prof. K. R. Patel',
          rating: 5,
          review: 'Raj is a highly competent machine learning developer. His work on predictive models shows clean styling, sound architecture, and solid execution. Excellent engineering mindset!',
          date: '12 Jun 2026'
        },
        {
          name: 'Mayur (Cyber Security Teammate)',
          rating: 5,
          review: 'Worked with Raj on computer vision applications. His speed in debugging model deployments and building pipeline interfaces is exceptional. Great teammate!',
          date: '02 May 2026'
        }
      ];
      localStorage.setItem('portfolioReviews', JSON.stringify(reviews));
    }
  }

  container.innerHTML = reviews.map(r => `
    <div class="rounded-xl border border-white/8 p-5 bg-white/3 space-y-3">
      <div class="flex justify-between items-start gap-2">
        <div>
          <span class="font-jakarta font-semibold text-sm text-gray-100">${r.name}</span>
          <span class="block font-mono text-[10px] text-gray-600 mt-0.5">${r.date}</span>
        </div>
        <div class="flex gap-0.5 flex-shrink-0">${'<i class="fa-solid fa-star text-accent text-xs"></i>'.repeat(r.rating)}</div>
      </div>
      <p class="font-inter text-xs text-gray-400 leading-relaxed">${r.review}</p>
    </div>
  `).join('');
}

const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('review-btn');
    if (btn) { btn.textContent = 'Submitting...'; btn.disabled = true; }

    const nameVal = document.getElementById('rev-name')?.value.trim();
    const reviewVal = document.getElementById('rev-comment')?.value.trim();
    const ratingVal = parseInt(document.getElementById('rev-rating')?.value || '5');

    const bodyData = {
      name: nameVal,
      review: reviewVal,
      rating: ratingVal
    };

    try {
      const res = await fetch(API_BASE_URL + '/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (!res.ok) throw new Error('API POST failed');
      
      // Also sync locally
      const reviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]');
      const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      reviews.unshift({
        name: nameVal,
        rating: ratingVal,
        review: reviewVal,
        date: formattedDate
      });
      localStorage.setItem('portfolioReviews', JSON.stringify(reviews));
    } catch (err) {
      console.warn('API submit failed, falling back to FormSubmit email handler...', err);
      try {
        await fetch(reviewForm.action, {
          method: 'POST',
          body: new FormData(reviewForm),
          headers: { 'Accept': 'application/json' }
        });
      } catch (_) {}
    }

    await renderReviews();
    reviewForm.reset();
    selectedRating = 5;
    if (ratingInput) ratingInput.value = 5;
    if (starContainer) {
      starContainer.querySelectorAll('i').forEach((s, i) => {
        s.className = i < 5 ? 'fa-solid fa-star text-accent cursor-pointer' : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
      });
    }
    if (btn) { btn.textContent = 'Submit Review'; btn.disabled = false; }
    showModal('success', 'Review Posted!', 'Thanks for your feedback!');
    if (typeof confetti !== 'undefined') confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  });
}
renderReviews();


// ================= DIRECT CONTACT =================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-btn');
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Sending...'; btn.disabled = true; }
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        showModal('success', 'Message Sent!', 'Thank you! I will get back to you soon.');
        contactForm.reset();
      } else {
        showModal('error', 'Failed to Send', 'Please try emailing directly at rathodraj1504@gmail.com');
      }
    } catch (_) {
      showModal('error', 'Network Error', 'Please try emailing directly at rathodraj1504@gmail.com');
    }
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; btn.disabled = false; }
  });
}


// ================= SUBMISSION MODAL =================
function showModal(type, title, desc) {
  const modal = document.getElementById('transmission-modal');
  const iconContainer = document.getElementById('transmission-icon-container');
  const titleEl = document.getElementById('transmission-title');
  const descEl = document.getElementById('transmission-desc');
  if (!modal) return;

  const isSuccess = type === 'success';
  if (iconContainer) {
    iconContainer.className = `w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl border ${isSuccess ? 'bg-teal/10 border-teal/30 text-teal' : 'bg-rose/10 border-rose/30 text-rose'}`;
    iconContainer.innerHTML = `<i class="fa-solid ${isSuccess ? 'fa-check' : 'fa-triangle-exclamation'}"></i>`;
  }
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTransmissionModal() {
  const modal = document.getElementById('transmission-modal');
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
}


// ================= GITHUB STATS CONTROLLER =================
let gitChart = null;

function updateGitChart(labels, dataValues) {
  const gitChartCanvas = document.getElementById('git-lang-chart');
  if (!gitChartCanvas || typeof Chart === 'undefined') return;
  if (gitChart) gitChart.destroy();

  const PALETTE = ['#6366f1','#8b5cf6','#f59e0b','#14b8a6','#f43f5e','#38bdf8','#a78bfa','#fb923c'];
  gitChart = new Chart(gitChartCanvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: PALETTE.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9ca3af',
            font: { family: 'JetBrains Mono', size: 11 },
            padding: 12,
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: 4
          }
        }
      },
      cutout: '65%',
      animation: { animateRotate: true, duration: 800 }
    }
  });
}

async function fetchGitHubData() {
  const reposCountEl = document.getElementById('git-repos-count');
  const followersCountEl = document.getElementById('git-followers-count');
  const starsCountEl = document.getElementById('git-stars-count');

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/Raj-Rathod-Ai'),
      fetch('https://api.github.com/users/Raj-Rathod-Ai/repos?per_page=100')
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();

    if (reposCountEl) reposCountEl.textContent = user.public_repos ?? repos.length;
    if (followersCountEl) followersCountEl.textContent = user.followers ?? 0;

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    if (starsCountEl) starsCountEl.textContent = totalStars;

    const langMap = {};
    repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
    const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
    if (sorted.length > 0) {
      updateGitChart(sorted.map(s => s[0]), sorted.map(s => s[1]));
    } else {
      updateGitChart(['Python', 'Java', 'C/C++', 'HTML/CSS', 'SQL'], [45, 20, 15, 12, 8]);
    }
  } catch (err) {
    console.warn('GitHub stats load failed. Using fallbacks.', err);
    if (reposCountEl) reposCountEl.textContent = '10';
    if (followersCountEl) followersCountEl.textContent = '3';
    if (starsCountEl) starsCountEl.textContent = '0';
    updateGitChart(['Python', 'Java', 'C/C++', 'HTML/CSS', 'SQL'], [45, 20, 15, 12, 8]);
  }
}
fetchGitHubData();


// ================= DYNAMIC PROJECTS GRID =================

const LIVE_DEMO_OVERRIDES = {
  'Taxi-Price-Prediction': 'https://taxi-price-prediction.netlify.app/',
  'Food-Delivery-Time-Prediction': 'https://fooddelivery-time.streamlit.app/',
  'Discover-your-true-personality': 'https://discover-your-true-personality.streamlit.app/',
  'Job-Analysis-Dashboard': 'https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard',
  'Stone-Paper-Scissors': 'https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/',
  'Flower-disease-system': 'https://flower-disease-system.vercel.app',
  'Library-Management-System': 'https://librarymangement1.streamlit.app/',
};

// Group projects configured strictly to these 3 names/keywords
const GROUP_PROJECTS = [
  'flower-disease',
  'fakenews',
  'fake-news',
  'neuro-os',
  'neuroos'
];

function isGroupProject(name) {
  const lower = name.toLowerCase();
  return GROUP_PROJECTS.some(g => lower.includes(g));
}

function getRepoIcon(repo) {
  const name = (repo.name || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (name.includes('fake-news') || name.includes('fakenews') || desc.includes('nlp') || desc.includes('fake news')) return { icon: 'fa-newspaper', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  if (name.includes('flower') || name.includes('disease') || desc.includes('cnn') || desc.includes('plant')) return { icon: 'fa-seedling', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' };
  if (name.includes('food') || name.includes('delivery')) return { icon: 'fa-truck-fast', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
  if (name.includes('taxi') || name.includes('fare') || name.includes('price')) return { icon: 'fa-taxi', color: 'text-sky', bg: 'bg-sky/10', border: 'border-sky/20' };
  if (name.includes('personality') || name.includes('discover')) return { icon: 'fa-brain', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
  if (name.includes('job') || name.includes('analysis') || name.includes('dashboard')) return { icon: 'fa-chart-column', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
  if (name.includes('tic-tac') || name.includes('stone') || name.includes('paper') || name.includes('game')) return { icon: 'fa-gamepad', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  if (name.includes('library') || name.includes('management') || name.includes('book')) return { icon: 'fa-book', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' };
  if (name.includes('portfolio') || name.includes('resume')) return { icon: 'fa-id-badge', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
  if (name.includes('chat') || name.includes('llm') || name.includes('gpt')) return { icon: 'fa-comments', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
  if (lang === 'python' || lang === 'jupyter notebook') return { icon: 'fa-chart-line', color: 'text-sky', bg: 'bg-sky/10', border: 'border-sky/20' };
  if (lang === 'javascript' || lang === 'typescript') return { icon: 'fa-code', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
  if (lang === 'java') return { icon: 'fa-mug-hot', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
  if (lang === 'css' || lang === 'html') return { icon: 'fa-palette', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  return { icon: 'fa-code', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
}

function getLiveUrl(repo) {
  for (const [key, url] of Object.entries(LIVE_DEMO_OVERRIDES)) {
    if (repo.name.toLowerCase() === key.toLowerCase()) return url;
  }
  if (repo.homepage && repo.homepage.trim() !== '') return repo.homepage.trim();
  return null;
}

const ACCENT_CYCLE = [
  { hover: 'hover:border-primary/45 hover:bg-primary/3' },
  { hover: 'hover:border-secondary/45 hover:bg-secondary/3' },
  { hover: 'hover:border-teal/45 hover:bg-teal/3' },
  { hover: 'hover:border-accent/45 hover:bg-accent/3' },
  { hover: 'hover:border-rose/45 hover:bg-rose/3' },
  { hover: 'hover:border-sky/45 hover:bg-sky/3' },
];

function buildProjectCard(repo, idx) {
  const accent = ACCENT_CYCLE[idx % ACCENT_CYCLE.length];
  const iconData = getRepoIcon(repo);
  const liveUrl = getLiveUrl(repo);
  const rawDesc = repo.description || 'No description available.';
  const desc = rawDesc.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
  const lang = repo.language || 'Mixed';
  const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  const repoTitle = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
  const isGroup = isGroupProject(repo.name);

  const starsHTML = repo.stargazers_count > 0
    ? `<div class="flex items-center gap-1 text-accent flex-shrink-0"><i class="fa-solid fa-star text-[9px]"></i><span class="font-mono text-xs">${repo.stargazers_count}</span></div>`
    : '';

  const topicsHTML = repo.topics && repo.topics.length > 0
    ? `<div class="flex flex-wrap gap-1.5">${repo.topics.slice(0, 4).map(t =>
        `<span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-[9px] font-mono text-gray-500">${t}</span>`
      ).join('')}</div>`
    : '';

  const liveBtnHTML = liveUrl
    ? `<a href="${liveUrl}" target="_blank" rel="noopener" class="flex items-center gap-1.5 text-xs font-mono ${iconData.color} hover:opacity-80 transition-opacity ml-auto">
         <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i><span>Live Demo</span>
       </a>`
    : '';

  const groupBadge = isGroup
    ? `<span class="px-1.5 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-[9px] font-mono text-secondary">Group</span>`
    : `<span class="px-1.5 py-0.5 rounded bg-teal/10 border border-teal/20 text-[9px] font-mono text-teal">Solo</span>`;

  const card = document.createElement('div');
  card.className = `rounded-xl border border-white/8 p-5 bg-white/3 ${accent.hover} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4`;
  card.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div class="w-10 h-10 rounded-xl ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
          <i class="fa-solid ${iconData.icon} ${iconData.color}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-jakarta font-semibold text-sm text-gray-100 leading-snug" title="${repo.name}">${repoTitle}</h3>
          <span class="font-mono text-[10px] text-gray-600">${lang} · ${updatedDate}</span>
        </div>
        ${starsHTML}
      </div>
      <p class="font-inter text-xs text-gray-500 leading-relaxed" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${desc}</p>
      <div class="flex items-center gap-2">${groupBadge}${topicsHTML}</div>
    </div>
    <div class="flex items-center gap-3 pt-2 border-t border-white/5">
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-white transition-colors">
        <i class="fa-brands fa-github"></i><span>Code</span>
      </a>
      ${liveBtnHTML}
    </div>
  `;
  return card;
}
const FALLBACK_REPOS = [
  {
    name: 'Taxi-Fare-Prediction',
    description: 'Predicting taxi fare amounts using machine learning regression models based on trip parameters.',
    language: 'Python',
    updated_at: '2026-06-12T00:00:00Z',
    stargazers_count: 0,
    topics: ['machine-learning', 'regression', 'scikit-learn'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction'
  },
  {
    name: 'Food_Delivery_Time-Using-ML',
    description: 'Predicting food delivery times dynamically based on distance, traffic, and weather conditions.',
    language: 'Python',
    updated_at: '2026-06-10T00:00:00Z',
    stargazers_count: 0,
    topics: ['predictive-modeling', 'machine-learning', 'streamlit'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Food_Delivery_Time-Using-ML'
  },
  {
    name: 'Discover-Your-True-Personality',
    description: 'An AI-powered personality analysis system utilizing questionnaire data to predict traits.',
    language: 'Python',
    updated_at: '2026-06-08T00:00:00Z',
    stargazers_count: 0,
    topics: ['data-science', 'personality-analysis', 'classification'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality'
  },
  {
    name: 'Library-Mangement',
    description: 'An interactive system for book allocation, user registers, and catalog management.',
    language: 'Python',
    updated_at: '2026-06-05T00:00:00Z',
    stargazers_count: 0,
    topics: ['database', 'management-system', 'oop'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Library-Mangement'
  },
  {
    name: 'Fake-News-Detection-Using-ML-Real-time',
    description: 'Real-time NLP classifier to detect fake news signals in textual reports.',
    language: 'Python',
    updated_at: '2026-06-02T00:00:00Z',
    stargazers_count: 0,
    topics: ['nlp', 'classification', 'text-mining'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time'
  },
  {
    name: 'stone-paper-scissors-python',
    description: 'A Python implementation of the classic game with user-vs-computer options.',
    language: 'Python',
    updated_at: '2026-05-28T00:00:00Z',
    stargazers_count: 0,
    topics: ['python-game', 'basics'],
    html_url: 'https://github.com/Raj-Rathod-Ai/stone-paper-scissors-python'
  },
  {
    name: 'neuro-os',
    description: 'A mock neural operating system interface built to demonstrate creative front-end styling.',
    language: 'JavaScript',
    updated_at: '2026-05-20T00:00:00Z',
    stargazers_count: 0,
    topics: ['creative-coding', 'web-app'],
    html_url: 'https://github.com/Raj-Rathod-Ai/neuro-os'
  },
  {
    name: 'Job-Analysis-Dashboard',
    description: 'An interactive dashboard showing job market insights, trends, and analytical insights.',
    language: 'Power BI',
    updated_at: '2026-05-15T00:00:00Z',
    stargazers_count: 0,
    topics: ['dashboard', 'data-analytics', 'job-market'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard'
  },
  {
    name: 'FlowerDiseaseSystem',
    description: 'Computer vision classification model to detect diseases in plant/flower leaves.',
    language: 'Python',
    updated_at: '2026-05-10T00:00:00Z',
    stargazers_count: 0,
    topics: ['cnn', 'deep-learning', 'computer-vision'],
    html_url: 'https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem'
  }
];

async function renderGitHubProjects() {
  const container = document.getElementById('github-projects-grid');
  const loadingEl = document.getElementById('projects-loading');
  if (!container) return;

  let repos = [];
  try {
    const res = await fetch('https://api.github.com/users/Raj-Rathod-Ai/repos?sort=updated&per_page=100');
    if (!res.ok) throw new Error('GitHub API rate limit or error');
    repos = await res.json();
  } catch (err) {
    console.warn('Projects API request failed, falling back to static project array.', err);
    repos = FALLBACK_REPOS;
  }

  const skipRepos = [
    'raj-rathod-ai',
    '.github',
    'impact-training-parul-university',
    'portfolio',
    'certificate',
    'portfolio-01',
    'neetcode-submissions',
    'neetcode'
  ];

  const filtered = repos.filter(r =>
    !skipRepos.includes(r.name.toLowerCase()) &&
    !r.archived &&
    !r.fork
  );

  if (loadingEl) loadingEl.remove();

  const soloRepos = filtered.filter(r => !isGroupProject(r.name));
  const groupRepos = filtered.filter(r => isGroupProject(r.name));

  // Clear existing items in container in case this is a re-fetch
  const sections = container.querySelectorAll('.mb-12');
  sections.forEach(s => s.remove());

  function buildSection(title, color, repoList, startIdx) {
    if (repoList.length === 0) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-12';
    wrapper.innerHTML = `
      <h3 class="font-jakarta font-semibold text-base text-gray-300 mb-5 flex items-center gap-2">
        <span class="w-5 h-px ${color} inline-block"></span>${title}
        <span class="font-mono text-xs text-gray-600">(${repoList.length})</span>
      </h3>
    `;
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5';
    repoList.forEach((repo, i) => grid.appendChild(buildProjectCard(repo, startIdx + i)));
    wrapper.appendChild(grid);
    return wrapper;
  }

  const soloSection = buildSection('Solo Projects', 'bg-teal', soloRepos, 0);
  const groupSection = buildSection('Group Projects', 'bg-secondary', groupRepos, soloRepos.length);
  if (soloSection) container.appendChild(soloSection);
  if (groupSection) container.appendChild(groupSection);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-10"><i class="fa-brands fa-github text-3xl text-gray-700 mb-3 block"></i><p class="font-inter text-sm text-gray-600">No public repositories found.</p></div>`;
  }

  initScrollReveals();
}
renderGitHubProjects();

setInterval(async () => {
  const container = document.getElementById('github-projects-grid');
  if (container) {
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="projects-loading">
      <div class="rounded-xl border border-white/8 p-6 bg-white/3 animate-pulse space-y-4"><div class="h-4 bg-white/10 rounded w-2/3"></div><div class="h-16 bg-white/10 rounded"></div></div>
      <div class="rounded-xl border border-white/8 p-6 bg-white/3 animate-pulse space-y-4"><div class="h-4 bg-white/10 rounded w-2/3"></div><div class="h-16 bg-white/10 rounded"></div></div>
      <div class="rounded-xl border border-white/8 p-6 bg-white/3 animate-pulse space-y-4"><div class="h-4 bg-white/10 rounded w-2/3"></div><div class="h-16 bg-white/10 rounded"></div></div>
    </div>`;
    await renderGitHubProjects();
  }
}, 5 * 60 * 1000);;
