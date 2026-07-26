/**
 * Sort projects by chosen criteria.
 * Supports: default | newest | oldest | updated | stars | az | za
 * @param {Array}  projects
 * @param {string} sortKey
 * @returns {Array}
 */
export function sortProjects(projects, sortKey = 'default') {
  const arr = [...projects]; // avoid mutating original

  switch (sortKey) {
    case 'newest':
      return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    case 'oldest':
      return arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    case 'updated':
      return arr.sort((a, b) =>
        new Date(b.updated_at || b.pushed_at) - new Date(a.updated_at || a.pushed_at));

    case 'stars':
      return arr.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));

    case 'az':
      return arr.sort((a, b) => a.name.localeCompare(b.name));

    case 'za':
      return arr.sort((a, b) => b.name.localeCompare(a.name));

    case 'default':
    default:
      // Featured first, then recently updated
      return arr.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.updated_at || b.pushed_at) - new Date(a.updated_at || a.pushed_at);
      });
  }
}
