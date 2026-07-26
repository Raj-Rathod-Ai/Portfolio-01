/**
 * SearchBar component rendering an input box with custom debounce events.
 */
export class SearchBar {
  /**
   * Render the HTML string for the search bar.
   * @returns {string} SearchBar HTML markup.
   */
  render() {
    return `
      <div class="relative w-full md:max-w-md">
        <input type="text" id="project-search" placeholder="Search by name, tech, topics..." 
               class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-500 spotlight-card"
               style="background: rgba(22, 27, 34, 0.5);">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-500 text-sm"></i>
        <button id="search-clear-btn" class="absolute right-3.5 top-3 text-gray-500 hover:text-white hidden transition-colors">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }

  /**
   * Setup search listeners, debouncing, and custom events.
   * @param {HTMLElement} container - Parent container.
   * @param {function} onSearch - Callback to fire on search query change.
   */
  setup(container, onSearch) {
    if (!container) return;

    const input = container.querySelector('#project-search');
    const clearBtn = container.querySelector('#search-clear-btn');
    if (!input) return;

    let timeout = null;

    const handleSearchChange = (val) => {
      // Toggle clear button
      if (clearBtn) {
        if (val) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }

      // Debounce callback
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        onSearch(val);
      }, 250); // 250ms debounce
    };

    input.addEventListener('input', (e) => {
      handleSearchChange(e.target.value);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        handleSearchChange('');
        input.focus();
      });
    }
  }
}
