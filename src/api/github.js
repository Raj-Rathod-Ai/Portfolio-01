import { getCache, setCache } from '../utils/cache.js';
import { getApiBaseUrl } from '../utils/analytics.js';

const CACHE_KEY = 'github_repositories_cache';
const CACHE_EXPIRY_MINS = 10; // Cache for 10 minutes

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
    "name": "senti.ai",
    "description": "⚡ SENTI.AI — BiGRU Deep Learning Emotion Intelligence & Sentiment Analysis system.",
    "language": "Python",
    "updated_at": "2026-08-26T17:00:00Z",
    "created_at": "2026-08-26T16:00:00Z",
    "stargazers_count": 1,
    "topics": [
      "deep-learning",
      "bigru",
      "nlp",
      "emotion-intelligence",
      "sentiment-analysis",
      "python",
      "tensorflow",
      "pytorch"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/senti.ai"
  },
  {
    "name": "AutoPrepAI",
    "description": "\u26a1 AutoPrepAI \u2014 Offline AI-powered automated data preprocessing & quality analysis platform built with Streamlit. Upload any CSV/Excel/Parquet/JSON dataset and get full cleaning, feature engineering, quality scoring, visualizations, and downloadable reports \u2014 no cloud required.",
    "language": "Python",
    "updated_at": "2026-07-26T17:27:05Z",
    "created_at": "2026-07-09T18:11:01Z",
    "stargazers_count": 1,
    "topics": [
      "data-analysis",
      "data-science",
      "machine-learning",
      "mathematics",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "seaborn"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/AutoPrepAI"
  },
  {
    "name": "car-selling-price-prediction",
    "description": "A machine learning web application built with Streamlit that predicts the estimated resale price of a used car using a trained ML model and an interactive user-friendly questionnaire.",
    "language": "Python",
    "updated_at": "2026-07-26T17:25:42Z",
    "created_at": "2026-07-15T16:12:44Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "scikit-learn",
      "seaborn",
      "streamlit"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/car-selling-price-prediction"
  },
  {
    "name": "ChatNotes",
    "description": "RAG-powered document assistant that lets users chat with PDFs without repeatedly uploading files or hitting token limits. Built with Groq API, with planned support for Mistral and other open-source LLMs for fast and cost-effective document Q&A.",
    "language": "CSS",
    "updated_at": "2026-08-08T06:39:39Z",
    "created_at": "2026-07-26T11:26:16Z",
    "stargazers_count": 1,
    "topics": [
      "css",
      "groq-api",
      "html",
      "javascript",
      "python3",
      "rag"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/ChatNotes"
  },
  {
    "name": "Discover-Your-True-Personality",
    "description": "\ud83d\ude80 AI-powered Personality Prediction System built with Python, Scikit-learn, and Streamlit. \ud83e\udde0 Analyze 26 personality traits to predict Introvert, Ambivert, or Extrovert with an interactive UI, confidence scoring, and detailed insights.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:31:08Z",
    "created_at": "2026-06-29T17:32:10Z",
    "stargazers_count": 2,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "seaborn"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality"
  },
  {
    "name": "drug-recommendation-system",
    "description": "A Streamlit-based machine learning application that recommends suitable drug categories based on patient information through a simple, easy-to-understand questionnaire.",
    "language": "Python",
    "updated_at": "2026-07-26T17:24:55Z",
    "created_at": "2026-07-15T16:13:31Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "scikit-learn",
      "seaborn",
      "streamlit"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/drug-recommendation-system"
  },
  {
    "name": "Fake-News-Detection-Using-ML-Real-time",
    "description": "A real-time fake news detection system that analyzes online news articles using machine learning. The project fetches live news, evaluates credibility based on trusted patterns, and shows how likely a news article is to be true, helping users make informed decisions.",
    "language": "Python",
    "updated_at": "2026-08-21T14:31:46Z",
    "created_at": "2026-01-29T10:22:11Z",
    "stargazers_count": 4,
    "topics": [
      "ai",
      "authentication-backend",
      "css",
      "fake-news",
      "flask",
      "html5",
      "js",
      "login",
      "machine-learning",
      "ml",
      "mlops",
      "multimodel",
      "python3",
      "real-news",
      "real-time",
      "rf",
      "singup",
      "three-js",
      "verify"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time"
  },
  {
    "name": "FlowerDiseaseSystem",
    "description": "This project builds an end-to-end flower recognition and disease detection system using deep learning.",
    "language": "JavaScript",
    "updated_at": "2026-07-01T06:21:32Z",
    "created_at": "2026-04-10T17:14:16Z",
    "stargazers_count": 4,
    "topics": [],
    "html_url": "https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem"
  },
  {
    "name": "Food_Delivery_Time-Using-ML",
    "description": "\ud83d\ude80 End-to-end Linear Regression project built with Python, featuring data preprocessing, EDA, feature engineering, model training, evaluation, and prediction using Scikit-learn. Turning raw data into meaningful insights, one model at a time. \ud83d\udcca\ud83e\udd16",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:31:43Z",
    "created_at": "2026-06-27T13:17:18Z",
    "stargazers_count": 4,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "seaborn"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Food_Delivery_Time-Using-ML"
  },
  {
    "name": "healthy-lifestyle-prediction",
    "description": "A machine learning-powered Streamlit application that evaluates health and lifestyle factors to provide personalized health risk predictions using an interactive questionnaire.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:24:09Z",
    "created_at": "2026-07-15T16:14:16Z",
    "stargazers_count": 2,
    "topics": [
      "data-science",
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "seaborn"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/healthy-lifestyle-prediction"
  },
  {
    "name": "HybridMind",
    "description": "\ud83d\ude80 Multi-model AI platform for deploying Machine Learning models with Python, Google Gemini AI, Tavily Search, and secure API integration.",
    "language": "JavaScript",
    "updated_at": "2026-07-26T17:28:27Z",
    "created_at": "2026-07-02T17:49:41Z",
    "stargazers_count": 1,
    "topics": [
      "api",
      "llm",
      "mistral",
      "numpy",
      "pandas",
      "python"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/HybridMind"
  },
  {
    "name": "Job-Analysis-Dashboard",
    "description": "Job Analysis Dashboard for practice PowerBi",
    "language": "Python",
    "updated_at": "2026-07-01T06:21:22Z",
    "created_at": "2026-05-24T06:12:12Z",
    "stargazers_count": 4,
    "topics": [],
    "html_url": "https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard"
  },
  {
    "name": "Library-Mangement",
    "description": "A simple and interactive Library Management System built using Python and Streamlit, designed to manage books and members efficiently with a modern web interface.  This project allows users to add books, register members, borrow and return books, and view real-time library data \u2014 all through a clean and user-friendly dashboard.",
    "language": "Python",
    "updated_at": "2026-07-01T06:21:41Z",
    "created_at": "2026-03-28T10:20:31Z",
    "stargazers_count": 4,
    "topics": [
      "library-management-system",
      "oops-in-python",
      "python3"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Library-Mangement"
  },
  {
    "name": "Loan-Risk-Assessment-App",
    "description": "A Streamlit app that asks a loan applicant simple, plain-language questions one at a time, then uses your trained Gaussian Naive Bayes model (naive_bayes_model.pkl) to estimate the risk that the loan would default.",
    "language": "Python",
    "updated_at": "2026-07-26T17:33:57Z",
    "created_at": "2026-07-08T16:34:29Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Loan-Risk-Assessment-App"
  },
  {
    "name": "Machine-Learning-Notes",
    "description": "\ud83d\udcda Visual Machine Learning notes covering concepts, mathematics, formulas, model intuition, algorithms, evaluation metrics, and how ML models work behind the scenes\u2014with easy-to-understand diagrams and explanations.",
    "language": "Python",
    "updated_at": "2026-07-01T06:21:14Z",
    "created_at": "2026-06-27T13:31:30Z",
    "stargazers_count": 4,
    "topics": [],
    "html_url": "https://github.com/Raj-Rathod-Ai/Machine-Learning-Notes"
  },
  {
    "name": "Mark-Predication",
    "description": "Academic Performance Predictor is a Machine Learning web app that predicts students' exam scores using a Tuned XGBoost Regressor. Built with Python, Streamlit, Scikit-learn, Pandas, NumPy, and XGBoost.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-08-08T06:39:38Z",
    "created_at": "2026-07-26T16:17:02Z",
    "stargazers_count": 1,
    "topics": [
      "decision-trees",
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "scikit-learn",
      "streamlit",
      "xgboost-regression"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Mark-Predication"
  },
  {
    "name": "Movie-Recommendations-Using-NLP-and-ML",
    "description": "Movie recommendation system using NLP and Machine Learning to suggest similar movies based on content, genres, keywords, and user preferences.",
    "language": "Python",
    "updated_at": "2026-08-08T06:39:25Z",
    "created_at": "2026-08-04T19:18:28Z",
    "stargazers_count": 1,
    "topics": [
      "linear-kernel",
      "machine-learning",
      "nlp",
      "python3",
      "sklearn",
      "streamlit",
      "tf-idf"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-and-ML"
  },
  {
    "name": "neuro-os",
    "description": "NeuroOS is an advanced, AI-powered Operating System interface built with a modern web stack. It features real-time system monitoring, an embedded Code IDE, live terminal emulation, cybersecurity threat detection, and AI integration via Google Gemini.",
    "language": "TypeScript",
    "updated_at": "2026-08-06T06:49:09Z",
    "created_at": "2026-05-18T13:46:27Z",
    "stargazers_count": 4,
    "topics": [],
    "html_url": "https://github.com/Raj-Rathod-Ai/neuro-os"
  },
  {
    "name": "Random-Forest-Food-Delivery-Time",
    "description": "A Machine Learning project that predicts food delivery time using the Random Forest algorithm. Built with Python and Scikit-learn, this project analyzes delivery-related factors to provide accurate delivery time estimates.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:23:13Z",
    "created_at": "2026-07-16T14:46:38Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "numpy",
      "pandas",
      "python",
      "random-forest",
      "scikit-learn",
      "streamlit"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Random-Forest-Food-Delivery-Time"
  },
  {
    "name": "Salary_predication",
    "description": "A Streamlit web application that predicts salary based on years of professional experience using Machine Learning. Features a modern glassmorphism UI, interactive salary insights, Plotly visualizations, and \"What-If\" salary growth analysis powered by Scikit-learn.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:33:18Z",
    "created_at": "2026-07-05T12:53:23Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "seaborn",
      "streamlit"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Salary_predication"
  },
  {
    "name": "stone-paper-scissors-python",
    "description": "Stone Paper Scissor Game For Logic Building Using Python",
    "language": "Python",
    "updated_at": "2026-07-01T06:21:28Z",
    "created_at": "2025-12-18T11:18:47Z",
    "stargazers_count": 4,
    "topics": [],
    "html_url": "https://github.com/Raj-Rathod-Ai/stone-paper-scissors-python"
  },
  {
    "name": "Student_performance_predication",
    "description": "A machine learning project to predict student GPA using academic and demographic features.",
    "language": "Jupyter Notebook",
    "updated_at": "2026-07-26T17:27:40Z",
    "created_at": "2026-07-05T10:23:06Z",
    "stargazers_count": 2,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Student_performance_predication"
  },
  {
    "name": "Taxi-Fare-Prediction",
    "description": "\ud83d\ude96 AI-powered Taxi Fare Prediction using Polynomial Regression with a modern web interface for real-time fare estimation, built using Python, Scikit-learn, and Streamlit.",
    "language": "TypeScript",
    "updated_at": "2026-07-26T17:32:07Z",
    "created_at": "2026-06-30T11:06:12Z",
    "stargazers_count": 2,
    "topics": [
      "machine-learning",
      "numpy",
      "pandas",
      "python"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction"
  },
  {
    "name": "Tic-Tac-Toe",
    "description": "A web-based Tic Tac Toe game built using Python, Streamlit, and NumPy, featuring a modern glassmorphism UI, real-time state management, and optimized game logic for seamless gameplay experience.",
    "language": "Python",
    "updated_at": "2026-07-01T06:21:35Z",
    "created_at": "2026-04-01T14:48:25Z",
    "stargazers_count": 4,
    "topics": [
      "numpy",
      "numpy-arrays",
      "python3",
      "streamlit-webapp"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/Tic-Tac-Toe"
  },
  {
    "name": "USA-house-price-prediction",
    "description": "A Streamlit machine learning application that estimates residential property prices in the USA using a trained regression model and a user-friendly questionnaire interface.",
    "language": "Python",
    "updated_at": "2026-07-26T17:26:21Z",
    "created_at": "2026-07-15T16:15:16Z",
    "stargazers_count": 1,
    "topics": [
      "machine-learning",
      "matplotlib",
      "numpy",
      "pandas",
      "python",
      "scikit-learn",
      "seaborn",
      "streamlit"
    ],
    "html_url": "https://github.com/Raj-Rathod-Ai/USA-house-price-prediction"
  }
];

/**
 * Helper to fetch and filter repos from direct GitHub API
 */
async function fetchDirectGitHub(timeoutMs = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://api.github.com/users/Raj-Rathod-Ai/repos?sort=updated&per_page=100', {
      signal: controller.signal,
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const repos = await res.json();
    if (Array.isArray(repos) && repos.length > 0) {
      const filtered = repos.filter(repo => {
        const nameLower = (repo.name || '').toLowerCase();
        return !SKIP_REPOS.includes(nameLower) && !repo.archived && !repo.fork;
      });
      if (filtered.length >= 10) return filtered;
    }
    throw new Error('Direct GitHub repo list empty or too short');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Helper to fetch repos from backend server proxy
 */
async function fetchBackendGitHub(timeoutMs = 3000) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) throw new Error('No backend API URL available');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${apiUrl}/api/github/repos`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Backend API HTTP ${res.status}`);
    const data = await res.json();
    if (data && Array.isArray(data.repos) && data.repos.length >= 10) {
      return data.repos;
    }
    throw new Error('Backend repo list invalid');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Fetch public repositories with Zero-Delay Optimistic Cache + Parallel Live Sync.
 * @param {boolean} [forceRefresh=false] - If true, performs a live parallel fetch.
 * @returns {Promise<Array>} List of repositories.
 */
export async function fetchGitHubRepositories(forceRefresh = false) {
  const cached = getCache(CACHE_KEY);

  // If not forcing refresh, return cached data or fallback IMMEDIATELY (0ms UI latency)
  if (!forceRefresh) {
    if (cached && Array.isArray(cached) && cached.length >= 15) {
      return cached;
    }
    // Return fallback immediately and allow background sync to update
    return FALLBACK_REPOS;
  }

  // Live Refresh: Run Direct GitHub and Backend proxy in parallel race
  try {
    const liveRepos = await Promise.any([
      fetchDirectGitHub(3200),
      fetchBackendGitHub(3200)
    ]);
    if (Array.isArray(liveRepos) && liveRepos.length >= 10) {
      setCache(CACHE_KEY, liveRepos, CACHE_EXPIRY_MINS);
      return liveRepos;
    }
  } catch (err) {
    console.warn('Live GitHub sync notice (falling back to cached/curated):', err.message);
  }

  // If live fetch fails, keep cached or static fallback
  if (cached && Array.isArray(cached) && cached.length >= 10) {
    return cached;
  }
  setCache(CACHE_KEY, FALLBACK_REPOS, CACHE_EXPIRY_MINS);
  return FALLBACK_REPOS;
}
