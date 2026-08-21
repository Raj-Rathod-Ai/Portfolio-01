/**
 * Sort projects by chosen criteria.
 * Order hierarchy:
 * 1. Featured projects (pinned by Master Boss) - sorted by criteria
 * 2. Real active GitHub projects (new to old) - sorted by criteria
 * 3. Upcoming projects (Coming Soon placeholders) - positioned at bottom
 *
 * Supports: default | newest | oldest | updated | stars | az | za
 * @param {Array}  projects
 * @param {string} sortKey
 * @returns {Array}
 */
export function sortProjects(projects, sortKey = 'default') {
  const arr = [...projects];

  // Separate real vs upcoming projects
  const upcoming = arr.filter(p => p.isUpcoming === true);
  const realProjects = arr.filter(p => !p.isUpcoming);

  const featured = realProjects.filter(p => p.featured === true);
  const nonFeatured = realProjects.filter(p => !p.featured);

  const sortGroup = (group) => {
    switch (sortKey) {
      case 'newest':
        return group.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      case 'oldest':
        return group.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

      case 'updated':
        return group.sort((a, b) =>
          new Date(b.updated_at || b.pushed_at || b.created_at || 0) - new Date(a.updated_at || a.pushed_at || a.created_at || 0));

      case 'stars':
        return group.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));

      case 'az':
        return group.sort((a, b) => (a.displayTitle || a.name || '').localeCompare(b.displayTitle || b.name || ''));

      case 'za':
        return group.sort((a, b) => (b.displayTitle || b.name || '').localeCompare(a.displayTitle || a.name || ''));

      case 'default':
      default:
        return group.sort((a, b) =>
          new Date(b.updated_at || b.pushed_at || b.created_at || 0) - new Date(a.updated_at || a.pushed_at || a.created_at || 0));
    }
  };

  return [...sortGroup(featured), ...sortGroup(nonFeatured), ...upcoming];
}
