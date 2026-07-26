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

    this.searchQuery  = '';
    this.activeFilter = 'all';
    this.activeSort   = 'default';
  }

  /** Render the HTML shell for the projects page. */
  render(categorySlug = null) {
    if (!categorySlug) {
      return `
      <section id="projects" class="py-24 px-6 max-w-7xl mx-auto w-full min-h-[70vh]">
        <!-- Section header -->
        <div class="text-center space-y-4 mb-16">
          <span class="font-mono text-xs text-primary uppercase tracking-widest">Portfolio</span>
          <h2 class="text-4xl sm:text-5xl font-jakarta font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" style="background-size:200%;animation:gradientMove 6s ease infinite">
            Project Categories
          </h2>
          <div class="flex items-center justify-center gap-1.5 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-16 h-px bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay:.5s"></span>
          </div>
          <p class="font-inter text-sm text-gray-500 max-w-xl mx-auto">
            All repositories are automatically fetched from GitHub and intelligently categorized.
            Create a new repo — it appears here instantly.
          </p>
        </div>

        <!-- Live sync badge -->
        <div class="flex justify-center mb-10">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono"
                style="background:rgba(20,184,166,0.06);border-color:rgba(20,184,166,0.2);color:#2dd4bf">
            <span class="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block"></span>
            Auto-synced from GitHub · Updates every 20 min
          </span>
        </div>

        <!-- Dynamic categories grid -->
        <div id="projects-categories-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Populated by setup() -->
        </div>
      </section>`;
    }

    // Category-specific workspace
    return `
    <section id="projects" class="py-20 px-6 max-w-7xl mx-auto w-full min-h-[80vh]">
      <!-- Breadcrumb + heading -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 justify-between">
        <div class="flex items-center gap-3 flex-wrap">
          <a href="/projects"
             class="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold text-gray-300 hover:text-white hover:border-primary/50 transition-all select-none"
             style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08)">
            <i class="fa-solid fa-arrow-left text-[10px]"></i>Categories
          </a>
          <div>
            <h2 id="active-category-title" class="text-2xl sm:text-3xl font-jakarta font-extrabold text-gray-100">
              Category
            </h2>
            <p class="text-xs font-mono text-gray-600 mt-0.5">Auto-fetched from GitHub</p>
          </div>
        </div>
        <span id="active-category-count"
              class="px-3 py-1.5 rounded-xl border text-xs font-mono"
              style="background:rgba(20,184,166,0.06);border-color:rgba(20,184,166,0.2);color:#2dd4bf">
          0 Projects
        </span>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-10 pb-6 border-b" style="border-color:rgba(255,255,255,0.05)">
        <div id="search-bar-mount"></div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div id="filter-bar-mount" class="flex-1 overflow-x-auto pb-0.5"></div>
          <div id="sort-bar-mount" class="shrink-0"></div>
        </div>
      </div>

      <!-- Project grid mount -->
      <div id="category-projects-mount">
        ${this.skeleton.render(6)}
      </div>
    </section>`;
  }

  setup(projects, localMeta, categorySlug = null) {
    if (!categorySlug) {
      // Render category landing cards
      const grid = document.getElementById('projects-categories-grid');
      if (grid) {
        const categories = getAllCategories(projects);
        grid.innerHTML = categories.map(cat => this.categoryCard.render(cat)).join('');
      }
      if (window.initializeObservers) window.initializeObservers();
      return;
    }

    // Reset state
    this.searchQuery  = '';
    this.activeFilter = 'all';
    this.activeSort   = 'default';

    // Resolve category name from slug
    const categories = getAllCategories(projects);
    const category   = categories.find(c => c.slug === categorySlug);
    const catName    = category ? category.name : slugFromSlug(categorySlug);

    const titleEl = document.getElementById('active-category-title');
    const countEl = document.getElementById('active-category-count');
    if (titleEl) titleEl.textContent = catName;

    const catProjects = projects.filter(p =>
      (p.category || 'Others').toLowerCase() === catName.toLowerCase()
    );
    if (countEl) countEl.textContent = `${catProjects.length} Project${catProjects.length !== 1 ? 's' : ''}`;

    const mountEl  = document.getElementById('category-projects-mount');
    const searchEl = document.getElementById('search-bar-mount');
    const filterEl = document.getElementById('filter-bar-mount');
    const sortEl   = document.getElementById('sort-bar-mount');

    const renderGrid = () => {
      if (!mountEl) return;
      let filtered = searchProjects(catProjects, this.searchQuery);
      filtered     = filterProjects(filtered, this.activeFilter);
      filtered     = sortProjects(filtered, this.activeSort);
      mountEl.innerHTML = this.projectGrid.render(filtered, localMeta);
      this.projectGrid.setup(mountEl);
    };

    // Search
    if (searchEl) {
      searchEl.innerHTML = this.searchBar.render();
      this.searchBar.setup(searchEl, val => { this.searchQuery = val; renderGrid(); });
    }

    // Filter chips (re-render on change)
    const renderFilter = () => {
      if (!filterEl) return;
      filterEl.innerHTML = this.filterBar.render(this.activeFilter);
      this.filterBar.setup(filterEl, val => { this.activeFilter = val; renderFilter(); renderGrid(); });
    };
    renderFilter();

    // Sort dropdown (re-render on change)
    const renderSort = () => {
      if (!sortEl) return;
      sortEl.innerHTML = this.sortBar.render(this.activeSort);
      this.sortBar.setup(sortEl, val => { this.activeSort = val; renderSort(); renderGrid(); });
    };
    renderSort();

    // Initial grid render after toolbar mounts
    setTimeout(renderGrid, 50);
  }
}

/** Fallback: convert slug back to category display name. */
function slugFromSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
