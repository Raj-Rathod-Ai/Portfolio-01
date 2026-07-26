/**
 * CategoryCard component rendering individual category tiles.
 */
export class CategoryCard {
  /**
   * Render the category card markup.
   * @param {object} category - Category data containing name, count, slug, icon, description, gradient.
   * @returns {string} CategoryCard HTML markup.
   */
  render(category) {
    const projectWord = category.count === 1 ? 'Project' : 'Projects';
    return `
      <a href="/projects/${category.slug}" 
         class="spotlight-card rounded-2xl border border-white/8 p-6 flex flex-col justify-between group hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer h-full select-none block" 
         style="background: rgba(22, 27, 34, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
        
        <div class="space-y-4 pointer-events-none">
          <!-- Icon wrapper -->
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <i class="fa-solid ${category.icon} text-white text-lg"></i>
          </div>
          
          <div class="space-y-1">
            <h4 class="font-jakarta font-bold text-lg text-gray-100 group-hover:text-primary transition-colors">${category.name}</h4>
            <p class="font-inter text-xs text-gray-400 leading-relaxed min-h-[40px]">${category.description}</p>
          </div>
        </div>

        <div class="flex items-center justify-between mt-6 border-t border-white/5 pt-4 pointer-events-none">
          <span class="font-mono text-xs text-teal font-semibold bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-md">${category.count} ${projectWord}</span>
          <span class="font-mono text-[10px] text-gray-500 flex items-center gap-1 group-hover:text-primary transition-colors">
            Explore <i class="fa-solid fa-arrow-right-long text-xs group-hover:translate-x-1 transition-transform"></i>
          </span>
        </div>
      </a>
    `;
  }

  /**
   * No local event binding required. Clean native navigation intercepted globally.
   */
  setup(container) {
    // Left intentionally empty as navigation is handled via global link interceptors.
  }
}
