/**
 * LoadingSkeleton component rendering pulsing project card skeletons during load states.
 */
export class LoadingSkeleton {
  /**
   * Render HTML for the loading skeleton.
   * @param {number} count - Number of skeleton cards to render.
   * @returns {string} LoadingSkeleton HTML string.
   */
  render(count = 3) {
    let skeletons = '';
    for (let i = 0; i < count; i++) {
      skeletons += `
        <div class="rounded-xl border border-white/8 p-5 bg-white/3 animate-pulse space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-white/10 rounded w-2/3"></div>
              <div class="h-2 bg-white/10 rounded w-1/3"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-white/10 rounded w-full"></div>
            <div class="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <div class="h-4 bg-white/10 rounded w-12"></div>
            <div class="h-4 bg-white/10 rounded w-16"></div>
          </div>
          <div class="flex items-center gap-3 pt-3 border-t border-white/5">
            <div class="h-3 bg-white/10 rounded w-12"></div>
            <div class="h-3 bg-white/10 rounded w-16 ml-auto"></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="project-grid-section mb-12">
        <div class="h-4 bg-white/10 rounded w-36 mb-6 animate-pulse"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          ${skeletons}
        </div>
      </div>
    `;
  }
}
