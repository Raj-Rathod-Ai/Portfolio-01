/**
 * SortBar component rendering a premium dropdown selection for sorting projects.
 */
export class SortBar {
  /**
   * Render the HTML string for the sorting select menu.
   * @param {string} activeSort - The currently active sort option.
   * @returns {string} SortBar HTML markup.
   */
  render(activeSort = 'newest') {
    const options = [
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
      { value: 'recently-updated', label: 'Recently Updated' },
      { value: 'stars', label: 'GitHub Stars' },
      { value: 'a-z', label: 'Name (A-Z)' },
      { value: 'z-a', label: 'Name (Z-A)' }
    ];

    return `
      <div class="relative w-full sm:w-44 flex-shrink-0">
        <select id="project-sort" 
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-8 text-xs text-gray-300 focus:outline-none focus:border-primary appearance-none cursor-pointer spotlight-card"
                style="background: rgba(22, 27, 34, 0.5); -webkit-appearance: none;">
          ${options.map(opt => {
            const isSelected = opt.value === activeSort ? 'selected' : '';
            return `<option value="${opt.value}" class="bg-[#0d1117] text-gray-300" ${isSelected}>Sort: ${opt.label}</option>`;
          }).join('')}
        </select>
        <i class="fa-solid fa-chevron-down absolute right-3.5 top-3.5 text-gray-500 pointer-events-none text-[10px]"></i>
      </div>
    `;
  }

  /**
   * Setup change listeners on the dropdown.
   * @param {HTMLElement} container - The parent wrapper.
   * @param {function} onSort - Callback that receives the selected sort value.
   */
  setup(container, onSort) {
    if (!container) return;

    const select = container.querySelector('#project-sort');
    if (!select) return;

    select.addEventListener('change', (e) => {
      onSort(e.target.value);
    });
  }
}
