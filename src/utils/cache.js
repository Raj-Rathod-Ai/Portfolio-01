/**
 * Cache utility for storing data in localStorage with expiration timestamps.
 */

/**
 * Retrieve an item from the cache.
 * @param {string} key - Cache key.
 * @returns {any|null} The cached data if valid and not expired, otherwise null.
 */
export function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    // Check expiration
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error(`Error reading cache for key "${key}":`, err);
    return null;
  }
}

/**
 * Save an item to the cache with an expiration window.
 * @param {string} key - Cache key.
 * @param {any} data - Data to cache.
 * @param {number} expireMinutes - Number of minutes before expiration.
 */
export function setCache(key, data, expireMinutes = 20) {
  try {
    const expiry = Date.now() + expireMinutes * 60 * 1000;
    const payload = {
      expiry,
      data
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.error(`Error writing cache for key "${key}":`, err);
  }
}

/**
 * Remove an item from the cache.
 * @param {string} key - Cache key.
 */
export function clearCache(key) {
  localStorage.removeItem(key);
}
