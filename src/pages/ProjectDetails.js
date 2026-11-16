import { getRepoIcon, getLiveUrl, formatDate, slugify } from '../utils/helpers.js';
import { fetchGitHubProjectDetails } from '../api/github.js';

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '#';
  } catch (_) { return '#'; }
}

/**
 * ProjectDetails page component showing comprehensive information for a single project repository.
 */
export class ProjectDetails {
  /**
   * Render the Project Details page HTML structure.
   * @param {object} repo - The active repository object.
   * @param {Array} localMetadata - Local metadata override configurations.
   * @returns {string} Detailed page HTML markup.
   */
  render(repo, localMetadata = []) {
    if (!repo) {
      return `
        <section id="project-details" class="py-24 px-6 max-w-4xl mx-auto w-full min-h-[80vh] flex flex-col justify-center items-center text-center">
          <i class="fa-solid fa-circle-exclamation text-rose text-4xl mb-4"></i>
          <h2 class="font-jakarta font-extrabold text-xl text-gray-100">Project Not Found</h2>
          <p class="font-inter text-sm text-gray-500 mt-2">The requested project repository could not be located or is private.</p>
          <a href="/projects" class="back-to-projects-btn mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-white">
            Back to Projects
          </a>
        </section>
      `;
    }

    const iconData = getRepoIcon(repo);
    const liveUrl = getLiveUrl(repo, localMetadata);
    const updatedDate = formatDate(repo.updated_at);
    const createdDate = formatDate(repo.created_at);
    const repoTitle = escapeHtml(repo.name.replace(/-/g, ' ').replace(/_/g, ' '));
    const repoName = escapeHtml(repo.name);
    const repoUrl = safeHttpUrl(repo.html_url);
    const lang = escapeHtml(repo.language || 'Mixed');
    const forksCount = repo.forks_count || 0;
    const openIssues = repo.open_issues_count || 0;
    const licenseName = escapeHtml(repo.license?.name || 'Not specified');
    const defaultBranch = escapeHtml(repo.default_branch || 'main');
    const repoSize = repo.size ? `${(repo.size / 1024).toFixed(2)} MB` : 'Unknown';

    // Compute back link dynamically to point to the project's category workspace
    const categoryName = escapeHtml(repo.category || 'Others');
    const categorySlug = String(repo.category || 'Others').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const backHref = `/projects/${categorySlug}`;

    // Group Badge
    const meta = localMetadata.find(m => m.repo && repo?.name && m.repo.toLowerCase() === repo.name.toLowerCase());
    const isGroup = meta && meta.type ? meta.type === 'group' : repo.isGroup;
    const groupBadge = isGroup
      ? `<span class="px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-[10px] font-mono text-secondary">Group Project</span>`
      : `<span class="px-2.5 py-1 rounded-md bg-teal/10 border border-teal/20 text-[10px] font-mono text-teal">Solo Project</span>`;

    // Category Badge
    const categoryBadge = `<span class="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary">${categoryName}</span>`;

    // Stars HTML
    const starsHTML = repo.stargazers_count > 0
      ? `<div class="flex items-center gap-1.5 text-accent px-2.5 py-1 rounded-md bg-accent/5 border border-accent/10"><i class="fa-solid fa-star text-xs"></i><span class="font-mono text-xs font-semibold">${repo.stargazers_count} Stars</span></div>`
      : '';

    // Topics/Technologies HTML
    const topicsHTML = repo.topics && repo.topics.length > 0
      ? `<div class="flex flex-wrap gap-2">${repo.topics.map(t =>
          `<span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs font-mono text-gray-400">#${escapeHtml(t)}</span>`
        ).join('')}</div>`
      : `<p class="text-xs text-gray-600 italic">No topics tagged on GitHub.</p>`;

    // Live deployment button
    const liveBtnHTML = liveUrl
      ? `<a href="${liveUrl}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary font-jakarta text-xs font-semibold text-white shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
           <i class="fa-solid fa-arrow-up-right-from-square text-sm"></i><span>Launch Live Demo</span>
         </a>`
      : '';

    return `
      <section id="project-details" class="py-24 px-6 max-w-4xl mx-auto w-full min-h-[85vh]">
        <!-- Breadcrumb / Back button -->
        <div class="flex items-center gap-3 mb-8">
          <a href="${backHref}" class="back-to-projects-btn flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-gray-300 hover:text-white hover:border-primary/50 transition-all select-none">
            <i class="fa-solid fa-arrow-left"></i><span>Back</span>
          </a>
          <span class="font-mono text-xs text-gray-600">Projects / ${repo.name}</span>
        </div>

        <!-- Spotlight detail card wrapper -->
        <div class="rounded-2xl border border-white/8 p-8 bg-white/3 spotlight-card space-y-8 relative overflow-hidden" 
             style="background: rgba(22, 27, 34, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
          
          <!-- Card header details -->
          <div class="flex items-start justify-between gap-6 flex-wrap pb-6 border-b border-white/5">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-14 h-14 rounded-xl ${iconData.bg} border ${iconData.border} flex items-center justify-center flex-shrink-0 text-xl">
                <i class="fa-solid ${iconData.icon} ${iconData.color}"></i>
              </div>
              <div class="min-w-0">
                <h1 class="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-100 truncate">${repoTitle}</h1>
                <p class="font-mono text-xs text-gray-500 mt-1">Repo: <a href="${repoUrl}" target="_blank" class="hover:underline text-gray-400">${repo.name}</a></p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              ${starsHTML}
              ${groupBadge}
              ${categoryBadge}
            </div>
          </div>

          <!-- Description content -->
          <div class="space-y-3">
            <h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">About the Project</h3>
            <p class="font-inter text-sm text-gray-400 leading-relaxed">${escapeHtml(repo.description || 'No project description was set for this repository.')}</p>
          </div>

          <!-- Key Technical Tags -->
          <div class="space-y-3">
            <h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">Technologies & Tags</h3>
            ${topicsHTML}
          </div>

          <!-- Technical Grid parameters -->
          <div class="space-y-3">
            <h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">Repository Details</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Language</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm">${lang}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Default Branch</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm">${defaultBranch}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Repo Size</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm">${repoSize}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">License</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm truncate" title="${licenseName}">${licenseName}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Created Date</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-xs">${createdDate || 'N/A'}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Last Updated</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-xs">${updatedDate || 'N/A'}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Open Issues</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm">${openIssues}</span>
              </div>
              <div class="rounded-xl border border-white/6 p-4 bg-white/2">
                <span class="block font-mono text-[10px] text-gray-600 uppercase">Total Forks</span>
                <span class="block font-jakarta font-semibold text-gray-300 mt-1 text-sm">${forksCount}</span>
              </div>
            </div>
          </div>

          <div id="project-details-live-data" class="space-y-5" aria-live="polite">
            <p class="text-xs text-gray-500 font-mono"><i class="fa-solid fa-rotate fa-spin mr-2"></i>Loading live repository details from GitHub…</p>
          </div>

          <!-- Bottom Actions -->
          <div class="flex gap-4 pt-6 border-t border-white/5 flex-wrap">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl border border-white/10 bg-white/5 font-jakarta text-xs font-semibold text-gray-300 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2">
              <i class="fa-brands fa-github text-base"></i><span>Code Repository</span>
            </a>
            ${liveBtnHTML}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Bind event listeners for project details page (smart back navigation).
   */
  setup(repo) {
    if (window.initializeObservers) window.initializeObservers();

    // Fetch this repository's own metadata, language breakdown, README and contributors.
    if (repo && repo.name) {
      const target = document.getElementById('project-details-live-data');
      const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
      fetchGitHubProjectDetails(repo.name).then(data => {
        if (!target || !document.body.contains(target)) return;
        const liveRepo = data.repository;
        const languageEntries = Object.entries(data.languages || {}).sort((a, b) => b[1] - a[1]);
        const totalBytes = languageEntries.reduce((sum, entry) => sum + Number(entry[1] || 0), 0);
        const languageHtml = languageEntries.length ? languageEntries.map(entry => {
          const percent = totalBytes ? Number(entry[1]) / totalBytes * 100 : 0;
          return '<span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs font-mono text-gray-300">' + escapeHtml(entry[0]) + ' · ' + percent.toFixed(1) + '%</span>';
        }).join('') : '<span class="text-xs text-gray-500">No language statistics are published for this repository.</span>';
        const topics = Array.isArray(liveRepo.topics) ? liveRepo.topics : [];
        const topicHtml = topics.length ? topics.map(topic => '<span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs font-mono text-gray-400">#' + escapeHtml(topic) + '</span>').join('') : '<span class="text-xs text-gray-500">No GitHub topics have been added.</span>';
        const readmeHtml = data.readme ? '<pre class="whitespace-pre-wrap break-words max-h-[34rem] overflow-auto rounded-xl border border-white/8 bg-black/20 p-4 text-xs leading-relaxed text-gray-300 font-mono">' + escapeHtml(data.readme.slice(0, 24000)) + '</pre>' : '<p class="text-xs text-gray-500">This repository does not have a public README.</p>';
        const contributors = Array.isArray(data.contributors) ? data.contributors : [];
        const contributorsHtml = contributors.length ? '<div class="flex flex-wrap gap-3">' + contributors.map(person => '<a href="' + escapeHtml(person.html_url) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white"><img src="' + escapeHtml(person.avatar_url) + '" alt="" loading="lazy" class="w-6 h-6 rounded-full"><span>' + escapeHtml(person.login) + '</span><span class="text-gray-600">' + (Number(person.contributions) || 0) + ' contributions</span></a>').join('') + '</div>' : '<p class="text-xs text-gray-500">Contributor data is not available.</p>';
        target.innerHTML = '<section class="space-y-3"><div class="flex items-center justify-between gap-3 flex-wrap"><h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">Live GitHub Technologies</h3><span class="text-[10px] font-mono text-gray-600">Fetched ' + escapeHtml(new Date(data.fetchedAt || Date.now()).toLocaleString()) + '</span></div><div class="flex flex-wrap gap-2">' + languageHtml + '</div><div class="flex flex-wrap gap-2">' + topicHtml + '</div><div class="grid grid-cols-2 sm:grid-cols-4 gap-3">' +
          '<div class="rounded-xl border border-white/6 p-3 bg-white/2"><span class="block text-[10px] text-gray-600 uppercase">Watchers</span><strong class="text-sm text-gray-300">' + (Number(liveRepo.watchers_count) || 0) + '</strong></div>' +
          '<div class="rounded-xl border border-white/6 p-3 bg-white/2"><span class="block text-[10px] text-gray-600 uppercase">Forks</span><strong class="text-sm text-gray-300">' + (Number(liveRepo.forks_count) || 0) + '</strong></div>' +
          '<div class="rounded-xl border border-white/6 p-3 bg-white/2"><span class="block text-[10px] text-gray-600 uppercase">Open Issues</span><strong class="text-sm text-gray-300">' + (Number(liveRepo.open_issues_count) || 0) + '</strong></div>' +
          '<div class="rounded-xl border border-white/6 p-3 bg-white/2"><span class="block text-[10px] text-gray-600 uppercase">Last Push</span><strong class="text-xs text-gray-300">' + escapeHtml(formatDate(liveRepo.pushed_at) || 'N/A') + '</strong></div></div></section>' +
          '<section class="space-y-3"><h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">Repository README</h3>' + readmeHtml + (data.readmeUrl ? '<a class="inline-flex text-xs text-indigo-300 hover:text-indigo-200" href="' + escapeHtml(data.readmeUrl) + '" target="_blank" rel="noopener noreferrer">Open formatted README on GitHub</a>' : '') + '</section>' +
          '<section class="space-y-3"><h3 class="font-jakarta font-bold text-sm text-gray-300 uppercase tracking-wider">Contributors</h3>' + contributorsHtml + '</section>';
      }).catch(error => {
        if (target) target.innerHTML = '<p class="text-xs text-amber-300" role="status">Live GitHub details could not be loaded: ' + escapeHtml(error.message) + '. The repository summary above is still available.</p>';
      });
    }

    // Smart Back button click interceptor
    document.querySelectorAll('.back-to-projects-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const hasHistory = window.history.length > 1 && document.referrer.includes(window.location.host);
        if (hasHistory) {
          window.history.back();
        } else {
          const href = btn.getAttribute('href') || '/projects';
          import('../router.js').then(m => m.navigate(href));
        }
      });
    });
  }
}
