import { getLiveUrl, formatDate, slugify } from '../utils/helpers.js';

/* ── Badge CSS class lookup ──────────────────────────────────── */
const CAT_BADGE = {
  'Generative AI':    'cat-badge-genai',
  'RAG':              'cat-badge-rag',
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
  'Generative AI':    { icon: 'fa-wand-magic-sparkles', bg: 'bg-indigo-500/15',  border: 'border-indigo-500/25', color: 'text-indigo-400'  },
  'RAG':              { icon: 'fa-magnifying-glass-chart', bg: 'bg-rose-500/15', border: 'border-rose-500/25',   color: 'text-rose-400'    },
  'Deep Learning':    { icon: 'fa-brain',             bg: 'bg-teal-500/15',      border: 'border-teal-500/25',   color: 'text-teal-400'    },
  'NLP':              { icon: 'fa-language',          bg: 'bg-purple-500/15',    border: 'border-purple-500/25', color: 'text-purple-400'  },
  'Machine Learning': { icon: 'fa-chart-line',        bg: 'bg-blue-500/15',      border: 'border-blue-500/25',   color: 'text-blue-400'    },
  'Data Science':     { icon: 'fa-chart-pie',         bg: 'bg-amber-500/15',     border: 'border-amber-500/25',  color: 'text-amber-400'   },
  'Computer Vision':  { icon: 'fa-eye',               bg: 'bg-cyan-500/15',      border: 'border-cyan-500/25',   color: 'text-cyan-400'    },
  'AI Agents':        { icon: 'fa-robot',             bg: 'bg-pink-500/15',      border: 'border-pink-500/25',   color: 'text-pink-400'    },
  'MLOps':            { icon: 'fa-gears',             bg: 'bg-slate-500/15',     border: 'border-slate-500/25',  color: 'text-slate-400'   },
  'Normal Projects':  { icon: 'fa-folder-open',       bg: 'bg-green-500/15',     border: 'border-green-500/25',  color: 'text-green-400'   },
  'Python Concepts':  { icon: 'fa-snake',             bg: 'bg-yellow-500/15',    border: 'border-yellow-500/25', color: 'text-yellow-400'  },
  'Java Projects':    { icon: 'fa-mug-hot',           bg: 'bg-orange-500/15',    border: 'border-orange-500/25', color: 'text-orange-400'  },
  'C Programming':    { icon: 'fa-c',                 bg: 'bg-sky-500/15',       border: 'border-sky-500/25',    color: 'text-sky-400'     },
  'JavaScript Projects': { icon: 'fa-js',             bg: 'bg-yellow-400/15',    border: 'border-yellow-400/25', color: 'text-yellow-300'  },
  'Utilities':        { icon: 'fa-wrench',            bg: 'bg-gray-500/15',      border: 'border-gray-500/25',   color: 'text-gray-400'    },
  'Tools':            { icon: 'fa-screwdriver-wrench',bg: 'bg-teal-600/15',      border: 'border-teal-600/25',   color: 'text-teal-300'    },
  'Automation':       { icon: 'fa-bolt',              bg: 'bg-violet-500/15',    border: 'border-violet-500/25', color: 'text-violet-400'  },
  'Others':           { icon: 'fa-box-open',          bg: 'bg-gray-500/15',      border: 'border-gray-500/25',   color: 'text-gray-400'    },
};

function getIconData(category) {
  return CAT_ICON[category] || CAT_ICON['Others'];
}

function getBadgeClass(category) {
  return CAT_BADGE[category] || 'cat-badge-others';
}

/**
 * Extract up to 5 key feature bullets from description + topics.
 */
function extractFeatures(repo) {
  const bullets = [];
  const desc = repo.description || '';
  const topics = (repo.topics || []);

  // Split description into sentences and pick first 2 meaningful ones
  const sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  sentences.slice(0, 2).forEach(s => bullets.push(s));

  // Add topics as "technology" bullets
  const techTopics = topics.filter(t =>
    !['machine-learning','deep-learning','nlp','rag','genai','python','web-app','basics'].includes(t)
  ).slice(0, 3);
  if (techTopics.length) bullets.push(`Technologies: ${techTopics.map(t => t.replace(/-/g,' ')).join(', ')}`);

  return bullets.slice(0, 4);
}

/**
 * Detect the primary framework/AI model from topics and language.
 */
function detectFramework(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const frameworks = [
    ['langchain', 'LangChain'], ['openai', 'OpenAI API'], ['gemini', 'Gemini API'],
    ['pytorch', 'PyTorch'], ['tensorflow', 'TensorFlow'], ['keras', 'Keras'],
    ['scikit-learn', 'Scikit-Learn'], ['huggingface', 'HuggingFace'], ['streamlit', 'Streamlit'],
    ['fastapi', 'FastAPI'], ['flask', 'Flask'], ['opencv', 'OpenCV'],
    ['xgboost', 'XGBoost'], ['bert', 'BERT'], ['llama', 'LLaMA']
  ];
  for (const [topic, label] of frameworks) {
    if (topics.includes(topic)) return label;
  }
  return repo.language || null;
}

/**
 * Format repo name to a readable title.
 */
function repoTitle(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export class ProjectCard {
  /**
   * Render a single flip card for a repo.
   * @param {object} repo        - GitHub repo object (with .category, .isGroup, .featured pre-merged).
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

    // Front: tech chips
    const topicsHTML = topics.length
      ? topics.map(t => `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono border" style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#6b7280">${t}</span>`).join('')
      : '';

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

    // Back: feature bullets
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

    return `
    <div class="flip-card scroll-reveal reveal-zoom-fade stagger-${staggerN}" data-project-slug="${slug}">
      <div class="flip-card-inner">

        <!-- ===== FRONT ===== -->
        <div class="flip-card-front ${isFeatured ? 'is-featured' : ''} p-5 flex flex-col justify-between">
          <!-- Flip trigger button (top-right corner) -->
          <button class="flip-btn" title="See project details" aria-label="Flip card">
            <i class="fa-solid fa-rotate"></i>
          </button>
          <!-- Header row -->
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="w-10 h-10 rounded-xl ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
                <i class="fa-solid ${iconData.icon} ${iconData.color} text-base"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-jakarta font-bold text-sm text-gray-100 leading-tight line-clamp-2" title="${title}">${title}</h3>
                <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                  ${starsHTML}
                  <span class="text-[9px] font-mono text-gray-600">${lang} · ${updated}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-[11px] text-gray-500 leading-relaxed" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${desc}</p>

            <!-- Topics -->
            <div class="flex flex-wrap gap-1">${topicsHTML}</div>
          </div>

          <!-- Footer badges + actions -->
          <div class="space-y-3 mt-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-md text-[9px] font-mono border ${badgeClass}">${repo.category}</span>
              ${groupBadge}
              ${featuredBadge}
            </div>
            <div class="flex items-center gap-2 pt-2 border-t" style="border-color:rgba(255,255,255,0.05)">
              <a href="${repo.html_url}" target="_blank" rel="noopener"
                 class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all hover:scale-105 active:scale-95"
                 style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:#9ca3af">
                <i class="fa-brands fa-github text-xs"></i>Code
              </a>
              ${liveBtnHTML}
            </div>
          </div>
        </div>

        <!-- ===== BACK ===== -->
        <div class="flip-card-back p-5 flex flex-col justify-between">
          <!-- Unflip trigger button (top-right corner) -->
          <button class="flip-btn" title="Go back" aria-label="Flip back">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div class="space-y-3">
            <!-- Back header -->
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
                <i class="fa-solid ${iconData.icon} ${iconData.color} text-xs"></i>
              </div>
              <div>
                <h3 class="font-jakarta font-bold text-sm text-gray-100 leading-tight">${title}</h3>
                <span class="text-[9px] font-mono text-gray-600">${repo.category}</span>
              </div>
            </div>

            <div style="height:1px;background:rgba(255,255,255,0.05)"></div>

            <!-- Overview -->
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-gray-600">Overview</span>
              <p class="text-[11px] text-gray-400 leading-relaxed mt-1">${desc}</p>
            </div>

            <!-- Key features -->
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-gray-600">Key Points</span>
              ${bulletsHTML}
            </div>

            ${frameworkBadge}
          </div>

          <!-- Back actions -->
          <div class="flex items-center gap-2 pt-3 mt-2 border-t" style="border-color:rgba(255,255,255,0.05)">
            <a href="/projects/${slug}"
               class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold font-jakarta transition-all hover:scale-105 active:scale-95"
               style="background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.25));border:1px solid rgba(99,102,241,0.4);color:#c7d2fe">
              <i class="fa-solid fa-circle-info text-xs"></i>View Details
            </a>
            <a href="${repo.html_url}" target="_blank" rel="noopener"
               class="p-2 rounded-xl border transition-all hover:scale-105 active:scale-95"
               style="border-color:rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:#6b7280">
              <i class="fa-brands fa-github text-sm"></i>
            </a>
            ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener"
               class="p-2 rounded-xl border transition-all hover:scale-105 active:scale-95"
               style="border-color:rgba(99,102,241,0.25);background:rgba(99,102,241,0.08);color:#818cf8">
              <i class="fa-solid fa-arrow-up-right-from-square text-sm"></i>
            </a>` : ''}
          </div>
        </div>

      </div>
    </div>`;
  }

  /**
   * Wire up click-only flip toggle via dedicated .flip-btn buttons.
   * Links (Live Demo, GitHub, View Details) always work without flipping.
   * @param {HTMLElement} container
   */
  setup(container) {
    container.querySelectorAll('.flip-card').forEach(card => {
      card.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation(); // Don't bubble to any parent handlers
          card.classList.toggle('is-flipped');
        });
      });
    });
  }
}
