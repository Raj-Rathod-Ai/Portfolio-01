/**
 * PROJECT OVERRIDES — Manual Data Correction Layer
 *
 * This is the single file you edit to fix project categories, live URLs,
 * descriptions, featured status, and "recent" ordering.
 *
 * HOW IT WORKS:
 *   GitHub Auto-Fetch → Normalize → Apply These Overrides → window.portfolioData
 *   Both Portfolio Cards AND the AI Chatbot read from window.portfolioData.
 *
 * HOW TO ADD / EDIT:
 *   1. Find the entry by `repo` name (case-insensitive match).
 *   2. Change any fields you want to override.
 *   3. To force a project to appear as "recently added", set `pushed_at_override`.
 *   4. To add a project missing from GitHub (private/deleted), add a full entry
 *      with `manualOnly: true` — it will be injected into the list.
 *
 * FIELDS (all optional except `repo`):
 *   repo            — GitHub repo name (exact, case-insensitive match key)
 *   displayTitle    — Clean human-readable title for UI and chatbot
 *   category        — Force a specific category (overrides auto-detection)
 *   live            — Verified live demo URL (string or array for multi-deploy)
 *   description     — Better project description shown in cards and chatbot
 *   featured        — true/false to force featured/non-featured
 *   technologies    — Array of tech tags for chatbot context
 *   pushed_at_override — ISO date string to control "recent" ordering
 *   manualOnly      — If true, this project is injected even if not on GitHub
 *   html_url        — Required if manualOnly: true
 *   language        — Primary language (used for manualOnly entries)
 */

export const PROJECT_OVERRIDES = [
  // ─────────────────────────────────────────────
  // RAG PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'MeetNotes',
    displayTitle: 'MeetNotes — AI Meeting Intelligence',
    category: 'RAG',
    live: 'https://meetnotes.streamlit.app/',
    description: 'Autonomous AI meeting intelligence system using Whisper speech-to-text and Mistral LLM for automated transcription, smart Q&A, and meeting summaries — full RAG pipeline.',
    featured: true,
    technologies: ['Python', 'Whisper', 'Mistral', 'RAG', 'Streamlit', 'LangChain'],
    pushed_at_override: '2026-08-20T00:00:00Z'
  },
  {
    repo: 'ChatNotes',
    displayTitle: 'ChatNotes — Chat With Your Notes',
    category: 'RAG',
    live: 'https://chat-with-your-notes-dusx.onrender.com/',
    description: 'RAG-powered document intelligence app — upload PDFs/notes and have a real conversational Q&A session with your documents using vector embeddings and LLM retrieval.',
    featured: true,
    technologies: ['Python', 'LangChain', 'ChromaDB', 'Streamlit', 'OpenAI'],
    pushed_at_override: '2026-08-10T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // GENERATIVE AI PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'HybridMind',
    displayTitle: 'HybridMind — Generative AI Assistant',
    category: 'Generative AI',
    live: 'https://hybridmind.netlify.app/',
    description: 'Production-grade Generative AI assistant combining LLM orchestration, prompt engineering, and multi-modal capabilities for intelligent task automation.',
    featured: true,
    technologies: ['Python', 'LLM', 'LangChain', 'Mistral', 'React', 'Netlify'],
    pushed_at_override: '2026-08-05T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // DEEP LEARNING PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'FruitsCheck-CNN-Fruit-Freshness',
    displayTitle: 'FruitsCheck — CNN Fruit Freshness Classifier',
    category: 'Deep Learning',
    live: 'https://fruits-check.streamlit.app/',
    description: 'Deep CNN classifier (TensorFlow/Keras) that detects whether fruits (apple, banana, orange) are Fresh or Rotten from uploaded images. Multi-class computer vision pipeline.',
    featured: true,
    technologies: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Streamlit', 'Pillow', 'NumPy'],
    pushed_at_override: '2026-09-01T00:00:00Z'
  },
  {
    repo: 'SENTI-AI-BiGRU-Emotion-Detection-Using-DL',
    displayTitle: 'SENTI-AI — BiGRU Emotion Detection',
    category: 'Deep Learning',
    live: 'https://senti-ai.onrender.com',
    description: 'Bidirectional GRU deep learning model for real-time emotion classification (Joy, Sadness, Anger, Fear, Love, Surprise) from text. FastAPI backend with production deployment.',
    featured: true,
    technologies: ['Python', 'Keras', 'BiGRU', 'FastAPI', 'NLP', 'TensorFlow'],
    pushed_at_override: '2026-08-25T00:00:00Z'
  },
  {
    repo: 'Laptop-Price-Predicate-Using-DL',
    displayTitle: 'Laptop Price Predictor — ANN Regression',
    category: 'Deep Learning',
    live: 'https://laptop-price-predicate.streamlit.app/',
    description: 'Artificial Neural Network (ANN) regression model predicting laptop prices from specs (RAM, GPU, brand, screen) with One-Hot Encoding and StandardScaler preprocessing.',
    featured: true,
    technologies: ['Python', 'Keras', 'ANN', 'Streamlit', 'Scikit-Learn', 'Pandas'],
    pushed_at_override: '2026-08-15T00:00:00Z'
  },
  {
    repo: 'FlowerDiseaseSystem',
    displayTitle: 'Flower Disease Detection System',
    category: 'Deep Learning',
    live: 'https://flower-disease-system.vercel.app',
    description: 'Group deep learning project — CNN-based plant disease detection system classifying flower diseases from leaf images with a React frontend and Python model serving.',
    featured: true,
    technologies: ['Python', 'CNN', 'TensorFlow', 'React', 'Vercel', 'Computer Vision'],
    pushed_at_override: '2026-07-20T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // NLP PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'Fake-News-Detection-Using-DL-Real-time',
    displayTitle: 'TruthLens — Fake News Detection (DL)',
    category: 'NLP',
    live: ['https://truthlens5.netlify.app/', 'https://truthlens5.streamlit.app/'],
    description: 'Real-time fake news detection using Deep Learning NLP — LSTM/Transformer based text classifier. Dual deployment: React web app + Streamlit ML demo.',
    featured: true,
    technologies: ['Python', 'LSTM', 'NLP', 'TensorFlow', 'React', 'Netlify', 'Streamlit'],
    pushed_at_override: '2026-07-10T00:00:00Z'
  },
  {
    repo: 'Fake-News-Detection-Using-ML-Real-time',
    displayTitle: 'TruthLens — Fake News Detection (ML)',
    category: 'NLP',
    live: ['https://truthlens5.netlify.app/', 'https://truthlens5.streamlit.app/'],
    description: 'Real-time fake news detection using classical ML techniques — TF-IDF vectorization with Logistic Regression / Naive Bayes classifiers. Group project with React frontend.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'TF-IDF', 'NLP', 'React', 'Netlify'],
    pushed_at_override: '2026-07-08T00:00:00Z'
  },
  {
    repo: 'Movie-Recommendations-Using-NLP-and-ML',
    displayTitle: 'CinemaVerse — Movie Recommendation Engine',
    category: 'NLP',
    live: 'https://cinema-verse.streamlit.app/',
    description: 'Content-based movie recommendation engine using NLP techniques — TF-IDF vectorization and cosine similarity on plot synopses for personalized movie suggestions.',
    featured: true,
    technologies: ['Python', 'NLP', 'Scikit-Learn', 'NLTK', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-06-15T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // MACHINE LEARNING PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'Sukoon-Saathi',
    displayTitle: 'Sukoon-Saathi — Student Wellness Predictor',
    category: 'Machine Learning',
    live: 'https://sukoonsaathi-frontend.onrender.com/',
    description: 'Student mental wellness prediction system — ML pipeline (Scikit-Learn + FastAPI) that scores wellness from academic stress, sleep quality, screen time, and lifestyle features.',
    featured: true,
    technologies: ['Python', 'Scikit-Learn', 'FastAPI', 'React', 'Render', 'Pandas'],
    pushed_at_override: '2026-08-30T00:00:00Z'
  },
  {
    repo: 'Taxi-Fare-Prediction',
    displayTitle: 'Taxi Fare Predictor',
    category: 'Machine Learning',
    live: 'https://taxi-price-prediction.netlify.app/',
    description: 'ML regression model predicting taxi fare prices from trip distance, pickup/dropoff coordinates, time-of-day, and passenger count using Random Forest and XGBoost.',
    featured: true,
    technologies: ['Python', 'Scikit-Learn', 'XGBoost', 'Random Forest', 'Streamlit', 'Netlify'],
    pushed_at_override: '2026-06-01T00:00:00Z'
  },
  {
    repo: 'car-selling-price-prediction',
    displayTitle: 'Car Selling Price Predictor',
    category: 'Machine Learning',
    live: 'https://car-selling-price-prediction.streamlit.app/',
    description: 'Predicts used car selling prices using ML regression — features include brand, fuel type, transmission, year, and kms driven. Streamlit interactive UI.',
    featured: true,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'Matplotlib'],
    pushed_at_override: '2026-05-20T00:00:00Z'
  },
  {
    repo: 'USA-house-price-prediction',
    displayTitle: 'USA House Price Prediction',
    category: 'Machine Learning',
    live: 'https://usa-house-price-predictions.streamlit.app/',
    description: 'Predicts USA residential property prices using Linear Regression and feature engineering on location, lot size, bedrooms, and amenities.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Linear Regression', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-05-10T00:00:00Z'
  },
  {
    repo: 'Salary_predication',
    displayTitle: 'Salary Prediction Model',
    category: 'Machine Learning',
    live: 'https://salary-predications.streamlit.app/',
    description: 'Salary prediction using ML regression — models experience, education level, job role, and location to estimate annual compensation packages.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'Seaborn'],
    pushed_at_override: '2026-04-15T00:00:00Z'
  },
  {
    repo: 'Student_performance_predication',
    displayTitle: 'Student Performance Predictor',
    category: 'Machine Learning',
    live: 'https://student-performance-predication.streamlit.app',
    description: 'Predicts student academic performance from study hours, attendance, parental education, and extracurricular activities using classification and regression models.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'Matplotlib'],
    pushed_at_override: '2026-04-10T00:00:00Z'
  },
  {
    repo: 'Mark-Predication',
    displayTitle: 'Mark Prediction System',
    category: 'Machine Learning',
    live: 'https://mark-predication.streamlit.app/',
    description: 'Academic marks prediction model using supervised ML regression — inputs study time, attendance, and subject difficulty to forecast examination outcomes.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-04-05T00:00:00Z'
  },
  {
    repo: 'Loan-Risk-Assessment-App',
    displayTitle: 'Loan Risk Assessment',
    category: 'Machine Learning',
    live: 'https://loan-risk-assessment-app.streamlit.app/',
    description: 'Loan default risk classification system using Random Forest — evaluates credit history, income, loan amount, and employment status to predict approval risk.',
    featured: false,
    technologies: ['Python', 'Random Forest', 'Scikit-Learn', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-04-01T00:00:00Z'
  },
  {
    repo: 'healthy-lifestyle-prediction',
    displayTitle: 'Healthy Lifestyle Predictor',
    category: 'Machine Learning',
    live: 'https://healthy-lifestyle-prediction.streamlit.app/',
    description: 'ML classifier that assesses lifestyle health score from exercise habits, diet, sleep hours, BMI, and stress levels. Interactive Streamlit dashboard.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'Seaborn'],
    pushed_at_override: '2026-03-25T00:00:00Z'
  },
  {
    repo: 'drug-recommendation-system',
    displayTitle: 'Drug Recommendation System',
    category: 'Machine Learning',
    live: 'https://drug-recommendation-systems.streamlit.app/',
    description: 'ML-based drug recommendation system using patient medical features (age, BP, cholesterol, Na/K levels) to recommend appropriate medications via Decision Tree classifier.',
    featured: false,
    technologies: ['Python', 'Decision Tree', 'Scikit-Learn', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-03-20T00:00:00Z'
  },
  {
    repo: 'Food_Delivery_Time-Using-ML',
    displayTitle: 'Food Delivery Time Predictor (ML)',
    category: 'Machine Learning',
    live: 'https://fooddelivery-time.streamlit.app/',
    description: 'Predicts food delivery time using ML regression on distance, restaurant rating, weather, traffic density, and vehicle type using Gradient Boosting models.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Gradient Boosting', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-03-15T00:00:00Z'
  },
  {
    repo: 'Random-Forest-Food-Delivery-Time',
    displayTitle: 'Food Delivery Time — Random Forest',
    category: 'Machine Learning',
    live: 'https://random-forest-food-delivery-time.streamlit.app/',
    description: 'Food delivery time estimation using Random Forest — ensemble learning approach comparing multiple regressor configurations for optimal accuracy.',
    featured: false,
    technologies: ['Python', 'Random Forest', 'Scikit-Learn', 'Streamlit', 'Pandas'],
    pushed_at_override: '2026-03-10T00:00:00Z'
  },
  {
    repo: 'Discover-Your-True-Personality',
    displayTitle: 'Personality Type Predictor',
    category: 'Machine Learning',
    live: 'https://discover-your-true-personality.streamlit.app/',
    description: 'ML personality classification system predicting Big Five personality traits (OCEAN model) from behavioral and lifestyle questionnaire responses.',
    featured: false,
    technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'Matplotlib'],
    pushed_at_override: '2026-03-05T00:00:00Z'
  },
  {
    repo: 'Machine-Learning-Notes',
    displayTitle: 'Machine Learning Notes',
    category: 'Machine Learning',
    live: '',
    description: 'Comprehensive ML study notes and reference implementations covering algorithms, math intuitions, code examples, and best practices.',
    featured: false,
    technologies: ['Python', 'Jupyter', 'Scikit-Learn', 'NumPy', 'Pandas'],
    pushed_at_override: '2026-02-01T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // DATA SCIENCE PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'AutoPrepAI',
    displayTitle: 'AutoPrepAI — Automated Data Preprocessing',
    category: 'Data Science',
    live: 'https://data-eda-processing.streamlit.app/',
    description: 'Automated EDA and data preprocessing system — upload any CSV dataset and get instant quality analysis, missing value handling, outlier detection, and preprocessing reports.',
    featured: true,
    technologies: ['Python', 'Pandas', 'Streamlit', 'Matplotlib', 'Seaborn', 'NumPy'],
    pushed_at_override: '2026-07-15T00:00:00Z'
  },
  {
    repo: 'Job-Analysis-Dashboard',
    displayTitle: 'Job Market Analysis Dashboard',
    category: 'Data Science',
    live: '',
    description: 'Interactive data analysis dashboard exploring job market trends, salary distributions, and required skills across tech roles using Power BI-style visualizations.',
    featured: false,
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Plotly'],
    pushed_at_override: '2026-02-15T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // NORMAL / UTILITY PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'Library-Mangement',
    displayTitle: 'Library Management System',
    category: 'Normal Projects',
    live: 'https://librarymangement1.streamlit.app/',
    description: 'A complete library management system with book inventory, member registration, issue/return tracking, and fine calculation. Built with Python and Streamlit.',
    featured: false,
    technologies: ['Python', 'Streamlit', 'SQLite', 'Pandas'],
    pushed_at_override: '2026-01-20T00:00:00Z'
  },
  {
    repo: 'neuro-os',
    displayTitle: 'Neuro OS — Full Stack AI Platform',
    category: 'Full Stack',
    live: '',
    description: 'Full-stack AI-powered operating system interface — group project combining frontend React UI with Python backend and AI assistant capabilities.',
    featured: false,
    technologies: ['Python', 'React', 'FastAPI', 'JavaScript', 'CSS'],
    pushed_at_override: '2026-01-10T00:00:00Z'
  },

  // ─────────────────────────────────────────────
  // PYTHON CONCEPTS PROJECTS
  // ─────────────────────────────────────────────
  {
    repo: 'stone-paper-scissors-python',
    displayTitle: 'Stone Paper Scissors — Python Game',
    category: 'Python Concepts',
    live: 'https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/',
    description: 'Classic Stone Paper Scissors game implemented in Python with interactive Streamlit UI, score tracking, and computer AI opponent.',
    featured: false,
    technologies: ['Python', 'Streamlit'],
    pushed_at_override: '2025-12-15T00:00:00Z'
  },
  {
    repo: 'Tic-Tac-Toe',
    displayTitle: 'Tic-Tac-Toe — Python Game',
    category: 'Python Concepts',
    live: 'https://tic-tac-toe-1.streamlit.app/',
    description: 'Two-player Tic-Tac-Toe game built with Python and Streamlit, featuring win detection, draw handling, and score tracking.',
    featured: false,
    technologies: ['Python', 'Streamlit'],
    pushed_at_override: '2025-12-10T00:00:00Z'
  }
];

/**
 * Build a lookup map from PROJECT_OVERRIDES for O(1) access by repo name.
 * Keys are normalized to lowercase for case-insensitive matching.
 */
export const OVERRIDES_MAP = PROJECT_OVERRIDES.reduce((map, entry) => {
  map[entry.repo.toLowerCase()] = entry;
  return map;
}, {});
