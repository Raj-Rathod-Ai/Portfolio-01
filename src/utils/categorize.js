import { slugify } from './helpers.js';

// Predefined categories configuration for visuals (icons, gradients, descriptions)
const CATEGORIES_CONFIG = {
  'Generative AI': {
    icon: 'fa-wand-magic-sparkles',
    description: 'Large Language Models, prompt engineering, and GenAI applications.',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500'
  },
  'RAG': {
    icon: 'fa-magnifying-glass-chart',
    description: 'Retrieval-Augmented Generation systems and vector databases.',
    gradient: 'from-rose-500 via-orange-500 to-pink-500'
  },
  'Deep Learning': {
    icon: 'fa-brain',
    description: 'Neural networks, computer vision, and deep feature learning.',
    gradient: 'from-teal-500 via-emerald-500 to-sky-500'
  },
  'Machine Learning': {
    icon: 'fa-chart-line',
    description: 'Predictive models, classification, regression, and data analytics.',
    gradient: 'from-blue-500 via-indigo-500 to-teal-500'
  },
  'NLP': {
    icon: 'fa-language',
    description: 'Natural Language Processing, text mining, and word embeddings.',
    gradient: 'from-purple-500 via-pink-500 to-rose-500'
  },
  'Computer Vision': {
    icon: 'fa-eye',
    description: 'Image classification, object detection, and visual pipelines.',
    gradient: 'from-cyan-500 via-teal-500 to-emerald-500'
  },
  'Data Science': {
    icon: 'fa-chart-pie',
    description: 'Exploratory data analysis, dashboards, and statistical models.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500'
  },
  'AI Agents': {
    icon: 'fa-robot',
    description: 'Autonomous agents, tools, and decision-making logic.',
    gradient: 'from-fuchsia-500 via-purple-500 to-pink-500'
  },
  'MLOps': {
    icon: 'fa-gears',
    description: 'Deployment, pipelines, metrics tracking, and scaling models.',
    gradient: 'from-slate-500 via-zinc-600 to-gray-700'
  },
  'Web Development': {
    icon: 'fa-code',
    description: 'Full-stack applications, interactive UI, and backend services.',
    gradient: 'from-sky-500 via-blue-500 to-indigo-500'
  },
  'Others': {
    icon: 'fa-folder-open',
    description: 'Creative coding, foundational utilities, and games.',
    gradient: 'from-gray-500 via-slate-500 to-zinc-600'
  }
};

/**
 * Determine the category of a project using priority rules.
 * 1. category in projects.json
 * 2. GitHub Topics
 * 3. Repository Description
 * 4. Repository Name
 * 5. Others
 *
 * @param {object} repo - GitHub Repository object.
 * @param {Array} localMetadata - Local metadata array from projects.json.
 * @returns {string} The matched category name.
 */
export function getProjectCategory(repo, localMetadata = []) {
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());

  // 1. Check projects.json
  const meta = localMetadata.find(m => m.repo.toLowerCase() === name.toLowerCase());
  if (meta && meta.category) {
    // Return the matched config category name directly if it exists, matching case
    const match = Object.keys(CATEGORIES_CONFIG).find(k => k.toLowerCase() === meta.category.toLowerCase());
    if (match) return match;
    return meta.category; // Return custom category name if not predefined
  }

  // 2. Check GitHub Topics
  if (topics.some(t => ['generative-ai', 'genai', 'llm', 'openai', 'gemini', 'langchain', 'prompt-engineering', 'claude'].includes(t))) return 'Generative AI';
  if (topics.some(t => ['rag', 'vector-database', 'vectordb', 'vector-search', 'pinecone', 'chroma'].includes(t))) return 'RAG';
  if (topics.some(t => ['deep-learning', 'dl', 'cnn', 'rnn', 'lstm', 'pytorch', 'tensorflow', 'keras'].includes(t))) return 'Deep Learning';
  if (topics.some(t => ['nlp', 'text-mining', 'transformers', 'natural-language-processing'].includes(t))) return 'NLP';
  if (topics.some(t => ['computer-vision', 'cv', 'opencv', 'object-detection', 'image-processing'].includes(t))) return 'Computer Vision';
  if (topics.some(t => ['mlops', 'dvc', 'mlflow', 'ci-cd'].includes(t))) return 'MLOps';
  if (topics.some(t => ['ai-agents', 'agent', 'agents', 'crewai'].includes(t))) return 'AI Agents';
  if (topics.some(t => ['data-science', 'analytics', 'power-bi', 'visualization', 'data-analysis'].includes(t))) return 'Data Science';
  if (topics.some(t => ['machine-learning', 'ml', 'scikit-learn', 'regression', 'classification', 'predictive'].includes(t))) return 'Machine Learning';
  if (topics.some(t => ['web-development', 'web', 'html', 'css', 'javascript', 'nodejs', 'react', 'express'].includes(t))) return 'Web Development';

  // 3. Check Repository Description
  const combinedText = `${name} ${desc}`;
  if (combinedText.includes('generative ai') || combinedText.includes('genai') || combinedText.includes('llm') || combinedText.includes('openai') || combinedText.includes('prompt engineering')) return 'Generative AI';
  if (combinedText.includes('rag') || combinedText.includes('vector database') || combinedText.includes('retrieval augmented') || combinedText.includes('retrieval-augmented')) return 'RAG';
  if (combinedText.includes('deep learning') || combinedText.includes('neural network') || combinedText.includes('cnn') || combinedText.includes('tensorflow') || combinedText.includes('pytorch')) return 'Deep Learning';
  if (combinedText.includes('nlp') || combinedText.includes('natural language') || combinedText.includes('text class')) return 'NLP';
  if (combinedText.includes('computer vision') || combinedText.includes('opencv') || combinedText.includes('object detect') || combinedText.includes('image class')) return 'Computer Vision';
  if (combinedText.includes('mlops') || combinedText.includes('ml pipelines')) return 'MLOps';
  if (combinedText.includes('ai agent') || combinedText.includes('autonomous agent')) return 'AI Agents';
  if (combinedText.includes('data science') || combinedText.includes('power bi') || combinedText.includes('dashboard') || combinedText.includes('analytics')) return 'Data Science';
  if (combinedText.includes('machine learning') || combinedText.includes('regression') || combinedText.includes('classification') || combinedText.includes('scikit-learn') || combinedText.includes('predictive')) return 'Machine Learning';
  if (combinedText.includes('web app') || combinedText.includes('website') || combinedText.includes('management system') || combinedText.includes('portfolio')) return 'Web Development';

  // 4. Default fallback
  return 'Others';
}

/**
 * Retrieve details for a category name (e.g. icon, gradient, description).
 * Generates details dynamically for custom categories.
 *
 * @param {string} categoryName - Name of the category.
 * @returns {object} Category detail config.
 */
export function getCategoryDetails(categoryName) {
  if (CATEGORIES_CONFIG[categoryName]) {
    return {
      name: categoryName,
      slug: slugify(categoryName),
      ...CATEGORIES_CONFIG[categoryName]
    };
  }

  // Dynamic fallback for custom/new categories
  return {
    name: categoryName,
    slug: slugify(categoryName),
    icon: 'fa-microchip',
    description: `AI-driven resources and systems categorized under ${categoryName}.`,
    gradient: 'from-violet-500 to-indigo-500' // General fallback dynamic gradient
  };
}

/**
 * Summarize and map categories from a list of categorized projects.
 * @param {Array} projects - List of projects (repositories merged with local metadata).
 * @returns {Array} List of category details with counts.
 */
export function getAllCategories(projects) {
  const counts = {};
  projects.forEach(p => {
    const cat = p.category || 'Others';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categories = Object.keys(counts).map(catName => {
    const details = getCategoryDetails(catName);
    return {
      ...details,
      count: counts[catName]
    };
  });

  // Sort: Predefined order first, custom categories next, "Others" always last
  const predefinedKeys = Object.keys(CATEGORIES_CONFIG).filter(k => k !== 'Others');
  
  return categories.sort((a, b) => {
    if (a.name === 'Others') return 1;
    if (b.name === 'Others') return -1;
    
    const idxA = predefinedKeys.indexOf(a.name);
    const idxB = predefinedKeys.indexOf(b.name);

    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    return a.name.localeCompare(b.name);
  });
}
