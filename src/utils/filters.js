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
      const cutoff = Date.now() - 120 * 24 * 60 * 60 * 1000; // 120 days
      const recent = projects.filter(p => !p.isUpcoming && new Date(p.created_at || p.pushed_at || p.updated_at || 0).getTime() > cutoff);
      if (recent.length >= 2) {
        return recent.sort((a, b) => new Date(b.created_at || b.pushed_at || b.updated_at || 0) - new Date(a.created_at || a.pushed_at || a.updated_at || 0));
      }
      return [...projects].filter(p => !p.isUpcoming).sort((a, b) => new Date(b.created_at || b.pushed_at || 0) - new Date(a.created_at || a.pushed_at || 0)).slice(0, 8);
    }
    case 'popular':
      return projects.filter(p => (p.stargazers_count || 0) > 0);
    default:
      return projects;
  }
}
