import { CategoryCard } from '../components/CategoryCard.js';
import { ProjectGrid } from '../components/ProjectGrid.js';
import { SearchBar } from '../components/SearchBar.js';
import { FilterBar } from '../components/FilterBar.js';
import { SortBar } from '../components/SortBar.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { getAllCategories } from '../utils/categorize.js';
import { searchProjects, filterProjects } from '../utils/filters.js';
import { sortProjects } from '../utils/sort.js';

export class Projects {
  constructor() {
    this.categoryCard = new CategoryCard();
    this.projectGrid  = new ProjectGrid();
    this.searchBar    = new SearchBar();
    this.filterBar    = new FilterBar();
    this.sortBar      = new SortBar();
    this.skeleton     = new LoadingSkeleton();

    this.searchQuery    = '';
    this.activeFilter   = 'all';
    this.activeCategory = 'all';
    this.activeSort     = 'default';
  }

  /** Render the HTML shell for the projects page. */
  render(categorySlug = null) {
    return `
    <section id="projects" class="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full min-h-[85vh]">
      <!-- Top Navigation & Live Sync Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-theme-border">
        <div class="flex items-center gap-3 flex-wrap">
          <a href="/"
             class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-theme-border bg-bg-alt hover:border-accent text-xs font-mono text-fg transition-all select-none group shadow-sm">
            <i class="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span>Back to Home</span>
          </a>
          <span class="text-fg-subtle font-mono text-xs">/</span>
          <span class="font-mono text-xs text-accent flex items-center gap-1.5">
            <i class="fa-solid fa-folder-open text-xs"></i>
            <span id="active-category-breadcrumb">${categorySlug ? slugFromSlug(categorySlug) : 'All Projects'}</span>
          </span>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-xs font-mono text-teal-400">
            <span class="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block"></span>
            Auto-synced from GitHub (@Raj-Rathod-Ai)
          </span>
          <span id="active-category-count"
                class="px-3.5 py-1.5 rounded-xl border border-theme-border bg-bg-alt text-xs font-mono text-fg">
            Loading repositories...
          </span>
        </div>
      </div>

      <!-- Section Header -->
      <div class="text-center space-y-4 mb-10">
        <span class="font-mono text-xs text-accent uppercase tracking-widest">Portfolio &amp; Production Deployments</span>
        <h1 id="active-page-title" class="text-3xl sm:text-4xl md:text-5xl font-jakarta font-extrabold text-fg">
          ${categorySlug ? slugFromSlug(categorySlug) : 'All Projects &amp; Repositories'}
        </h1>
        <div class="flex items-center justify-center gap-1.5 select-none pointer-events-none">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
          <span class="w-16 h-px bg-gradient-to-r from-accent via-secondary to-transparent rounded-full"></span>
          <span class="w-2 h-2 rounded-full bg-secondary"></span>
          <span class="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-accent rounded-full"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-ping" style="animation-delay:.5s"></span>
        </div>
        <p class="font-inter text-sm sm:text-base text-fg-muted max-w-2xl mx-auto leading-relaxed">
          Full catalog of AI models, Deep Learning pipelines, computer vision classifiers, and full-stack web applications. Explore live deployments, inspect architectural specs, or browse GitHub source code.
        </p>
      </div>

      <!-- Interactive Category Filter Pills -->
      <div id="category-pills-bar" class="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        <!-- Rendered in setup() -->
      </div>

      <!-- Toolbar: Search + Type Filter + Sort -->
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-10 pb-6 border-b" style="border-color:rgba(255,255,255,0.05)">
        <div id="search-bar-mount"></div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div id="filter-bar-mount" class="flex-1 overflow-x-auto pb-0.5"></div>
          <div id="sort-bar-mount" class="shrink-0"></div>
        </div>
      </div>

      <!-- Projects Grid Mount -->
      <div id="category-projects-mount">
        ${this.skeleton.render(6)}
      </div>
    </section>`;
  }

  setup(projects = [], localMeta = [], categorySlug = null) {
    this.searchQuery    = '';
    this.activeFilter   = 'all';
    this.activeSort     = 'default';
    this.activeCategory = categorySlug ? categorySlug.toLowerCase() : 'all';

    const categories = getAllCategories(projects);
    const mountEl    = document.getElementById('category-projects-mount');
    const pillsBar   = document.getElementById('category-pills-bar');
    const searchEl   = document.getElementById('search-bar-mount');
    const filterEl   = document.getElementById('filter-bar-mount');
    const sortEl     = document.getElementById('sort-bar-mount');
    const countEl    = document.getElementById('active-category-count');
    const titleEl    = document.getElementById('active-page-title');
    const breadEl    = document.getElementById('active-category-breadcrumb');

    // Render Category Pills Bar
    const renderCategoryPills = () => {
      if (!pillsBar) return;
      const allCount = projects.length;
      let pillsHTML = `
        <button type="button"
                data-category="all"
                class="category-pill whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono border transition-all duration-200 cursor-pointer ${
                  this.activeCategory === 'all'
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20 font-bold'
                    : 'bg-bg-alt text-fg-muted border-theme-border hover:border-accent hover:text-fg'
                }">
          <i class="fa-solid fa-layer-group mr-1.5 text-[11px]"></i>
          <span>All (${allCount})</span>
        </button>
      `;

      categories.forEach(cat => {
        const isSelected = this.activeCategory === cat.slug.toLowerCase() || 
                           this.activeCategory === cat.name.toLowerCase();
        pillsHTML += `
          <button type="button"
                  data-category="${cat.slug}"
                  class="category-pill whitespace-nowrap px-4 py-2 rounded-xl text-xs font-mono border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-accent text-white border-accent shadow-md shadow-accent/20 font-bold'
                      : 'bg-bg-alt text-fg-muted border-theme-border hover:border-accent hover:text-fg'
                  }">
            <span>${cat.name}</span>
            <span class="ml-1.5 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] opacity-80">${cat.count}</span>
          </button>
        `;
      });

      pillsBar.innerHTML = pillsHTML;

      pillsBar.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this.activeCategory = btn.dataset.category;
          renderCategoryPills();
          renderGrid();
        });
      });
    };

    renderCategoryPills();

    // Main Grid Filtering and Rendering Engine
    const renderGrid = () => {
      if (!mountEl) return;

      let list = [...projects];

      // 1. Filter by category pill if not 'all'
      if (this.activeCategory && this.activeCategory !== 'all') {
        const targetCategory = categories.find(c => 
          c.slug.toLowerCase() === this.activeCategory.toLowerCase() ||
          c.name.toLowerCase() === this.activeCategory.toLowerCase()
        );
        const catName = targetCategory ? targetCategory.name : slugFromSlug(this.activeCategory);

        list = list.filter(p => {
          const pCat = (p.category || 'Others').toLowerCase();
          return pCat === catName.toLowerCase() || pCat.includes(catName.toLowerCase());
        });

        if (titleEl) titleEl.textContent = `${catName} Projects`;
        if (breadEl) breadEl.textContent = catName;
      } else {
        if (titleEl) titleEl.textContent = 'All Projects & Repositories';
        if (breadEl) breadEl.textContent = 'All Projects';
      }

      // 2. Search query filter
      list = searchProjects(list, this.searchQuery);

      // 3. Type filter chips (solo, group, recent, popular)
      list = filterProjects(list, this.activeFilter);

      // 4. Sort
      list = sortProjects(list, this.activeSort);

      // Update count badge
      if (countEl) {
        countEl.textContent = `${list.length} Project${list.length !== 1 ? 's' : ''} Shown`;
      }

      // Render cards
      mountEl.innerHTML = this.projectGrid.render(list, localMeta);
      this.projectGrid.setup(mountEl);
    };

    // Mount Search Bar
    if (searchEl) {
      searchEl.innerHTML = this.searchBar.render();
      this.searchBar.setup(searchEl, val => {
        this.searchQuery = val;
        renderGrid();
      });
    }

    // Mount Type Filter Bar
    const renderFilter = () => {
      if (!filterEl) return;
      filterEl.innerHTML = this.filterBar.render(this.activeFilter);
      this.filterBar.setup(filterEl, val => {
        this.activeFilter = val;
        renderFilter();
        renderGrid();
      });
    };
    renderFilter();

    // Mount Sort Bar
    const renderSort = () => {
      if (!sortEl) return;
      sortEl.innerHTML = this.sortBar.render(this.activeSort);
      this.sortBar.setup(sortEl, val => {
        this.activeSort = val;
        renderSort();
        renderGrid();
      });
    };
    renderSort();

    // Initial grid render
    setTimeout(renderGrid, 40);

    // Auto-sync listener: re-render dynamically when GitHub sync updates repository list
    const updateProjectsListener = (e) => {
      const updatedRepos = e.detail?.repos || window.portfolioData?.repos || [];
      if (Array.isArray(updatedRepos) && updatedRepos.length > 0) {
        projects = updatedRepos;
        renderCategoryPills();
        renderGrid();
      }
    };

    window.removeEventListener('portfolioDataUpdated', this._allProjectsUpdateHandler);
    this._allProjectsUpdateHandler = updateProjectsListener;
    window.addEventListener('portfolioDataUpdated', updateProjectsListener);
  }
}

/** Helper: convert slug back to readable category display name. */
function slugFromSlug(slug) {
  if (!slug) return 'Projects';
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
