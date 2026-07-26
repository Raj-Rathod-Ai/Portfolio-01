import { slugify } from './helpers.js';

/**
 * Filter a list of projects by search query.
 * Matches project name, description, category, GitHub topics, language, and custom tags.
 *
 * @param {Array} projects - List of projects.
 * @param {string} query - The search query string.
 * @returns {Array} Filtered list of projects.
 */
export function searchProjects(projects, query) {
  if (!query || query.trim() === '') return projects;
  const terms = query.toLowerCase().trim().split(/\s+/);

  return projects.filter(project => {
    const name = (project.name || '').toLowerCase();
    const desc = (project.description || '').toLowerCase();
    const cat = (project.category || '').toLowerCase();
    const lang = (project.language || '').toLowerCase();
    const topics = (project.topics || []).map(t => t.toLowerCase());

    return terms.every(term => {
      return (
        name.includes(term) ||
        desc.includes(term) ||
        cat.includes(term) ||
        lang.includes(term) ||
        topics.some(t => t.includes(term))
      );
    });
  });
}

/**
 * Filter projects based on the active tab/filter selection.
 * Supported filters: 'all', 'featured', 'solo', 'group', 'recently-updated', 'popular'.
 *
 * @param {Array} projects - List of projects.
 * @param {string} filterType - The filter type slug.
 * @returns {Array} Filtered projects list.
 */
export function filterProjects(projects, filterType) {
  if (!filterType) return projects;
  const type = filterType.toLowerCase();

  switch (type) {
    case 'featured':
      return projects.filter(p => p.featured === true);
    
    case 'solo':
      return projects.filter(p => p.isGroup === false);
    
    case 'group':
      return projects.filter(p => p.isGroup === true);
    
    case 'recently-updated': {
      if (projects.length === 0) return [];
      // Find the most recent date in the dataset
      const dates = projects.map(p => new Date(p.updated_at).getTime()).filter(t => !isNaN(t));
      if (dates.length === 0) return projects;
      const maxTime = Math.max(...dates);
      // Keep projects updated within 180 days of the most recent project update
      const cutoff = 180 * 24 * 60 * 60 * 1000; 
      const filtered = projects.filter(p => {
        const time = new Date(p.updated_at).getTime();
        return !isNaN(time) && (maxTime - time) <= cutoff;
      });
      // Fallback: if nothing matches within the 180 day cutoff, return top 3 newest projects
      if (filtered.length === 0) {
        return [...projects]
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 3);
      }
      return filtered;
    }
    
    case 'popular': {
      // Projects with stars > 0
      const withStars = projects.filter(p => p.stargazers_count > 0);
      if (withStars.length > 0) return withStars;
      // Fallback: return top 3 projects sorted by size/stars if none have stars
      return [...projects]
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 3);
    }
    
    case 'all':
    default:
      return projects;
  }
}
