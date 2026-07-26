import { getRepoIcon, getLiveUrl, formatDate, slugify } from '../utils/helpers.js';
import { navigate } from '../router.js';

const ACCENT_CYCLE = [
  { hover: 'hover:border-primary/45 hover:bg-primary/3' },
  { hover: 'hover:border-secondary/45 hover:bg-secondary/3' },
  { hover: 'hover:border-teal/45 hover:bg-teal/3' },
  { hover: 'hover:border-accent/45 hover:bg-accent/3' },
  { hover: 'hover:border-rose/45 hover:bg-rose/3' },
  { hover: 'hover:border-sky/45 hover:bg-sky/3' }
];

/**
 * ProjectCard component that renders a single project card.
 */
export class ProjectCard {
  /**
   * Render project card HTML.
   * @param {object} repo - GitHub Repository object.
   * @param {number} idx - Index of project in the list (used for accent color cycling).
   * @param {Array} localMetadata - Local metadata array from projects.json.
   * @returns {string} ProjectCard HTML string.
   */
  render(repo, idx, localMetadata = []) {
    const accent = ACCENT_CYCLE[idx % ACCENT_CYCLE.length];
    const iconData = getRepoIcon(repo);
    const liveUrl = getLiveUrl(repo, localMetadata);
    const rawDesc = repo.description || 'No description available.';
    const desc = rawDesc.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
    const lang = repo.language || 'Mixed';
    const updatedDate = formatDate(repo.updated_at);
    const repoTitle = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
    
    // Check if group project
    const meta = localMetadata.find(m => m.repo.toLowerCase() === repo.name.toLowerCase());
    const isGroup = meta && meta.type ? meta.type === 'group' : repo.isGroup;

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

    const categoryName = repo.category || 'Others';
    const categoryBadge = `<span class="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary">${categoryName}</span>`;

    const projectSlug = slugify(repo.name);

    return `
      <div class="rounded-xl border border-white/8 p-5 bg-white/3 ${accent.hover} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4 scroll-reveal reveal-zoom-fade" data-project-slug="${projectSlug}">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="w-10 h-10 rounded-xl ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0">
              <i class="fa-solid ${iconData.icon} ${iconData.color}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-jakarta font-semibold text-sm text-gray-100 leading-snug cursor-pointer hover:text-primary transition-colors project-title-click" title="${repo.name}">${repoTitle}</h3>
              <span class="font-mono text-[10px] text-gray-600">${lang} · ${updatedDate}</span>
            </div>
            ${starsHTML}
          </div>
          <p class="font-inter text-xs text-gray-500 leading-relaxed" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${desc}</p>
          <div class="flex items-center flex-wrap gap-2">${groupBadge}${categoryBadge}${topicsHTML}</div>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-white/5">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-white transition-colors">
            <i class="fa-brands fa-github"></i><span>Code</span>
          </a>
          <a href="/projects/${projectSlug}" class="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-white transition-colors project-details-btn">
            <i class="fa-solid fa-circle-info"></i><span>Details</span>
          </a>
          ${liveBtnHTML}
        </div>
      </div>
    `;
  }

  /**
   * Bind events for project details routing.
   * @param {HTMLElement} container - The grid container.
   */
  setup(container) {
    if (!container) return;
    
    // Bind click on project title
    container.querySelectorAll('.project-title-click').forEach(title => {
      title.addEventListener('click', (e) => {
        e.preventDefault();
        const card = title.closest('[data-project-slug]');
        const slug = card.getAttribute('data-project-slug');
        navigate(`/projects/${slug}`);
      });
    });

    // Bind click on details button
    container.querySelectorAll('.project-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('[data-project-slug]');
        const slug = card.getAttribute('data-project-slug');
        navigate(`/projects/${slug}`);
      });
    });
  }
}
