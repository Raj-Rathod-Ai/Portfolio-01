/**
 * Global Command Palette (Cmd+K / Ctrl+K) Spotlight Engine (Awwwards Style)
 * Provides instant search and direct navigation across 21 live deployments, categories, resumes, and actions.
 */

export class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredItems = [];
    this.items = this.getDefaultItems();
  }

  getDefaultItems() {
    return [
      // Verified Live Deployments
      { title: 'Movie Recommendations Engine', category: 'Live Demo', url: 'https://cinema-verse.streamlit.app/', icon: 'fa-solid fa-film', external: true },
      { title: 'Fake News Detection System', category: 'Live Demo', url: 'https://truthlens5.netlify.app/', icon: 'fa-solid fa-shield-halved', external: true },
      { title: 'AutoPrepAI Data Platform', category: 'Live Demo', url: 'https://data-eda-processing.streamlit.app/', icon: 'fa-solid fa-wand-magic-sparkles', external: true },
      { title: 'HybridMind Multi-Model Platform', category: 'Live Demo', url: 'https://hybridmind.netlify.app/', icon: 'fa-solid fa-brain', external: true },
      { title: 'ChatNotes RAG Document Assistant', category: 'Live Demo', url: 'https://chat-with-your-notes-dusx.onrender.com/', icon: 'fa-solid fa-comments', external: true },
      { title: 'Flower & Leaf Disease System', category: 'Live Demo', url: 'https://flower-disease-system.vercel.app', icon: 'fa-solid fa-leaf', external: true },
      { title: 'Taxi Fare Prediction Engine', category: 'Live Demo', url: 'https://taxi-price-prediction.netlify.app/', icon: 'fa-solid fa-taxi', external: true },
      { title: 'Food Delivery Time Prediction', category: 'Live Demo', url: 'https://fooddelivery-time.streamlit.app/', icon: 'fa-solid fa-truck-fast', external: true },
      { title: 'Discover Your True Personality', category: 'Live Demo', url: 'https://discover-your-true-personality.streamlit.app/', icon: 'fa-solid fa-user-astronaut', external: true },
      { title: 'Car Selling Price Prediction', category: 'Live Demo', url: 'https://car-selling-price-prediction.streamlit.app/', icon: 'fa-solid fa-car', external: true },
      { title: 'USA House Price Prediction', category: 'Live Demo', url: 'https://usa-house-price-predictions.streamlit.app/', icon: 'fa-solid fa-house', external: true },
      { title: 'Library Management System', category: 'Live Demo', url: 'https://librarymangement1.streamlit.app/', icon: 'fa-solid fa-book-bookmark', external: true },
      { title: 'Stone Paper Scissors Game', category: 'Live Demo', url: 'https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/', icon: 'fa-solid fa-gamepad', external: true },

      // Category Pages
      { title: 'Machine Learning Projects', category: 'Page', url: '/projects/machine-learning', icon: 'fa-solid fa-chart-line' },
      { title: 'Deep Learning & Neural Networks', category: 'Page', url: '/projects/deep-learning', icon: 'fa-solid fa-network-wired' },
      { title: 'Natural Language Processing (NLP)', category: 'Page', url: '/projects/nlp', icon: 'fa-solid fa-language' },
      { title: 'Computer Vision Systems', category: 'Page', url: '/projects/computer-vision', icon: 'fa-solid fa-eye' },
      { title: 'Generative AI & LLM Systems', category: 'Page', url: '/projects/generative-ai', icon: 'fa-solid fa-microchip' },
      { title: 'Full-Stack Web Applications', category: 'Page', url: '/projects/web-development', icon: 'fa-solid fa-code' },
      { title: 'All Projects Directory', category: 'Page', url: '/projects/all', icon: 'fa-solid fa-layer-group' },
      { title: 'Home & About Raj Rathod', category: 'Page', url: '/', icon: 'fa-solid fa-house' },

      // Actions & Resumes
      { title: 'Download AI/ML Developer Resume', category: 'Action', url: '/Rathod-Raj-Ai.pdf', icon: 'fa-solid fa-file-pdf', external: true },
      { title: 'Download Full-Stack Developer Resume', category: 'Action', url: '/Rathod_Raj_FullStack.pdf', icon: 'fa-solid fa-file-pdf', external: true },
      { title: 'Open AI Assistant Chatbot', category: 'Action', action: 'chatbot', icon: 'fa-solid fa-robot' },
      { title: 'Contact / Send Message to Raj', category: 'Action', action: 'contact', icon: 'fa-solid fa-envelope' },
      { title: 'GitHub Profile (@Raj-Rathod-Ai)', category: 'Social', url: 'https://github.com/Raj-Rathod-Ai', icon: 'fa-brands fa-github', external: true },
      { title: 'LinkedIn Profile (/in/raj-rathod-ai)', category: 'Social', url: 'https://linkedin.com/in/raj-rathod-ai', icon: 'fa-brands fa-linkedin', external: true },
      { title: 'LeetCode Profile (350+ Solved)', category: 'Social', url: 'https://leetcode.com/u/Raj-Rathod', icon: 'fa-solid fa-code-commit', external: true }
    ];
  }

  setup() {
    // Inject Command Palette Modal into DOM
    if (!document.getElementById('cmd-palette-modal')) {
      const modal = document.createElement('div');
      modal.id = 'cmd-palette-modal';
      modal.className = 'fixed inset-0 z-[100000] hidden items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xl transition-all duration-200';
      modal.innerHTML = `
        <div class="w-full max-w-2xl bg-[#0d1117] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-200 scale-95 opacity-0" id="cmd-palette-card">
          <!-- Search Header -->
          <div class="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
            <input id="cmd-palette-input" type="text" placeholder="Type a project, category, resume, or command..." class="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm sm:text-base outline-none font-inter" autocomplete="off" />
            <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 rounded">ESC</kbd>
          </div>
          <!-- Results List -->
          <div id="cmd-palette-results" class="max-h-[60vh] overflow-y-auto p-2 space-y-1">
            <!-- Dynamic Items -->
          </div>
          <!-- Footer HUD -->
          <div class="px-4 py-2.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <div class="flex items-center gap-3">
              <span><kbd class="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↑</kbd> <kbd class="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↓</kbd> Navigate</span>
              <span><kbd class="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">↵</kbd> Select</span>
            </div>
            <span class="text-indigo-400 font-semibold">21 Live Deployments</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Desktop Floating HUD Shortcut Pill
      const triggerPill = document.createElement('div');
      triggerPill.id = 'cmd-palette-trigger-pill';
      triggerPill.className = 'fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl text-xs font-mono text-gray-300 shadow-2xl hover:border-primary hover:text-white cursor-pointer transition-all duration-200 group';
      triggerPill.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
        <span class="text-gray-400 group-hover:text-gray-200">Quick Command</span>
        <kbd class="px-1.5 py-0.5 text-[10px] bg-white/10 border border-white/15 rounded text-gray-300 group-hover:border-primary">⌘K</kbd>
      `;
      document.body.appendChild(triggerPill);

      triggerPill.addEventListener('click', () => this.open());
    }

    // Global Key Listener (Cmd+K / Ctrl+K / Escape)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.filteredItems.length);
          this.renderResults();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % Math.max(1, this.filteredItems.length);
          this.renderResults();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelection();
        }
      }
    });

    const modal = document.getElementById('cmd-palette-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    const input = document.getElementById('cmd-palette-input');
    input.addEventListener('input', () => {
      this.filterItems(input.value);
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    const modal = document.getElementById('cmd-palette-modal');
    const card = document.getElementById('cmd-palette-card');
    const input = document.getElementById('cmd-palette-input');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    requestAnimationFrame(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
      input.value = '';
      input.focus();
      this.filterItems('');
    });
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('cmd-palette-modal');
    const card = document.getElementById('cmd-palette-card');

    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 150);
  }

  filterItems(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    const container = document.getElementById('cmd-palette-results');
    if (!container) return;

    if (this.filteredItems.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-gray-500 font-mono text-xs">
          No matching commands or projects found for query.
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      const bg = isSelected ? 'bg-indigo-600/20 border-indigo-500/40 text-white' : 'border-transparent text-gray-300 hover:bg-white/5';
      const badgeColor = item.category === 'Live Demo' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' :
                         item.category === 'Page' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                         item.category === 'Action' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                         'bg-amber-500/10 text-amber-400 border-amber-500/30';

      return `
        <div data-idx="${idx}" class="cmd-item flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${bg} cursor-pointer transition-all duration-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm ${isSelected ? 'text-primary' : 'text-gray-400'}">
              <i class="${item.icon}"></i>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-200'}">${item.title}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-md border ${badgeColor}">${item.category}</span>
            ${item.external ? '<i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-gray-500"></i>' : ''}
          </div>
        </div>
      `;
    }).join('');

    // Bind click events
    container.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        this.selectedIndex = idx;
        this.executeSelection();
      });
    });
  }

  executeSelection() {
    const item = this.filteredItems[this.selectedIndex];
    if (!item) return;

    this.close();

    if (item.action === 'chatbot') {
      const fab = document.getElementById('chatbot-fab');
      if (fab) fab.click();
    } else if (item.action === 'contact') {
      window.location.hash = '#contact';
    } else if (item.url) {
      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.hash = item.url;
      }
    }
  }
}

export const commandPalette = new CommandPalette();
