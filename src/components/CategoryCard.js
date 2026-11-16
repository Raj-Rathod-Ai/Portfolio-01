/**
 * Premium CategoryCard component with animated gradient border and glassmorphism.
 */
export class CategoryCard {
  /**
   * Render a category card as a native anchor (handled by global router).
   * @param {object} category - { name, slug, icon, gradient, description, glowColor, badgeClass, count }
   * @returns {string} HTML string.
   */
  render(category) {
    const word = category.count === 1 ? 'Project' : 'Projects';

    return `
    <a href="/projects/${category.slug}"
       class="cat-card-premium scroll-reveal reveal-zoom-fade block"
       style="min-height:200px">
      <div class="cat-card-body flex flex-col justify-between gap-5 transition-all duration-350">

        <!-- Top row: icon + count badge -->
        <div class="flex items-start justify-between gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg flex-shrink-0"
               style="box-shadow:0 8px 24px -4px ${category.glowColor || 'rgba(99,102,241,0.3)'}">
            <i class="fa-solid ${category.icon} text-white text-xl"></i>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono border"
                style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#6b7280">
            <i class="fa-solid fa-layer-group text-[8px]"></i>
            ${category.count} ${word}
          </span>
        </div>

        <!-- Name + description -->
        <div class="space-y-1.5">
          <h4 class="font-jakarta font-bold text-lg text-gray-100 leading-tight group-hover:text-primary transition-colors">${category.name}</h4>
          <p class="font-inter text-xs text-gray-500 leading-relaxed">${category.description}</p>
        </div>

        <!-- Footer: explore link -->
        <div class="flex items-center justify-between pt-3 border-t" style="border-color:rgba(255,255,255,0.05)">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border ${category.badgeClass || 'cat-badge-others'}">${category.name}</span>
          <span class="text-[10px] font-mono text-gray-600 flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors">
            Explore <i class="fa-solid fa-arrow-right-long text-[9px]"></i>
          </span>
        </div>
      </div>
    </a>`;
  }

  /** No local listeners needed — navigation handled by global router. */
  setup(container) {}
}
