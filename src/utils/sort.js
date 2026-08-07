/**
 * Sort projects by chosen criteria.
 * Featured projects (pinned by Master Boss) are ALWAYS placed at the top!
 * Supports: default | newest | oldest | updated | stars | az | za
 * @param {Array}  projects
 * @param {string} sortKey
 * @returns {Array}
 */
export function sortProjects(projects, sortKey = 'default') {
  const arr = [...projects];

  // Featured projects are ALWAYS pinned at the top
  const featured = arr.filter(p => p.featured === true);
  const nonFeatured = arr.filter(p => !p.featured);

  const sortGroup = (group) => {
    switch (sortKey) {
      case 'newest':
        return group.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      case 'oldest':
        return group.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      case 'updated':
        return group.sort((a, b) =>
          new Date(b.updated_at || b.pushed_at) - new Date(a.updated_at || a.pushed_at));

      case 'stars':
        return group.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));

      case 'az':
        return group.sort((a, b) => a.name.localeCompare(b.name));

      case 'za':
        return group.sort((a, b) => b.name.localeCompare(a.name));

      case 'default':
      default:
        return group.sort((a, b) =>
          new Date(b.updated_at || b.pushed_at) - new Date(a.updated_at || a.pushed_at));
    }
  };

  return [...sortGroup(featured), ...sortGroup(nonFeatured)];
}
