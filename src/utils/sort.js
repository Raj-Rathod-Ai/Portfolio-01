/**
 * Sorting utility for projects.
 * Supports: Newest, Oldest, Recently Updated, Stars, A-Z, Z-A.
 *
 * @param {Array} projects - List of projects.
 * @param {string} sortBy - Sort option slug (e.g. 'newest', 'stars').
 * @returns {Array} Sorted copy of the projects array.
 */
export function sortProjects(projects, sortBy) {
  if (!projects || projects.length === 0) return [];
  const sorted = [...projects];
  const option = sortBy ? sortBy.toLowerCase() : 'newest';

  switch (option) {
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB - dateA;
      });

    case 'oldest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateA - dateB;
      });

    case 'recently-updated':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updated_at || 0);
        const dateB = new Date(b.updated_at || 0);
        return dateB - dateA;
      });

    case 'stars':
      return sorted.sort((a, b) => {
        const starsA = a.stargazers_count || 0;
        const starsB = b.stargazers_count || 0;
        if (starsB !== starsA) {
          return starsB - starsA;
        }
        // Fallback to alphabetical if stars are equal
        return a.name.localeCompare(b.name);
      });

    case 'a-z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'z-a':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sorted;
  }
}
