/**
 * Visitor Analytics & Silent Tracking Utility
 * Manages visitor identification, visit counters, page view history in localStorage,
 * Boss/Master device recognition, name spoofing validation, and database sync.
 */

const STORAGE_KEYS = {
  VISITOR_ID: 'raj_portfolio_visitor_id',
  VISIT_COUNT: 'raj_portfolio_visit_count',
  LAST_VISIT: 'raj_portfolio_last_visit',
  PAGE_VIEWS: 'raj_portfolio_page_views',
  RUDRA_PROFILE: 'rudra_visitor_profile',
  BOSS_MASTER: 'boss_master_device'
};

/**
 * Check if the current device is registered as Boss/Master device.
 * @returns {boolean} True if this device is authorized as Boss.
 */
export function isBossDevice() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.BOSS_MASTER) === 'true') return true;
    const profile = getVisitorProfile();
    if (profile && profile.name) {
      const lower = profile.name.trim().toLowerCase();
      if (lower === 'boss' || lower === 'raj rathod' || lower === 'raj') {
        localStorage.setItem(STORAGE_KEYS.BOSS_MASTER, 'true');
        return true;
      }
    }
  } catch (e) {}
  return false;
}

/**
 * Register current device as Boss/Master device permanently.
 */
export function setBossDevice() {
  try {
    localStorage.setItem(STORAGE_KEYS.BOSS_MASTER, 'true');
  } catch (e) {}
}

/**
 * Validate input name to prevent imposter 3rd-party users from spoofing "Boss" or "Raj".
 * @param {string} name - Input name string.
 * @returns {object} { isValid: boolean, message: string|null }
 */
export function validateVisitorName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Please enter a valid name.' };
  }

  const clean = name.trim().toLowerCase();
  
  // If user enters 'Raj' alone without surname
  if (clean === 'raj') {
    return {
      isValid: false,
      isRajFirstOnly: true,
      message: 'Hi Raj! 👋 Please enter your full name / surname (e.g., Raj Rathod) to verify owner identity.'
    };
  }

  const bossTitles = ['boss', 'raj rathod', 'owner', 'admin', 'master', 'portfolio owner'];

  if (bossTitles.includes(clean)) {
    // Register current device as Boss Master device permanently
    setBossDevice();
    return { isValid: true, isBoss: true, message: null };
  }

  return { isValid: true, message: null };
}

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
 * Check if visitor profile already has a recognized name (from review or chatbot).
 * @returns {boolean} True if visitor name is known.
 */
export function hasVisitorName() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RUDRA_PROFILE);
    if (!raw) return false;
    const profile = JSON.parse(raw);
    return !!(profile && profile.name && profile.name.trim() && profile.name !== 'Guest Visitor');
  } catch (e) {
    return false;
  }
}

/**
 * Get current visitor profile from localStorage.
 * @returns {object|null} Visitor profile object.
 */
export function getVisitorProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RUDRA_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Save or update visitor name (e.g. from Review Form) into profile & DB.
 * @param {string} name - Visitor/Reviewer name.
 * @param {string} [source='review'] - Source of name identification.
 */
export function setVisitorName(name, source = 'review') {
  if (!name || typeof name !== 'string') return;
  const cleanName = name.trim();
  if (!cleanName) return;

  // Auto tag Boss device if user enters Boss
  if (cleanName.toLowerCase() === 'boss' || cleanName.toLowerCase() === 'raj rathod') {
    setBossDevice();
  }

  let profile = getVisitorProfile() || {};
  profile.name = cleanName;
  profile.source = source;
  if (!profile.createdAt) profile.createdAt = new Date().toISOString();
  profile.updatedAt = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEYS.RUDRA_PROFILE, JSON.stringify(profile));
  } catch (e) {}

  // Sync to backend DB
  const visitorId = getVisitorId();
  fetch('/api/analytics/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      name: cleanName,
      role: profile.role || (isBossDevice() ? 'Boss/Owner' : 'Reviewer/Visitor'),
      isStudent: profile.isStudent || false,
      contactDetails: profile.contactDetails || ''
    })
  }).catch(() => {});
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

    // Get visitor name if available
    const profile = getVisitorProfile();
    const visitorName = profile?.name || (isBossDevice() ? 'Boss' : null);

    // Async silent backend notification
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        visitorName,
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
