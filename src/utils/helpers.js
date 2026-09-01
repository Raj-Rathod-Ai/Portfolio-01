/**
 * Helper utilities for formatting and mapping project properties.
 */

/**
 * Slugify a string (convert spaces/underscores to dashes, lowercase).
 * @param {string} text - Text to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/_+/g, '-')           // Replace underscores with -
    .replace(/[^\w\-]+/g, '')      // Remove all non-word chars
    .replace(/\-\-+/g, '-');       // Replace multiple - with single -
}

/**
 * Format a ISO date string to a human-readable date.
 * @param {string} dateStr - ISO Date string.
 * @returns {string} Formatted date (e.g. 12 Jun 2026).
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (err) {
    return dateStr;
  }
}

/**
 * Determine if a project is a group project.
 * Priority: 1. localMetadata type, 2. keyword matching on repository name.
 * @param {string} name - Repository name.
 * @param {Array} localMetadata - Local metadata array.
 * @returns {boolean} True if it is a group project.
 */
export function isGroupProject(name, localMetadata = []) {
  const meta = localMetadata.find(m => m.repo.toLowerCase() === name.toLowerCase());
  if (meta && meta.type) {
    return meta.type === 'group';
  }
  
  const GROUP_KEYWORDS = ['flower-disease', 'fakenews', 'fake-news', 'neuro-os', 'neuroos', 'flowerdiseasesystem'];
  const lower = name.toLowerCase();
  return GROUP_KEYWORDS.some(g => lower.includes(g));
}

/**
 * Map technologies and programming language to standard icons, colors, and backgrounds.
 * @param {object} repo - GitHub Repository object.
 * @returns {object} Theme parameters (icon, color, bg, border).
 */
export function getRepoIcon(repo) {
  const name = (repo.name || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (name.includes('fake-news') || name.includes('fakenews') || desc.includes('nlp') || desc.includes('fake news')) {
    return { icon: 'fa-newspaper', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  }
  if (name.includes('flower') || name.includes('disease') || desc.includes('cnn') || desc.includes('plant')) {
    return { icon: 'fa-seedling', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' };
  }
  if (name.includes('food') || name.includes('delivery')) {
    return { icon: 'fa-truck-fast', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
  }
  if (name.includes('taxi') || name.includes('fare') || name.includes('price')) {
    return { icon: 'fa-taxi', color: 'text-sky', bg: 'bg-sky/10', border: 'border-sky/20' };
  }
  if (name.includes('personality') || name.includes('discover')) {
    return { icon: 'fa-brain', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
  }
  if (name.includes('job') || name.includes('analysis') || name.includes('dashboard')) {
    return { icon: 'fa-chart-column', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
  }
  if (name.includes('tic-tac') || name.includes('stone') || name.includes('paper') || name.includes('game')) {
    return { icon: 'fa-gamepad', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  }
  if (name.includes('library') || name.includes('management') || name.includes('book')) {
    return { icon: 'fa-book', color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' };
  }
  if (name.includes('portfolio') || name.includes('resume')) {
    return { icon: 'fa-id-badge', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
  }
  if (name.includes('chat') || name.includes('llm') || name.includes('gpt')) {
    return { icon: 'fa-comments', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
  }
  if (lang === 'python' || lang === 'jupyter notebook') {
    return { icon: 'fa-chart-line', color: 'text-sky', bg: 'bg-sky/10', border: 'border-sky/20' };
  }
  if (lang === 'javascript' || lang === 'typescript') {
    return { icon: 'fa-code', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
  }
  if (lang === 'java') {
    return { icon: 'fa-mug-hot', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
  }
  if (lang === 'css' || lang === 'html') {
    return { icon: 'fa-palette', color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20' };
  }
  return { icon: 'fa-code', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
}

/**
 * Get the live deployment demo URL for a project.
 * @param {object} repo - GitHub Repository object.
 * @param {Array} localMetadata - Local metadata array.
 * @returns {string} Live demo link.
 */
export function getLiveUrl(repo, localMetadata = []) {
  if (!repo) return '';

  // 1. Live homepage set directly on GitHub repository (highest priority)
  if (repo.homepage && typeof repo.homepage === 'string' && repo.homepage.trim().length > 5) {
    return repo.homepage.trim();
  }

  // 2. Local metadata override from projects.json
  const meta = localMetadata.find(m => m.repo && m.repo.toLowerCase() === (repo.name || '').toLowerCase());
  if (meta && meta.live && meta.live.trim().length > 5) {
    return meta.live.trim();
  }

  // 3. Fallback default deployment links
  const overrides = {
    'fruitscheck-cnn-fruit-freshness': 'https://fruits-check.streamlit.app/',
    'sukoon-saathi': 'https://sukoonsaathi-frontend.onrender.com/',
    'senti-ai-bigru-emotion-detection-using-dl': 'https://senti-ai.onrender.com',
    'senti.ai': 'https://senti-ai.onrender.com',
    'laptop-price-predicate-using-dl': 'https://laptop-price-predicate.streamlit.app/',
    'autoprepai': 'https://data-eda-processing.streamlit.app/',
    'car-selling-price-prediction': 'https://car-selling-price-prediction.streamlit.app/',
    'chatnotes': 'https://chat-with-your-notes-dusx.onrender.com/',
    'meetnotes': 'https://meetnotes.streamlit.app/',
    'meetnote': 'https://meetnotes.streamlit.app/',
    'discover-your-true-personality': 'https://discover-your-true-personality.streamlit.app/',
    'drug-recommendation-system': 'https://drug-recommendation-systems.streamlit.app/',
    'fake-news-detection-using-ml-real-time': 'https://truthlens5.netlify.app/',
    'flowerdiseasesystem': 'https://flower-disease-system.vercel.app',
    'food_delivery_time-using-ml': 'https://fooddelivery-time.streamlit.app/',
    'healthy-lifestyle-prediction': 'https://healthy-lifestyle-prediction.streamlit.app/',
    'hybridmind': 'https://hybridmind.netlify.app/',
    'library-mangement': 'https://librarymangement1.streamlit.app/',
    'loan-risk-assessment-app': 'https://loan-risk-assessment-app.streamlit.app/',
    'mark-predication': 'https://mark-predication.streamlit.app/',
    'movie-recommendations-using-nlp-and-ml': 'https://cinema-verse.streamlit.app/',
    'random-forest-food-delivery-time': 'https://random-forest-food-delivery-time.streamlit.app/',
    'salary_predication': 'https://salary-predications.streamlit.app/',
    'stone-paper-scissors-python': 'https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/',
    'student_performance_predication': 'https://student-performance-predication.streamlit.app',
    'taxi-fare-prediction': 'https://taxi-price-prediction.netlify.app/',
    'tic-tac-toe': 'https://tic-tac-toe-1.streamlit.app/',
    'usa-house-price-prediction': 'https://usa-house-price-predictions.streamlit.app/'
  };

  const key = (repo.name || '').toLowerCase();
  return overrides[key] || '';
}
