/**
 * Visitor Analytics & Silent Tracking Utility
 * Manages visitor identification, visit counters, page view history in localStorage,
 * and syncs with backend database endpoints silently without showing UI counters.
 */

const STORAGE_KEYS = {
  VISITOR_ID: 'raj_portfolio_visitor_id',
  VISIT_COUNT: 'raj_portfolio_visit_count',
  LAST_VISIT: 'raj_portfolio_last_visit',
  PAGE_VIEWS: 'raj_portfolio_page_views'
};

/**
 * Get or generate unique visitor ID for device recognition.
 * @returns {string} Unique visitor ID string.
 */
export function getVisitorId() {
  let id = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!id) {
    id = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, id);
  }
  return id;
}

/**
 * Get current visitor statistics from local storage.
 * @returns {object} Visitor stats object.
 */
export function getVisitorStats() {
  const visitorId = getVisitorId();
  const count = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0', 10);
  const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT) || null;
  let pageViews = [];
  try {
    pageViews = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || '[]');
  } catch (e) {
    pageViews = [];
  }
  return { visitorId, count, lastVisit, pageViews };
}

/**
 * Silently track page/section visit.
 * Increments total visit count on new sessions and appends page path to local history & backend log.
 * @param {string} path - URL path viewed.
 */
export function trackVisit(path) {
  try {
    const visitorId = getVisitorId();
    const now = new Date().toISOString();

    // Session detection (if last visit was > 30 minutes ago, treat as new visit count increment)
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
    let count = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0', 10);
    
    if (!lastVisit || (Date.now() - new Date(lastVisit).getTime() > 30 * 60 * 1000)) {
      count += 1;
      localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, count.toString());
    }

    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, now);

    // Record page view entry (capped at 50 most recent records)
    let pageViews = [];
    try {
      pageViews = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || '[]');
    } catch (e) {
      pageViews = [];
    }

    pageViews.unshift({ path: path || '/', timestamp: now });
    if (pageViews.length > 50) pageViews = pageViews.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(pageViews));

    // Async silent backend notification
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        path: path || '/',
        visitCount: count,
        timestamp: now,
        userAgent: navigator.userAgent
      })
    }).catch(err => {
      // Silent error handler for offline/fallback mode
    });
  } catch (err) {
    console.warn('Analytics tracking warning:', err.message);
  }
}
