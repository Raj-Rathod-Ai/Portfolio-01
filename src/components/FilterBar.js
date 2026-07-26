/**
 * FilterBar component for selecting project filters (All, Featured, Solo, Group, etc.).
 */
export class FilterBar {
  /**
   * Render the HTML string for the filter pills.
   * @param {string} activeFilter - Currently active filter slug.
   * @returns {string} FilterBar HTML.
   */
  render(activeFilter = 'all') {
    const filters = [
      { slug: 'all', label: 'All', icon: '' },
      { slug: 'featured', label: 'Featured', icon: '⭐ ' },
      { slug: 'solo', label: 'Solo Projects', icon: '👤 ' },
      { slug: 'group', label: 'Group Projects', icon: '👥 ' },
      { slug: 'recently-updated', label: 'Recently Updated', icon: '📅 ' },
      { slug: 'popular', label: 'Popular', icon: '🔥 ' }
    ];

    return `
      <div class="flex flex-wrap gap-2 items-center overflow-x-auto select-none no-scrollbar py-1">
        ${filters.map(f => {
          const isActive = f.slug === activeFilter;
          const activeClasses = isActive 
            ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-lg shadow-primary/10'
            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20';

          return `
            <button class="px-4 py-2 text-xs font-semibold rounded-xl border font-jakarta transition-all duration-300 filter-pill ${activeClasses}" 
                    data-filter="${f.slug}">
              ${f.icon}${f.label}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Setup click listeners on filter buttons.
   * @param {HTMLElement} container - The wrapper element.
   * @param {function} onFilter - Callback that receives the selected filter slug.
   */
  setup(container, onFilter) {
    if (!container) return;

    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterVal = btn.getAttribute('data-filter');
        onFilter(filterVal);
      });
    });
  }
}
