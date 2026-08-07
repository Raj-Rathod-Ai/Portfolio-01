import { slugify } from './helpers.js';

/**
 * Priority-ordered category list (highest priority first).
 * The FIRST match in this list wins for any repo.
 */
const CATEGORY_PRIORITY = [
  'RAG',
  'Generative AI',
  'Full Stack',
  'Deep Learning',
  'NLP',
  'Machine Learning',
  'Data Science',
  'Computer Vision',
  'AI Agents',
  'MLOps',
  'Normal Projects',
  'Python Concepts',
  'Java Projects',
  'C Programming',
  'JavaScript Projects',
  'Utilities',
  'Tools',
  'Automation',
  'Others'
];

/**
 * Visual config for each category: icon (Font Awesome), gradient, badge CSS class, description.
 */
const CATEGORIES_CONFIG = {
  'RAG': {
    icon: 'fa-magnifying-glass-chart',
    description: 'Retrieval-Augmented Generation, vector databases, and semantic search.',
    gradient: 'from-rose-500 via-orange-500 to-pink-500',
    glowColor: 'rgba(244,63,94,0.35)',
    badgeClass: 'cat-badge-rag'
  },
  'Generative AI': {
    icon: 'fa-wand-magic-sparkles',
    description: 'LLMs, prompt engineering, and GenAI application development.',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    glowColor: 'rgba(99,102,241,0.35)',
    badgeClass: 'cat-badge-genai'
  },
  'Full Stack': {
    icon: 'fa-layer-group',
    description: 'Full-stack applications combining web development, APIs, and database engineering.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    glowColor: 'rgba(16,185,129,0.35)',
    badgeClass: 'cat-badge-fullstack'
  },
  'Deep Learning': {
    icon: 'fa-brain',
    description: 'Neural networks, CNNs, RNNs, and deep feature learning.',
    gradient: 'from-teal-500 via-emerald-500 to-sky-500',
    glowColor: 'rgba(20,184,166,0.35)',
    badgeClass: 'cat-badge-dl'
  },
  'NLP': {
    icon: 'fa-language',
    description: 'Natural Language Processing, text mining, and transformers.',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    glowColor: 'rgba(168,85,247,0.35)',
    badgeClass: 'cat-badge-nlp'
  },
  'Machine Learning': {
    icon: 'fa-chart-line',
    description: 'Predictive models, classification, regression, and analytics.',
    gradient: 'from-blue-500 via-indigo-500 to-teal-500',
    glowColor: 'rgba(59,130,246,0.35)',
    badgeClass: 'cat-badge-ml'
  },
  'Data Science': {
    icon: 'fa-chart-pie',
    description: 'Exploratory data analysis, dashboards, and statistical insights.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glowColor: 'rgba(245,158,11,0.35)',
    badgeClass: 'cat-badge-ds'
  },
  'Computer Vision': {
    icon: 'fa-eye',
    description: 'Image classification, object detection, and visual pipelines.',
    gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
    glowColor: 'rgba(6,182,212,0.35)',
    badgeClass: 'cat-badge-cv'
  },
  'AI Agents': {
    icon: 'fa-robot',
    description: 'Autonomous agents, tool use, and decision-making systems.',
    gradient: 'from-fuchsia-500 via-purple-500 to-pink-500',
    glowColor: 'rgba(236,72,153,0.35)',
    badgeClass: 'cat-badge-agents'
  },
  'MLOps': {
    icon: 'fa-gears',
    description: 'Model deployment, pipelines, monitoring, and scaling.',
    gradient: 'from-slate-500 via-zinc-600 to-gray-700',
    glowColor: 'rgba(100,116,139,0.35)',
    badgeClass: 'cat-badge-mlops'
  },
  'Normal Projects': {
    icon: 'fa-folder-open',
    description: 'Management systems, utility applications, and general software.',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    glowColor: 'rgba(34,197,94,0.35)',
    badgeClass: 'cat-badge-normal'
  },
  'Python Concepts': {
    icon: 'fa-snake',
    description: 'Python fundamentals, scripts, games, and practice projects.',
    gradient: 'from-yellow-400 via-yellow-500 to-amber-500',
    glowColor: 'rgba(250,204,21,0.35)',
    badgeClass: 'cat-badge-python'
  },
  'Java Projects': {
    icon: 'fa-mug-hot',
    description: 'Java applications, OOP, and enterprise-style programs.',
    gradient: 'from-orange-500 via-red-500 to-rose-500',
    glowColor: 'rgba(249,115,22,0.35)',
    badgeClass: 'cat-badge-others'
  },
  'C Programming': {
    icon: 'fa-c',
    description: 'C language programs, low-level systems, and algorithms.',
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    glowColor: 'rgba(14,165,233,0.35)',
    badgeClass: 'cat-badge-cv'
  },
  'JavaScript Projects': {
    icon: 'fa-js',
    description: 'Frontend apps, browser tools, and interactive scripts.',
    gradient: 'from-yellow-300 via-amber-400 to-orange-400',
    glowColor: 'rgba(253,224,71,0.3)',
    badgeClass: 'cat-badge-python'
  },
  'Utilities': {
    icon: 'fa-wrench',
    description: 'Helper scripts, automation tools, and developer utilities.',
    gradient: 'from-gray-500 via-slate-500 to-zinc-600',
    glowColor: 'rgba(107,114,128,0.35)',
    badgeClass: 'cat-badge-others'
  },
  'Tools': {
    icon: 'fa-screwdriver-wrench',
    description: 'CLI tools, converters, and productivity enhancers.',
    gradient: 'from-teal-600 via-cyan-600 to-sky-600',
    glowColor: 'rgba(20,184,166,0.35)',
    badgeClass: 'cat-badge-cv'
  },
  'Automation': {
    icon: 'fa-bolt',
    description: 'Task automation, bots, scrapers, and scheduled pipelines.',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glowColor: 'rgba(139,92,246,0.35)',
    badgeClass: 'cat-badge-genai'
  },
  'Others': {
    icon: 'fa-box-open',
    description: 'Miscellaneous creative projects and explorations.',
    gradient: 'from-gray-500 via-slate-500 to-zinc-600',
    glowColor: 'rgba(107,114,128,0.3)',
    badgeClass: 'cat-badge-others'
  }
};

/**
 * Topic/keyword → category mapping rules, checked in priority order.
 * Each entry: { category, topics?, keywords? }
 */
const DETECTION_RULES = [
  {
    category: 'RAG',
    topics: ['rag', 'chatnote', 'vector-database', 'vectordb', 'vector-search', 'pinecone', 'chroma', 'weaviate', 'faiss', 'qdrant', 'retrieval', 'embedding', 'document-qa', 'chat-pdf', 'pdf-chat', 'semantic-search'],
    keywords: ['rag', 'chatnote', 'vector database', 'retrieval augmented', 'retrieval-augmented', 'pinecone', 'chromadb', 'weaviate', 'faiss', 'qdrant', 'semantic search', 'document qa', 'chat with pdf', 'chat pdf']
  },
  {
    category: 'Generative AI',
    topics: ['generative-ai', 'genai', 'llm', 'openai', 'gemini', 'prompt-engineering', 'claude', 'gpt', 'mistral', 'ollama', 'huggingface', 'llama', 'anthropic'],
    keywords: ['generative ai', 'genai', 'llm', 'openai', 'prompt engineering', 'gpt', 'gemini', 'langchain', 'mistral', 'ollama', 'fine-tun']
  },
  {
    category: 'Deep Learning',
    topics: ['deep-learning', 'dl', 'cnn', 'rnn', 'lstm', 'pytorch', 'tensorflow', 'keras', 'neural-network', 'gnn', 'transformer', 'flower-disease', 'leaf-disease'],
    keywords: ['deep learning', 'neural network', 'cnn', 'lstm', 'rnn', 'pytorch', 'tensorflow', 'keras', 'flower disease']
  },
  {
    category: 'NLP',
    topics: ['nlp', 'text-mining', 'transformers', 'natural-language-processing', 'sentiment-analysis', 'text-classification', 'bert', 'word2vec', 'fake-news'],
    keywords: ['nlp', 'natural language', 'text class', 'sentiment', 'bert', 'word2vec', 'text mining', 'fake news']
  },
  {
    category: 'Machine Learning',
    topics: ['machine-learning', 'ml', 'scikit-learn', 'regression', 'classification', 'predictive', 'sklearn', 'xgboost', 'random-forest', 'taxi-fare', 'food-delivery', 'personality', 'salary', 'salary-prediction', 'library-mangement', 'library-management'],
    keywords: ['machine learning', 'regression', 'classification', 'scikit-learn', 'xgboost', 'random forest', 'predictive model', 'taxi fare', 'delivery time', 'salary', 'library mangement', 'library management']
  },
  {
    category: 'Python Concepts',
    topics: ['python-concepts', 'tic-tac-toe', 'tic-tak-toe', 'tictactoe', 'game', 'stone-paper-scissors', 'python-basics'],
    keywords: ['python concept', 'tic tac toe', 'tic tak toe', 'tictactoe', 'stone paper']
  },
  {
    category: 'Data Science',
    topics: ['data-science', 'analytics', 'power-bi', 'visualization', 'data-analysis', 'tableau', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'eda'],
    keywords: ['data science', 'power bi', 'dashboard', 'analytics', 'tableau', 'eda', 'exploratory data']
  },
  {
    category: 'Computer Vision',
    topics: ['computer-vision', 'cv', 'opencv', 'object-detection', 'image-processing', 'yolo', 'segmentation', 'face-recognition'],
    keywords: ['computer vision', 'opencv', 'object detect', 'image class', 'yolo', 'face recognition', 'segmentation']
  },
  {
    category: 'AI Agents',
    topics: ['ai-agents', 'agent', 'agents', 'crewai', 'autogen', 'multi-agent', 'autonomous'],
    keywords: ['ai agent', 'autonomous agent', 'crewai', 'autogen', 'multi-agent']
  },
  {
    category: 'MLOps',
    topics: ['mlops', 'dvc', 'mlflow', 'ci-cd', 'docker', 'kubernetes', 'pipeline', 'model-deployment'],
    keywords: ['mlops', 'model deployment', 'mlflow', 'ci cd']
  },
  {
    category: 'Normal Projects',
    topics: ['web-development', 'web', 'html', 'css', 'database', 'oop'],
    keywords: ['website', 'portfolio', 'creative coding']
  }
];

/**
 * Static Upcoming Projects list provided by Raj Rathod.
 * Automatically replaced when uploaded to GitHub.
 */
export const UPCOMING_PROJECTS = [
  {
    name: 'AI-Powered-Discord-Assistant',
    displayTitle: 'AI Powered Discord Assistant',
    html_url: '#',
    description: 'The AI-Powered Discord Server Assistant is a next-generation project that brings the power of Generative AI directly into a Discord environment — transforming the platform into an intelligent, multimodal assistant hub.',
    category: 'Generative AI',
    language: 'Python',
    topics: ['discord-bot', 'genai', 'llm', 'multimodal', 'upcoming'],
    stargazers_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isUpcoming: true,
    isLocked: true,
    lockedMessage: '🔒 Coming Soon — Raj Rathod is actively building this project! Full code & live demo will auto-sync when uploaded to GitHub.'
  },
  {
    name: 'AI-Code-Reviewer',
    displayTitle: 'AI Code Reviewer',
    html_url: '#',
    description: 'The AI Developer Code Reviewer is an automated system that reviews code using AI-powered multi-agent analysis.',
    category: 'Generative AI',
    language: 'Python',
    topics: ['code-reviewer', 'ai-agents', 'multi-agent', 'llm', 'upcoming'],
    stargazers_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isUpcoming: true,
    isLocked: true,
    lockedMessage: '🔒 Coming Soon — Raj Rathod is actively building this project! Full code & live demo will auto-sync when uploaded to GitHub.'
  },
  {
    name: 'AI-News-Research-Curation',
    displayTitle: 'AI News Research & Curation',
    html_url: '#',
    description: 'The Automated News Research and Curation system aggregates daily updates from sources like Netflix Developer Blog, GitHub Blogs, and Daily.dev using their RSS or API feeds.',
    category: 'RAG',
    language: 'Python',
    topics: ['news-curation', 'rag', 'rss-parser', 'automation', 'upcoming'],
    stargazers_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isUpcoming: true,
    isLocked: true,
    lockedMessage: '🔒 Coming Soon — Raj Rathod is actively building this project! Full code & live demo will auto-sync when uploaded to GitHub.'
  }
];

/**
 * Determine the single highest-priority category for a repo.
 * Rule 1: Neuro OS is the ONLY project allowed in 'Full Stack'.
 * Rule 2: Salary is explicitly 'Machine Learning'.
 * Rule 3: Library Management is explicitly 'Machine Learning'.
 * Rule 4: Tic Tac Toe / Tic Tak Toe is explicitly 'Python Concepts'.
 *
 * @param {object} repo - GitHub repo object.
 * @param {Array}  localMetadata - Entries from projects.json.
 * @returns {string} Single category name.
 */
export function getProjectCategory(repo, localMetadata = []) {
  const name   = (repo.name        || '').toLowerCase();
  const desc   = (repo.description || '').toLowerCase();
  const topics = (repo.topics      || []).map(t => t.toLowerCase());
  const lang   = (repo.language    || '').toLowerCase();
  const combined = `${name} ${desc}`;

  // Rule 1: Neuro OS is the ONLY project in Full Stack
  if (name.includes('neuro-os') || name.includes('neuro_os') || name.includes('neuro os') || name.includes('nuero-os') || name.includes('nuero_os') || name.includes('nuero os')) {
    return 'Full Stack';
  }

  // Rule 2: Salary prediction is explicitly Machine Learning
  if (name.includes('salary') || combined.includes('salary')) {
    return 'Machine Learning';
  }

  // Rule 3: Library Management is explicitly Machine Learning
  if (name.includes('library') || combined.includes('library')) {
    return 'Machine Learning';
  }

  // Rule 4: Tic Tac Toe is explicitly Python Concepts
  if (name.includes('tic') || combined.includes('tic-tac-toe') || combined.includes('tic-tak-toe') || combined.includes('tictactoe')) {
    return 'Python Concepts';
  }

  // Explicit override in projects.json (except Full Stack if not neuro-os)
  const meta = localMetadata.find(m => m.repo.toLowerCase() === name);
  if (meta?.category) {
    if (meta.category.toLowerCase() === 'full stack') {
      return 'Normal Projects';
    }
    const match = CATEGORY_PRIORITY.find(k => k.toLowerCase() === meta.category.toLowerCase());
    if (match) return match;
  }

  // High priority RAG check for repos like chatnote or retrieval projects
  if (name.includes('chatnote') || name.includes('rag') || topics.includes('rag') || topics.includes('chatnote')) {
    return 'RAG';
  }

  // Walk detection rules in PRIORITY order — first match wins
  for (const rule of DETECTION_RULES) {
    if (rule.topics && rule.topics.some(t => topics.includes(t))) {
      return rule.category;
    }
    if (rule.keywords && rule.keywords.some(kw => combined.includes(kw))) {
      return rule.category;
    }
  }

  // Language-based fallback
  if (lang === 'java')   return 'Java Projects';
  if (lang === 'c')      return 'C Programming';
  if (['javascript', 'typescript'].includes(lang)) return 'JavaScript Projects';
  if (lang === 'python') return 'Python Concepts';

  return 'Normal Projects';
}

/**
 * Get full visual config for a category name.
 * @param {string} categoryName
 * @returns {object}
 */
export function getCategoryDetails(categoryName) {
  if (CATEGORIES_CONFIG[categoryName]) {
    return {
      name: categoryName,
      slug: slugify(categoryName),
      ...CATEGORIES_CONFIG[categoryName]
    };
  }
  return {
    name: categoryName,
    slug: slugify(categoryName),
    icon: 'fa-microchip',
    description: `Projects in the ${categoryName} domain.`,
    gradient: 'from-violet-500 to-indigo-500',
    glowColor: 'rgba(139,92,246,0.3)',
    badgeClass: 'cat-badge-others'
  };
}

/**
 * Build the category list from projects, sorted by CATEGORY_PRIORITY order.
 * Automatically filters out empty categories with 0 projects.
 * @param {Array} projects - All repos with .category set.
 * @returns {Array}
 */
export function getAllCategories(projects) {
  const counts = {};
  projects.forEach(p => {
    const cat = p.category || 'Others';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  // Filter out any empty categories with 0 projects
  const categories = Object.keys(counts)
    .filter(catName => counts[catName] > 0)
    .map(catName => ({
      ...getCategoryDetails(catName),
      count: counts[catName]
    }));

  return categories.sort((a, b) => {
    const idxA = CATEGORY_PRIORITY.indexOf(a.name);
    const idxB = CATEGORY_PRIORITY.indexOf(b.name);
    const normA = idxA === -1 ? CATEGORY_PRIORITY.length : idxA;
    const normB = idxB === -1 ? CATEGORY_PRIORITY.length : idxB;
    return normA - normB;
  });
}
