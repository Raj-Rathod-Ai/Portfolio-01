import { getCache, setCache } from '../utils/cache.js';

const CACHE_KEY = 'github_repositories_cache';
const CACHE_EXPIRY_MINS = 20; // Cache for 20 minutes

const SKIP_REPOS = [
  'raj-rathod-ai',
  '.github',
  'impact-training-parul-university',
  'portfolio',
  'certificate',
  'portfolio-01',
  'neetcode-submissions',
  'neetcode'
];

const FALLBACK_REPOS = [
  {
    name: 'Taxi-Fare-Prediction',
    description: 'Predicting taxi fare amounts using machine learning regression models based on trip parameters.',
    language: 'Python',
    updated_at: '2026-06-12T00:00:00Z',
    created_at: '2026-01-20T00:00:00Z',
    stargazers_count: 0,
    topics: ['machine-learning', 'regression', 'scikit-learn'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction'
  },
  {
    name: 'Food_Delivery_Time-Using-ML',
    description: 'Predicting food delivery times dynamically based on distance, traffic, and weather conditions.',
    language: 'Python',
    updated_at: '2026-06-10T00:00:00Z',
    created_at: '2026-02-15T00:00:00Z',
    stargazers_count: 0,
    topics: ['predictive-modeling', 'machine-learning', 'streamlit'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Food_Delivery_Time-Using-ML'
  },
  {
    name: 'Discover-Your-True-Personality',
    description: 'An AI-powered personality analysis system utilizing questionnaire data to predict traits.',
    language: 'Python',
    updated_at: '2026-06-08T00:00:00Z',
    created_at: '2026-02-18T00:00:00Z',
    stargazers_count: 0,
    topics: ['data-science', 'personality-analysis', 'classification'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality'
  },
  {
    name: 'Library-Mangement',
    description: 'An interactive system for book allocation, user registers, and catalog management.',
    language: 'Python',
    updated_at: '2026-06-05T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    stargazers_count: 0,
    topics: ['database', 'management-system', 'oop'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Library-Mangement'
  },
  {
    name: 'Fake-News-Detection-Using-ML-Real-time',
    description: 'Real-time NLP classifier to detect fake news signals in textual reports.',
    language: 'Python',
    updated_at: '2026-06-02T00:00:00Z',
    created_at: '2026-03-05T00:00:00Z',
    stargazers_count: 0,
    topics: ['nlp', 'classification', 'text-mining'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time'
  },
  {
    name: 'stone-paper-scissors-python',
    description: 'A Python implementation of the classic game with user-vs-computer options.',
    language: 'Python',
    updated_at: '2026-05-28T00:00:00Z',
    created_at: '2026-03-10T00:00:00Z',
    stargazers_count: 0,
    topics: ['python-game', 'basics'],
    html_url: 'https://github.com/Raj-Rathod-Ai/stone-paper-scissors-python'
  },
  {
    name: 'neuro-os',
    description: 'A mock neural operating system interface built to demonstrate creative front-end styling.',
    language: 'JavaScript',
    updated_at: '2026-05-20T00:00:00Z',
    created_at: '2026-03-15T00:00:00Z',
    stargazers_count: 0,
    topics: ['creative-coding', 'web-app'],
    html_url: 'https://github.com/Raj-Rathod-Ai/neuro-os'
  },
  {
    name: 'Job-Analysis-Dashboard',
    description: 'An interactive dashboard showing job market insights, trends, and analytical insights.',
    language: 'Power BI',
    updated_at: '2026-05-15T00:00:00Z',
    created_at: '2026-03-20T00:00:00Z',
    stargazers_count: 0,
    topics: ['dashboard', 'data-analytics', 'job-market'],
    html_url: 'https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard'
  },
  {
    name: 'FlowerDiseaseSystem',
    description: 'Computer vision classification model to detect diseases in plant/flower leaves.',
    language: 'Python',
    updated_at: '2026-05-10T00:00:00Z',
    created_at: '2026-03-25T00:00:00Z',
    stargazers_count: 0,
    topics: ['cnn', 'deep-learning', 'computer-vision'],
    html_url: 'https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem'
  }
];

/**
 * Fetch public repositories for the user from GitHub API.
 * Uses localStorage cache to prevent rate-limiting.
 * @returns {Promise<Array>} List of filtered repositories.
 */
export async function fetchGitHubRepositories() {
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log('Serving repositories from local cache.');
    return cached;
  }

  try {
    console.log('Fetching repositories from GitHub API...');
    const res = await fetch('https://api.github.com/users/Raj-Rathod-Ai/repos?sort=updated&per_page=100');
    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }
    const repos = await res.json();
    
    const filtered = repos.filter(repo => {
      const nameLower = (repo.name || '').toLowerCase();
      return (
        !SKIP_REPOS.includes(nameLower) &&
        !repo.archived &&
        !repo.fork
      );
    });

    setCache(CACHE_KEY, filtered, CACHE_EXPIRY_MINS);
    return filtered;
  } catch (err) {
    console.warn('Failed to fetch from GitHub API. Falling back to static repositories list.', err.message);
    return FALLBACK_REPOS; // Graceful fallback
  }
}
