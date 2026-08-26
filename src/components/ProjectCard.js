import { getLiveUrl, formatDate, slugify } from '../utils/helpers.js';
import { isBossDevice, getApiBaseUrl } from '../utils/analytics.js';

/* ── Badge CSS class lookup ──────────────────────────────────── */
const CAT_BADGE = {
  'Generative AI':    'cat-badge-genai',
  'RAG':              'cat-badge-rag',
  'Full Stack':       'cat-badge-fullstack',
  'Deep Learning':    'cat-badge-dl',
  'NLP':              'cat-badge-nlp',
  'Machine Learning': 'cat-badge-ml',
  'Data Science':     'cat-badge-ds',
  'Computer Vision':  'cat-badge-cv',
  'AI Agents':        'cat-badge-agents',
  'MLOps':            'cat-badge-mlops',
  'Normal Projects':  'cat-badge-normal',
  'Python Concepts':  'cat-badge-python',
};

/* ── Category icon lookup ──────────────────────────────────── */
const CAT_ICON = {
  'RAG':              { icon: 'fa-magnifying-glass-chart', color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
  'Generative AI':    { icon: 'fa-wand-magic-sparkles',    color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20' },
  'Full Stack':       { icon: 'fa-layer-group',          color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'Deep Learning':    { icon: 'fa-brain',                color: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20' },
  'NLP':              { icon: 'fa-language',             color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
  'Machine Learning': { icon: 'fa-chart-line',           color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  'Data Science':     { icon: 'fa-chart-pie',            color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  'Computer Vision':  { icon: 'fa-eye',                  color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  'AI Agents':        { icon: 'fa-robot',                color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
  'MLOps':            { icon: 'fa-gears',                color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20' },
  'Normal Projects':  { icon: 'fa-folder-open',          color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  'Python Concepts':  { icon: 'fa-snake',                color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
};

function getBadgeClass(cat) { return CAT_BADGE[cat] || 'cat-badge-others'; }
function getIconData(cat)   { return CAT_ICON[cat]  || { icon: 'fa-code', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }; }

/**
 * Format raw GitHub repo names into title format.
 */
function repoTitle(name = '') {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Derive 2-3 feature bullets from description or topics.
 */
function extractFeatures(repo) {
  const desc   = repo.description || '';
  const topics = repo.topics || [];
  const bullets = [];

  if (desc) {
    const parts = desc.split(/[.;!]/).map(s => s.trim()).filter(Boolean);
    parts.slice(0, 2).forEach(p => { if (p.length > 10) bullets.push(p); });
  }

  if (bullets.length < 2 && topics.length) {
    topics.slice(0, 2).forEach(t => {
      const formatted = t.replace(/[-_]/g, ' ');
      bullets.push(`Focus area: ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`);
    });
  }

  return bullets.slice(0, 3);
}

/**
 * Detect main framework or stack used.
 */
function detectFramework(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const desc   = (repo.description || '').toLowerCase();
  const lang   = (repo.language || '').toLowerCase();

  if (topics.includes('pytorch') || desc.includes('pytorch')) return 'PyTorch';
  if (topics.includes('tensorflow') || desc.includes('tensorflow')) return 'TensorFlow';
  if (topics.includes('scikit-learn') || topics.includes('sklearn') || desc.includes('scikit-learn')) return 'Scikit-Learn';
  if (topics.includes('langchain') || desc.includes('langchain')) return 'LangChain';
  if (topics.includes('openai') || desc.includes('openai')) return 'OpenAI API';
  if (topics.includes('fastapi') || desc.includes('fastapi')) return 'FastAPI';
  if (topics.includes('flask') || desc.includes('flask')) return 'Flask';
  if (topics.includes('react') || desc.includes('react')) return 'React';
  if (lang === 'python') return 'Python';
  if (lang === 'java') return 'Java';
  if (lang === 'c') return 'C Language';
  return null;
}

export class ProjectCard {
  /**
   * Render a project card.
   * @param {object} repo        - GitHub repo object.
   * @param {number} idx         - Grid index for stagger delay.
   * @param {Array}  localMeta   - projects.json entries.
   * @returns {string} HTML string.
   */
  render(repo, idx = 0, localMeta = []) {
    const iconData    = getIconData(repo.category);
    const badgeClass  = getBadgeClass(repo.category);
    const liveUrl     = getLiveUrl(repo, localMeta);
    const slug        = slugify(repo.name);
    const title       = repoTitle(repo.name);
    const desc        = (repo.description || 'No description provided.').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
    const lang        = repo.language || 'Mixed';
    const updated     = formatDate(repo.updated_at);
    const stars       = repo.stargazers_count || 0;
    const topics      = (repo.topics || []).slice(0, 4);
    const isGroup     = repo.isGroup || false;
    const isFeatured  = repo.featured || false;
    const features    = extractFeatures(repo);
    const framework   = detectFramework(repo);
    const staggerN    = Math.min((idx % 12) + 1, 12);

    const starsHTML = stars > 0
      ? `<span class="inline-flex items-center gap-1 text-amber-400 text-[10px] font-mono"><i class="fa-solid fa-star text-[8px]"></i>${stars}</span>`
      : '';

    const liveBtnHTML = liveUrl
      ? `<a href="${liveUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all hover:scale-105 active:scale-95" style="background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.3);color:#a5b4fc">
           <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>Live Demo
         </a>`
      : '';

    const featuredBadge = isFeatured
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono border" style="background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.25);color:#fbbf24"><i class="fa-solid fa-star text-[8px]"></i>Featured</span>`
      : '';

    const groupBadge = isGroup
      ? `<span class="px-2 py-0.5 rounded-md text-[9px] font-mono border" style="background:rgba(139,92,246,0.1);border-color:rgba(139,92,246,0.25);color:#c084fc">Group</span>`
      : `<span class="px-2 py-0.5 rounded-md text-[9px] font-mono border" style="background:rgba(20,184,166,0.1);border-color:rgba(20,184,166,0.25);color:#2dd4bf">Solo</span>`;

    const isUpcoming   = repo.isUpcoming || false;
    const displayTitle = repo.displayTitle || title;

    // Normal topics HTML
    const topicsHTML = topics.length
      ? topics.map(t => `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono border" style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#6b7280">${t}</span>`).join('')
      : '';

    // Back bullets HTML
    const bulletsHTML = features.length
      ? `<ul class="space-y-1.5 mt-1">${features.map(f =>
          `<li class="flex items-start gap-2 text-[11px] text-gray-400 leading-snug">
             <i class="fa-solid fa-circle-dot text-indigo-500 mt-0.5 flex-shrink-0 text-[7px]"></i>
             <span>${f}</span>
           </li>`).join('')}</ul>`
      : `<p class="text-[11px] text-gray-500 italic mt-1">See GitHub for full project description.</p>`;

    const frameworkBadge = framework
      ? `<div class="flex items-center gap-2 mt-3 pt-3 border-t" style="border-color:rgba(255,255,255,0.05)">
           <span class="text-[9px] font-mono text-gray-600 uppercase">Framework</span>
           <span class="px-2 py-0.5 rounded text-[9px] font-mono border" style="background:rgba(99,102,241,0.08);border-color:rgba(99,102,241,0.2);color:#818cf8">${framework}</span>
         </div>`
      : '';

    // Upcoming badge (clean normal text, no lock icon)
    const upcomingBadge = isUpcoming
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono border bg-amber-500/15 border-amber-500/30 text-amber-300">Coming Soon</span>`
      : '';

    // Action buttons (clean normal text, no lock icon)
    const actionBtnsHTML = isUpcoming
      ? `<button type="button" class="upcoming-lock-btn flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono border bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer" data-title="${displayTitle}">
           Coming Soon
         </button>`
      : `<a href="${repo.html_url}" target="_blank" rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all hover:scale-105 active:scale-95"
            style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:#9ca3af">
           <i class="fa-brands fa-github text-xs"></i>Code
         </a>
         ${liveBtnHTML}`;

    const isMaster = isBossDevice();
    const masterControlsHTML = isMaster ? `
      <div class="flex items-center justify-between gap-1.5 pt-2 border-t border-amber-500/20 bg-amber-950/20 -mx-5 -mb-2 px-5 py-1.5 mt-2">
        <span class="text-[8px] font-mono text-amber-400 font-bold tracking-wider">👑 MASTER:</span>
        <div class="flex items-center gap-1">
          <button type="button" class="boss-toggle-group-btn px-2 py-0.5 rounded text-[9px] font-mono border transition-all hover:scale-105 ${isGroup ? 'bg-purple-500/25 border-purple-500/50 text-purple-200' : 'bg-teal-500/20 border-teal-500/40 text-teal-300'}" data-name="${repo.name}">
            ${isGroup ? '👥 Group' : '👤 Solo'}
          </button>
          <button type="button" class="boss-toggle-featured-btn px-2 py-0.5 rounded text-[9px] font-mono border transition-all hover:scale-105 ${isFeatured ? 'bg-amber-500/30 border-amber-500/60 text-amber-200 font-bold' : 'bg-white/5 border-white/10 text-gray-400'}" data-name="${repo.name}">
            ${isFeatured ? '⭐ Featured (Top)' : '☆ Pin Top'}
          </button>
        </div>
      </div>
    ` : '';

    // Glassmorphism Blur Overlay for Upcoming Projects — shows name on hover
    const blurOverlayHTML = isUpcoming ? `
      <div class="upcoming-overlay absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/45 backdrop-blur-[5px] rounded-2xl select-none" style="transition: background 0.35s ease;">
        <!-- Name hint — fades in on hover -->
        <span class="upcoming-title-hint font-jakarta font-bold text-sm text-gray-100 text-center mb-3 opacity-0 translate-y-2 select-none pointer-events-none" style="transition: opacity 0.35s ease, transform 0.35s ease; max-width:90%">${displayTitle}</span>
        <span class="px-4 py-1.5 rounded-xl text-xs font-mono font-medium bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-xl tracking-wider uppercase">Coming Soon</span>
        <span class="upcoming-hover-hint font-inter text-[10px] text-gray-500 mt-2 opacity-0 pointer-events-none" style="transition: opacity 0.35s ease 0.1s;">Launching soon — Stay tuned!</span>
      </div>
    ` : '';

    const flipBtnFrontHTML = isUpcoming
      ? ''
      : `<button class="flip-btn z-30" title="See project details" aria-label="Flip card">
           <i class="fa-solid fa-rotate"></i>
         </button>`;

    const flipBtnBackHTML = isUpcoming
      ? ''
      : `<button class="flip-btn z-30" title="Go back" aria-label="Flip back">
           <i class="fa-solid fa-xmark"></i>
         </button>`;

    return `
    <div class="flip-card scroll-reveal reveal-zoom-fade stagger-${staggerN}" data-project-slug="${slug}">
      <div class="flip-card-inner">

        <!-- ===== FRONT ===== -->
        <div class="flip-card-front overflow-hidden ${isFeatured ? 'is-featured' : ''} ${isUpcoming ? 'border-amber-500/20 bg-amber-950/5' : ''} p-5 flex flex-col justify-between h-full">
          ${blurOverlayHTML}
          <!-- Flip trigger button (top-right corner) -->
          ${flipBtnFrontHTML}

          <!-- Scrollable Content Body (Front) -->
          <div class="space-y-3 flex-1 overflow-y-auto pr-1.5 scrollbar-thin my-1 min-h-0 ${isUpcoming ? 'filter blur-[4px] opacity-60 select-none' : ''}" data-lenis-prevent>
            <!-- Header row with right padding to clear flip button -->
            <div class="flex items-start justify-between gap-3 pr-6">
              <div class="w-10 h-10 rounded-xl ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
                <i class="fa-solid ${iconData.icon} ${iconData.color} text-base"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-jakarta font-bold text-sm text-gray-100 leading-tight line-clamp-2" title="${displayTitle}">${displayTitle}</h3>
                <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                  ${starsHTML}
                  <span class="text-[9px] font-mono text-gray-600">${lang} · ${isUpcoming ? 'In Progress' : updated}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-[11px] text-gray-400 leading-relaxed">${desc}</p>

            <!-- Topics -->
            <div class="flex flex-wrap gap-1.5 pt-1">${topicsHTML}</div>
          </div>

          <!-- Pinned Footer badges + actions -->
          <div class="space-y-2.5 pt-3 mt-1 border-t shrink-0 ${isUpcoming ? 'filter blur-[4px] opacity-60 select-none' : ''}" style="border-color:rgba(255,255,255,0.06)">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-md text-[9px] font-mono border ${badgeClass}">${repo.category}</span>
              ${upcomingBadge}
              ${groupBadge}
              ${featuredBadge}
            </div>
            <div class="flex items-center gap-2 pt-1">
              ${actionBtnsHTML}
            </div>
            ${masterControlsHTML}
          </div>
        </div>

        <!-- ===== BACK ===== -->
        <div class="flip-card-back overflow-hidden p-5 flex flex-col justify-between h-full">
          ${blurOverlayHTML}
          <!-- Unflip trigger button (top-right corner) -->
          ${flipBtnBackHTML}

          <!-- Scrollable Content Body (Back) -->
          <div class="space-y-3 flex-1 overflow-y-auto pr-1.5 scrollbar-thin my-1 min-h-0 ${isUpcoming ? 'filter blur-[4px] opacity-60 select-none' : ''}" data-lenis-prevent>
            <!-- Back header -->
            <div class="flex items-center gap-2 pr-6">
              <div class="w-8 h-8 rounded-lg ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
                <i class="fa-solid ${iconData.icon} ${iconData.color} text-xs"></i>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-jakarta font-bold text-sm text-gray-100 leading-tight truncate" title="${displayTitle}">${displayTitle}</h3>
                <span class="text-[9px] font-mono text-gray-600 block truncate">${repo.category}</span>
              </div>
            </div>

            <div style="height:1px;background:rgba(255,255,255,0.06)"></div>

            <!-- Overview -->
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">Overview</span>
              <p class="text-[11px] text-gray-300 leading-relaxed mt-1">${desc}</p>
            </div>

            <!-- Key features -->
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">Key Highlights</span>
              ${bulletsHTML}
            </div>

            ${frameworkBadge}
          </div>

          <!-- Back actions (Pinned to bottom) -->
          <div class="flex items-center gap-2 pt-2.5 mt-1 border-t shrink-0 ${isUpcoming ? 'filter blur-[4px] opacity-60 select-none' : ''}" style="border-color:rgba(255,255,255,0.06)">
            <a href="/projects/${slug}"
               class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold font-jakarta transition-all hover:scale-105 active:scale-95"
               style="background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.25));border:1px solid rgba(99,102,241,0.4);color:#c7d2fe">
              <i class="fa-solid fa-circle-info text-xs"></i>View Details
            </a>
            <a href="${repo.html_url}" target="_blank" rel="noopener"
               class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-mono border transition-all hover:scale-105 active:scale-95"
               style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:#9ca3af">
              <i class="fa-brands fa-github text-sm"></i>
            </a>
          </div>
        </div>

      </div>
    </div>
    `;
  }

  setup(container) {
    if (!container) return;

    // --- Flip card toggle ---
    container.querySelectorAll('.flip-card').forEach(card => {
      const inner = card.querySelector('.flip-card-inner');
      const toggleFlip = (e) => {
        // Prevent flip toggle if clicking inside links, interactive action buttons, or forms
        if (e.target.closest('a, button:not(.flip-btn), input, select, textarea, .upcoming-lock-btn, .boss-toggle-group-btn, .boss-toggle-featured-btn')) {
          return;
        }
        if (inner) inner.style.transform = '';
        card.classList.toggle('is-flipped');
      };

      card.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (inner) inner.style.transform = '';
          card.classList.toggle('is-flipped');
        });
      });

      card.addEventListener('click', toggleFlip);
    });

    // --- Upcoming card hover reveal (show name on hover) ---
    container.querySelectorAll('.upcoming-overlay').forEach(overlay => {
      const card = overlay.closest('.flip-card');
      const titleHint = overlay.querySelector('.upcoming-title-hint');
      const hoverHint = overlay.querySelector('.upcoming-hover-hint');

      if (!card) return;

      card.addEventListener('mouseenter', () => {
        overlay.style.background = 'rgba(0,0,0,0.55)';
        if (titleHint) {
          titleHint.style.opacity = '1';
          titleHint.style.transform = 'translateY(0)';
        }
        if (hoverHint) hoverHint.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        overlay.style.background = '';
        if (titleHint) {
          titleHint.style.opacity = '0';
          titleHint.style.transform = 'translateY(8px)';
        }
        if (hoverHint) hoverHint.style.opacity = '0';
      });
    });

    // --- Helper: instant in-place update of badge (no page reload) ---
    const updateCardBadge = (repoName, newIsGroup, newFeatured) => {
      // Update every card matching this repo name in the current container
      container.querySelectorAll(`.flip-card[data-project-slug]`).forEach(card => {
        const slug = card.dataset.projectSlug;
        // Try to find the repo by slug match
        const repo = (window.portfolioData?.repos || []).find(r =>
          r.name.toLowerCase().replace(/[\s_]/g, '-') === slug || r.name === repoName
        );
        if (!repo || repo.name !== repoName) return;

        // Update group badge text + class
        const groupBtn = card.querySelector('.boss-toggle-group-btn');
        if (groupBtn && newIsGroup !== undefined) {
          const isGrp = newIsGroup;
          groupBtn.textContent = isGrp ? '👥 Group' : '👤 Solo';
          groupBtn.className = groupBtn.className.replace(
            /bg-\w+-\d+\/\d+\s+border-\w+-\d+\/\d+\s+text-\w+-\d+/g, ''
          );
          groupBtn.className += isGrp
            ? ' bg-purple-500/25 border-purple-500/50 text-purple-200'
            : ' bg-teal-500/20 border-teal-500/40 text-teal-300';

          // Also update the front badge
          const frontBadges = card.querySelectorAll('.flip-card-front .flex.flex-wrap span[class*="py-0.5"]');
          frontBadges.forEach(b => {
            if (b.textContent.trim() === 'Solo' || b.textContent.trim() === 'Group') {
              b.textContent = isGrp ? 'Group' : 'Solo';
            }
          });
        }

        // Update featured badge + shimmer
        const featuredBtn = card.querySelector('.boss-toggle-featured-btn');
        if (featuredBtn && newFeatured !== undefined) {
          const isFeat = newFeatured;
          featuredBtn.textContent = isFeat ? '⭐ Featured (Top)' : '☆ Pin Top';
          const front = card.querySelector('.flip-card-front');
          if (front) {
            front.classList.toggle('is-featured', isFeat);
          }
        }
      });
    };

    // --- Master Boss Solo/Group Toggle (NO page reload) ---
    container.querySelectorAll('.boss-toggle-group-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const repoName = btn.dataset.name;
        if (!repoName) return;

        const overrides = JSON.parse(localStorage.getItem('boss_project_overrides') || '{}');
        const existing = overrides[repoName] || {};
        const repo = (window.portfolioData?.repos || []).find(r => r.name === repoName);
        const currentIsGroup = existing.isGroup !== undefined ? existing.isGroup : (repo?.isGroup || false);
        const newIsGroup = !currentIsGroup;

        overrides[repoName] = { ...existing, isGroup: newIsGroup };
        localStorage.setItem('boss_project_overrides', JSON.stringify(overrides));

        // Apply instantly without reload
        updateCardBadge(repoName, newIsGroup, undefined);

        // Update in global data too
        if (window.portfolioData?.repos) {
          const r = window.portfolioData.repos.find(r => r.name === repoName);
          if (r) r.isGroup = newIsGroup;
        }

        // Sync to backend silently
        fetch(getApiBaseUrl() + '/api/project-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ overrides })
        }).catch(() => {});
      });
    });

    // --- Master Boss Featured Pin Top Toggle (NO page reload) ---
    container.querySelectorAll('.boss-toggle-featured-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const repoName = btn.dataset.name;
        if (!repoName) return;

        const overrides = JSON.parse(localStorage.getItem('boss_project_overrides') || '{}');
        const existing = overrides[repoName] || {};
        const repo = (window.portfolioData?.repos || []).find(r => r.name === repoName);
        const currentFeatured = existing.featured !== undefined ? existing.featured : (repo?.featured || false);
        const newFeatured = !currentFeatured;

        overrides[repoName] = { ...existing, featured: newFeatured };
        localStorage.setItem('boss_project_overrides', JSON.stringify(overrides));

        // Apply instantly without reload
        updateCardBadge(repoName, undefined, newFeatured);

        // Update in global data too
        if (window.portfolioData?.repos) {
          const r = window.portfolioData.repos.find(r => r.name === repoName);
          if (r) r.featured = newFeatured;
        }

        // Sync to backend silently
        fetch(getApiBaseUrl() + '/api/project-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ overrides })
        }).catch(() => {});
      });
    });
  }
}
