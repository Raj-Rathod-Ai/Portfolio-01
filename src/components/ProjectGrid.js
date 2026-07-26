import { ProjectCard } from './ProjectCard.js';

const projectCard = new ProjectCard();

/**
 * Render the project grid with staggered flip cards and empty state.
 */
export class ProjectGrid {
  render(projects = [], localMeta = []) {
    if (!projects.length) {
      return `
      <div class="no-results-state">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="15" width="100" height="50" rx="8" stroke="#4b5563" stroke-width="2"/>
          <circle cx="60" cy="40" r="12" stroke="#4b5563" stroke-width="2"/>
          <line x1="50" y1="50" x2="70" y2="30" stroke="#4b5563" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h4>No projects found</h4>
        <p>Try adjusting your search or filter.</p>
      </div>`;
    }

    const cardsHTML = projects
      .map((repo, i) => projectCard.render(repo, i, localMeta))
      .join('');

    return `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="project-cards-grid">
      ${cardsHTML}
    </div>`;
  }

  setup(container) {
    // Touch flip toggle
    projectCard.setup(container);
    // Scroll reveal
    if (window.initializeObservers) window.initializeObservers();
  }
}
