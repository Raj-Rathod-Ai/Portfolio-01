const FILTERS = [
  { id: 'all',      label: 'All',              icon: 'fa-layer-group'  },
  { id: 'featured', label: 'Featured',         icon: 'fa-star'         },
  { id: 'solo',     label: 'Solo',             icon: 'fa-user'         },
  { id: 'group',    label: 'Group',            icon: 'fa-users'        },
  { id: 'recent',   label: 'Recent',           icon: 'fa-clock-rotate-left' },
  { id: 'popular',  label: 'Popular',          icon: 'fa-fire'         },
];

/**
 * Animated filter chip bar.
 */
export class FilterBar {
  render(activeFilter = 'all') {
    const chips = FILTERS.map(f => `
      <button class="filter-chip ${f.id === activeFilter ? 'active' : ''}"
              data-filter="${f.id}"
              type="button">
        <i class="fa-solid ${f.icon} text-[9px]"></i>${f.label}
      </button>`).join('');

    return `<div class="flex items-center gap-2 flex-wrap">${chips}</div>`;
  }

  setup(container, onChange) {
    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        onChange(btn.dataset.filter);
      });
    });
  }
}
