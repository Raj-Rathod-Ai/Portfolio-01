const SORT_OPTIONS = [
  { value: 'default',  label: 'Priority (Default)' },
  { value: 'newest',   label: 'Newest First'        },
  { value: 'oldest',   label: 'Oldest First'        },
  { value: 'updated',  label: 'Recently Updated'    },
  { value: 'stars',    label: 'GitHub Stars'        },
  { value: 'az',       label: 'Name A → Z'          },
  { value: 'za',       label: 'Name Z → A'          },
];

/**
 * Premium sort dropdown with glass styling.
 */
export class SortBar {
  render(activeSort = 'default') {
    const options = SORT_OPTIONS.map(o =>
      `<option value="${o.value}" ${o.value === activeSort ? 'selected' : ''}>${o.label}</option>`
    ).join('');

    return `
    <div class="sort-select-wrap">
      <i class="fa-solid fa-arrow-up-wide-short sort-icon"></i>
      <select class="premium-sort-select" id="projects-sort-select">${options}</select>
      <i class="fa-solid fa-chevron-down sort-chevron"></i>
    </div>`;
  }

  setup(container, onChange) {
    const select = container.querySelector('#projects-sort-select');
    if (!select) return;
    select.addEventListener('change', () => onChange(select.value));
  }
}
