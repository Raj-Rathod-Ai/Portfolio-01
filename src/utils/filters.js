/**
 * Search projects by name, description, topics, category, and language.
 * @param {Array}  projects
 * @param {string} query
 * @returns {Array}
 */
export function searchProjects(projects, query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return projects;
  return projects.filter(p => {
    const haystack = [
      p.name,
      p.description,
      p.category,
      p.language,
      ...(p.topics || [])
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * Filter projects by type chip.
 * Supports: all | featured | solo | group | recent | popular
 * @param {Array}  projects
 * @param {string} filter
 * @returns {Array}
 */
export function filterProjects(projects, filter = 'all') {
  switch (filter) {
    case 'featured':
      return projects.filter(p => p.featured);
    case 'solo':
      return projects.filter(p => !p.isGroup);
    case 'group':
      return projects.filter(p => !!p.isGroup);
    case 'recent': {
      const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days
      return projects.filter(p => new Date(p.updated_at || p.pushed_at).getTime() > cutoff);
    }
    case 'popular':
      return projects.filter(p => (p.stargazers_count || 0) > 0);
    default:
      return projects;
  }
}
