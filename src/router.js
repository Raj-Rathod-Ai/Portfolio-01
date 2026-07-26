import { Home } from './pages/Home.js';
import { Projects } from './pages/Projects.js';
import { ProjectDetails } from './pages/ProjectDetails.js';
import { slugify } from './utils/helpers.js';

// Instantiate pages
const homePage = new Home();
const projectsPage = new Projects();
const detailsPage = new ProjectDetails();

const CATEGORY_SLUGS = [
  'machine-learning',
  'deep-learning',
  'rag',
  'generative-ai',
  'nlp',
  'computer-vision',
  'data-science',
  'ai-agents',
  'mlops',
  'web-development',
  'others'
];

/**
 * Match a URL pathname to a route.
 * @param {string} path - URL path.
 * @returns {object} Router match details containing page route name and route parameters.
 */
export function matchRoute(path) {
  let cleanPath = path.replace(/\/$/, ''); // Trim trailing slash
  if (cleanPath === '' || cleanPath === '/index.html') {
    cleanPath = '/';
  }

  if (cleanPath === '/') {
    return { route: 'home', params: {} };
  }

  if (cleanPath === '/projects') {
    return { route: 'projects-index', params: {} };
  }

  // Pattern /projects/:slug
  const projectsMatch = cleanPath.match(/^\/projects\/([a-zA-Z0-9_\-]+)$/);
  if (projectsMatch) {
    const slug = projectsMatch[1].toLowerCase();
    if (CATEGORY_SLUGS.includes(slug)) {
      return { route: 'projects-category', params: { categorySlug: slug } };
    } else {
      return { route: 'project-details', params: { projectSlug: slug } };
    }
  }

  // Fallback to home page
  return { route: 'home', params: {} };
}

/**
 * Global navigation driver.
 * Updates history state and performs dynamic DOM swapping with GSAP fade transitions.
 *
 * @param {string} path - Path to navigate to.
 * @param {boolean} [pushState=true] - Whether to push state to window.history.
 * @returns {Promise<void>}
 */
export async function navigate(path, pushState = true) {
  const match = matchRoute(path);
  
  if (pushState) {
    window.history.pushState(null, '', path);
  }

  const container = document.getElementById('page-content');
  if (!container) return;

  // Retrieve global repository data
  const repos = window.portfolioData?.repos || [];
  const meta = window.portfolioData?.meta || [];

  let html = '';
  let pageInstance = null;
  let setupFn = () => {};

  switch (match.route) {
    case 'home':
      html = homePage.render();
      pageInstance = homePage;
      setupFn = () => homePage.setup(repos, meta);
      break;

    case 'projects-index':
      html = projectsPage.render(null);
      pageInstance = projectsPage;
      setupFn = () => projectsPage.setup(repos, meta, null);
      break;

    case 'projects-category':
      html = projectsPage.render(match.params.categorySlug);
      pageInstance = projectsPage;
      setupFn = () => projectsPage.setup(repos, meta, match.params.categorySlug);
      break;

    case 'project-details': {
      // Find the repository matching the slugified name
      const targetSlug = match.params.projectSlug;
      const repo = repos.find(r => slugify(r.name) === targetSlug);
      
      html = detailsPage.render(repo, meta);
      pageInstance = detailsPage;
      setupFn = () => detailsPage.setup(repo);
      break;
    }
  }

  // Page Transitions (GSAP animation swap)
  if (typeof gsap !== 'undefined') {
    await new Promise((resolve) => {
      gsap.to(container, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          container.innerHTML = html;
          setupFn();
          window.scrollTo(0, 0);
          resolve();
        }
      });
    });

    gsap.to(container, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  } else {
    container.innerHTML = html;
    setupFn();
    window.scrollTo(0, 0);
  }
}

/**
 * Initialize global router event listeners (popstate & click intercepts).
 */
export function initRouter() {
  // Listen for back/forward browser navigation actions
  window.addEventListener('popstate', () => {
    navigate(window.location.pathname, false);
  });

  // Intercept all anchor link clicks for local SPA routes
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    // Check if the link is a relative SPA route (starts with '/' and not external/hash)
    if (href.startsWith('/') && !href.startsWith('//') && !target.hasAttribute('download') && target.getAttribute('target') !== '_blank') {
      e.preventDefault();
      navigate(href);
    }
  });

  // Load active route immediately
  navigate(window.location.pathname, false);
}
