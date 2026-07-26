import { ProjectCard } from './ProjectCard.js';

/**
 * ProjectGrid component to render separated categories (Featured, Solo, Group) for a set of projects.
 */
export class ProjectGrid {
  constructor() {
    this.projectCard = new ProjectCard();
  }

  /**
   * Render HTML for the projects grids.
   * @param {Array} projects - List of projects (filtered and sorted).
   * @param {Array} localMetadata - Local metadata array from projects.json.
   * @returns {string} Dynamic grid HTML markup.
   */
  render(projects, localMetadata = []) {
    if (!projects || projects.length === 0) {
      return `
        <div class="text-center py-16 scroll-reveal reveal-zoom-fade">
          <i class="fa-solid fa-magnifying-glass text-4xl text-gray-700 mb-4 block"></i>
          <p class="font-jakarta text-sm text-gray-400 font-semibold">No projects match the criteria</p>
          <p class="font-inter text-xs text-gray-600 mt-1">Try resetting your search query or filters.</p>
        </div>
      `;
    }

    // Classify projects
    const featuredProjects = projects.filter(p => p.featured === true);
    // Remaining non-featured projects to avoid duplicating featured items in solo/group sections,
    // OR we show all projects in solo/group and featured at the top?
    // Wait, the user request says:
    // "When a category is opened: Featured Projects, Solo Projects, Group Projects. Everything should be generated dynamically."
    // Let's filter out featured projects from the Solo and Group sections if they are already in the Featured section,
    // or keep them separate so Featured acts as a high-visibility shelf.
    // Let's keep them separate to avoid duplicating cards on the same screen, which is standard for dashboard sections.
    // Let's check: "Solo Projects" should show all solo non-featured, and "Group Projects" all group non-featured.
    const featuredIds = new Set(featuredProjects.map(p => p.name.toLowerCase()));
    
    const soloProjects = projects.filter(p => !p.isGroup && !featuredIds.has(p.name.toLowerCase()));
    const groupProjects = projects.filter(p => p.isGroup && !featuredIds.has(p.name.toLowerCase()));

    let html = '';
    let cardIndex = 0;

    // 1. Featured Section
    if (featuredProjects.length > 0) {
      html += `
        <div class="mb-12 project-grid-section">
          <h3 class="font-jakarta font-bold text-sm text-amber-500 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <span class="w-5 h-0.5 bg-amber-500 inline-block"></span>⭐ Featured Projects
            <span class="font-mono text-xs text-gray-600 font-normal">(${featuredProjects.length})</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${featuredProjects.map(repo => {
              const cardMarkup = this.projectCard.render(repo, cardIndex++, localMetadata);
              return cardMarkup;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 2. Solo Section
    if (soloProjects.length > 0) {
      html += `
        <div class="mb-12 project-grid-section">
          <h3 class="font-jakarta font-bold text-sm text-teal-400 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <span class="w-5 h-0.5 bg-teal-400 inline-block"></span>👤 Solo Projects
            <span class="font-mono text-xs text-gray-600 font-normal">(${soloProjects.length})</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${soloProjects.map(repo => {
              const cardMarkup = this.projectCard.render(repo, cardIndex++, localMetadata);
              return cardMarkup;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 3. Group Section
    if (groupProjects.length > 0) {
      html += `
        <div class="mb-12 project-grid-section">
          <h3 class="font-jakarta font-bold text-sm text-violet-400 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <span class="w-5 h-0.5 bg-violet-400 inline-block"></span>👥 Group Projects
            <span class="font-mono text-xs text-gray-600 font-normal">(${groupProjects.length})</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${groupProjects.map(repo => {
              const cardMarkup = this.projectCard.render(repo, cardIndex++, localMetadata);
              return cardMarkup;
            }).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * Bind event listeners for card interactions.
   * @param {HTMLElement} container - Grid container DOM element.
   */
  setup(container) {
    this.projectCard.setup(container);
  }
}
