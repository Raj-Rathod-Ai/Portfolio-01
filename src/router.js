import { Home } from './pages/Home.js';
import { Projects } from './pages/Projects.js';
import { ProjectDetails } from './pages/ProjectDetails.js';
import { slugify } from './utils/helpers.js';
import { getAllCategories } from './utils/categorize.js';

// Instantiate pages (singleton)
const homePage = new Home();
const projectsPage = new Projects();
const detailsPage = new ProjectDetails();

/**
 * Check whether a slug belongs to a category or a project detail page.
 * Uses live data to detect any dynamically added categories.
 * @param {string} slug - URL slug to test.
 * @returns {'category'|'project'} Route type.
 */
function resolveProjectsSubroute(slug) {
  const repos = window.portfolioData?.repos || [];
  const categories = getAllCategories(repos);
  const isCategorySlug = categories.some(c => c.slug === slug);
  return isCategorySlug ? 'category' : 'project';
}

/**
 * Match a URL pathname to a route.
 * @param {string} path - URL path.
 * @returns {object} Router match details.
 */
export function matchRoute(path) {
  let cleanPath = path.replace(/\/$/, '');
  if (cleanPath === '' || cleanPath === '/index.html') cleanPath = '/';

  if (cleanPath === '/') return { route: 'home', params: {} };
  if (cleanPath === '/projects') return { route: 'projects-index', params: {} };

  const projectsMatch = cleanPath.match(/^\/projects\/([a-zA-Z0-9_\-]+)$/);
  if (projectsMatch) {
    const slug = projectsMatch[1].toLowerCase();
    const type = resolveProjectsSubroute(slug);
    if (type === 'category') {
      return { route: 'projects-category', params: { categorySlug: slug } };
    } else {
      return { route: 'project-details', params: { projectSlug: slug } };
    }
  }

  return { route: 'home', params: {} };
}

/**
 * Swap page content in the #page-content container with a GSAP transition.
 * Always calls initializeObservers() after every swap to re-register scroll-reveals.
 *
 * @param {string} path - Path to navigate to.
 * @param {boolean} [pushState=true] - Whether to push state to window.history.
 */
export async function navigate(path, pushState = true) {
  const match = matchRoute(path);

  if (pushState) {
    window.history.pushState(null, '', path);
  }

  const container = document.getElementById('page-content');
  if (!container) return;

  const repos = window.portfolioData?.repos || [];
  const meta  = window.portfolioData?.meta  || [];

  let html = '';
  let setupFn = () => {};

  switch (match.route) {
    case 'home':
      html    = homePage.render();
      setupFn = () => homePage.setup(repos, meta);
      break;

    case 'projects-index':
      html    = projectsPage.render(null);
      setupFn = () => projectsPage.setup(repos, meta, null);
      break;

    case 'projects-category':
      html    = projectsPage.render(match.params.categorySlug);
      setupFn = () => projectsPage.setup(repos, meta, match.params.categorySlug);
      break;

    case 'project-details': {
      const slug = match.params.projectSlug;
      const repo = repos.find(r => slugify(r.name) === slug);
      html    = detailsPage.render(repo, meta);
      setupFn = () => detailsPage.setup(repo);
      break;
    }
  }

  // --- Page transition with GSAP ---
  const swapContent = () => {
    container.innerHTML = html;
    setupFn();
    window.scrollTo(0, 0);
    // Guarantee every page's scroll-reveal elements are observed
    if (window.initializeObservers) window.initializeObservers();
  };

  if (typeof gsap !== 'undefined') {
    await new Promise(resolve => {
      gsap.to(container, {
        opacity: 0,
        y: -10,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          swapContent();
          resolve();
        }
      });
    });
    gsap.to(container, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
  } else {
    swapContent();
  }
}

/**
 * Bootstrap the router: popstate listener + global link click interceptor.
 */
export function initRouter() {
  window.addEventListener('popstate', () => {
    navigate(window.location.pathname, false);
  });

  document.addEventListener('click', e => {
    const target = e.target.closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    if (
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !target.hasAttribute('download') &&
      target.getAttribute('target') !== '_blank'
    ) {
      e.preventDefault();
      navigate(href);
    }
  });

  // Render the current route on first load
  navigate(window.location.pathname, false);
}
