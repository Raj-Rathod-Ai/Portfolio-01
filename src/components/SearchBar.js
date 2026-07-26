let debounceTimer = null;

const PLACEHOLDERS = [
  'Search by name…',
  'Search by technology…',
  'Search by category…',
  'Search by framework…',
];

/**
 * Premium search bar with icon, clear button, and debounced input.
 */
export class SearchBar {
  render() {
    return `
    <div class="premium-search-wrap w-full xl:w-72">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        id="projects-search-input"
        class="premium-search-input"
        type="text"
        placeholder="${PLACEHOLDERS[0]}"
        autocomplete="off"
        spellcheck="false"
      />
      <button class="search-clear-btn" id="search-clear-btn" aria-label="Clear search">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
  }

  setup(container, onChange) {
    const input   = container.querySelector('#projects-search-input');
    const clearBtn = container.querySelector('#search-clear-btn');
    if (!input || !clearBtn) return;

    // Rotate placeholder
    let pIdx = 0;
    const rotatePlaceholder = setInterval(() => {
      pIdx = (pIdx + 1) % PLACEHOLDERS.length;
      if (document.activeElement !== input) {
        input.placeholder = PLACEHOLDERS[pIdx];
      }
    }, 3000);

    // Clear button
    const updateClear = () => {
      clearBtn.classList.toggle('visible', input.value.length > 0);
    };

    clearBtn.addEventListener('click', () => {
      input.value = '';
      updateClear();
      onChange('');
      input.focus();
    });

    // Debounced change
    input.addEventListener('input', () => {
      updateClear();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => onChange(input.value.trim()), 280);
    });

    // Cleanup on SPA nav
    window._searchCleanup = () => clearInterval(rotatePlaceholder);
  }
}
