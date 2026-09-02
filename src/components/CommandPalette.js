/**
 * Global Command Palette (Cmd+K / Ctrl+K) Spotlight Engine (Awwwards Style)
 * Exclusively displays and launches all 21 verified project live deployments.
 * Features dedicated wheel scroll interception, Lenis background freezing, and keyboard navigation.
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
      { title: 'MeetNotes AI Meeting Intelligence', category: 'Live Demo', url: 'https://meetnotes.streamlit.app/', icon: 'fa-solid fa-video', tech: 'RAG · Whisper · Video-Agent · Streamlit', external: true },
      { title: 'SENTI.AI Emotion Intelligence', category: 'Deep Learning', url: 'https://github.com/Raj-Rathod-Ai/senti.ai', icon: 'fa-solid fa-brain', tech: 'BiGRU · Deep Learning · Python', external: true },
      { title: 'AutoPrepAI Data Platform', category: 'Live Demo', url: 'https://data-eda-processing.streamlit.app/', icon: 'fa-solid fa-wand-magic-sparkles', tech: 'Streamlit · Python · EDA', external: true },
      { title: 'Movie Recommendations Engine', category: 'Live Demo', url: 'https://cinema-verse.streamlit.app/', icon: 'fa-solid fa-film', tech: 'NLP · Cosine Similarity · ML', external: true },
      { title: 'TruthLens Fake News Detection', category: 'Live Demo', url: ['https://truthlens5.netlify.app/', 'https://truthlens5.streamlit.app/'], icon: 'fa-solid fa-shield-halved', tech: 'NLP · Deep Learning · Streamlit · Netlify', external: true },
      { title: 'ChatNotes RAG PDF Assistant', category: 'Live Demo', url: 'https://chat-with-your-notes-dusx.onrender.com/', icon: 'fa-solid fa-comments', tech: 'Generative AI · RAG · Python', external: true },
      { title: 'HybridMind Multi-Model Platform', category: 'Live Demo', url: 'https://hybridmind.netlify.app/', icon: 'fa-solid fa-brain', tech: 'Gemini · Mistral · Tavily', external: true },
      { title: 'Flower & Leaf Disease Detection', category: 'Live Demo', url: 'https://flower-disease-system.vercel.app', icon: 'fa-solid fa-leaf', tech: 'CNN · Deep Learning · Vercel', external: true },
      { title: 'Taxi Fare Prediction Engine', category: 'Live Demo', url: 'https://taxi-price-prediction.netlify.app/', icon: 'fa-solid fa-taxi', tech: 'Regression · Scikit-Learn', external: true },
      { title: 'Food Delivery Time Prediction', category: 'Live Demo', url: 'https://fooddelivery-time.streamlit.app/', icon: 'fa-solid fa-truck-fast', tech: 'Machine Learning · Streamlit', external: true },
      { title: 'Discover Your True Personality', category: 'Live Demo', url: 'https://discover-your-true-personality.streamlit.app/', icon: 'fa-solid fa-user-astronaut', tech: 'Classification · Psychology ML', external: true },
      { title: 'Car Selling Price Prediction', category: 'Live Demo', url: 'https://car-selling-price-prediction.streamlit.app/', icon: 'fa-solid fa-car', tech: 'Random Forest · Streamlit', external: true },
      { title: 'USA House Price Prediction', category: 'Live Demo', url: 'https://usa-house-price-predictions.streamlit.app/', icon: 'fa-solid fa-house', tech: 'Linear Regression · Analytics', external: true },
      { title: 'Salary Predication App', category: 'Live Demo', url: 'https://salary-predications.streamlit.app/', icon: 'fa-solid fa-money-bill-trend-up', tech: 'Regression ML · Python', external: true },
      { title: 'Student Performance Predication', category: 'Live Demo', url: 'https://student-performance-predication.streamlit.app', icon: 'fa-solid fa-graduation-cap', tech: 'Educational Data Mining', external: true },
      { title: 'Mark Predication System', category: 'Live Demo', url: 'https://mark-predication.streamlit.app/', icon: 'fa-solid fa-chart-simple', tech: 'Predictive Analytics', external: true },
      { title: 'Healthy Lifestyle Prediction', category: 'Live Demo', url: 'https://healthy-lifestyle-prediction.streamlit.app/', icon: 'fa-solid fa-heart-pulse', tech: 'Healthcare ML · Streamlit', external: true },
      { title: 'Drug Recommendation System', category: 'Live Demo', url: 'https://drug-recommendation-systems.streamlit.app/', icon: 'fa-solid fa-pills', tech: 'Bioinformatics · Decision Trees', external: true },
      { title: 'Random Forest Delivery Time', category: 'Live Demo', url: 'https://random-forest-food-delivery-time.streamlit.app/', icon: 'fa-solid fa-clock', tech: 'Ensemble Learning · Python', external: true },
      { title: 'Stone Paper Scissors Python Game', category: 'Live Demo', url: 'https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/', icon: 'fa-solid fa-gamepad', tech: 'Interactive Game · Streamlit', external: true },
      { title: 'Tic-Tac-Toe Python Game', category: 'Live Demo', url: 'https://tic-tac-toe-1.streamlit.app/', icon: 'fa-solid fa-table-cells', tech: 'Minimax Algorithm · Python', external: true },
      { title: 'Library Management System', category: 'Live Demo', url: 'https://librarymangement1.streamlit.app/', icon: 'fa-solid fa-book-bookmark', tech: 'Database Management · CRUD', external: true },
      { title: 'Raj Rathod AI Portfolio Engine', category: 'Live Demo', url: 'https://rathodrajai.netlify.app/', icon: 'fa-solid fa-globe', tech: 'Full-Stack · Vanilla JS · Express', external: true }
    ];
  }

  setup() {
    // Inject Command Palette Modal into DOM
    if (!document.getElementById('cmd-palette-modal')) {
      const modalHTML = `
        <div id="cmd-palette-modal" class="fixed inset-0 z-[9999] hidden items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-md transition-opacity duration-200">
          <div id="cmd-palette-backdrop" class="absolute inset-0"></div>
          <div id="cmd-palette-card" class="relative w-full max-w-xl bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transform scale-95 opacity-0 transition-all duration-200 z-10 flex flex-col max-h-[70vh]">
            
            <!-- Search Header -->
            <div class="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
              <input id="cmd-palette-input" type="text" placeholder="Search 21 verified live apps, models, or technologies..." class="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none font-sans" autocomplete="off" spellcheck="false" />
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400 border border-white/10">ESC</span>
            </div>

            <!-- Scrollable Results Container with Wheel Interception -->
            <div id="cmd-palette-results" class="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
              <!-- Dynamically populated -->
            </div>

            <!-- Footer Meta -->
            <div class="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
              <div class="flex items-center gap-3">
                <span><kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px]">↑</kbd> <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px]">↓</kbd> Navigate</span>
                <span><kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px]">↵</kbd> Launch Live App</span>
              </div>
              <span>21 Live Deployments</span>
            </div>

          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    this.bindEvents();
  }

  bindEvents() {
    const modal = document.getElementById('cmd-palette-modal');
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-palette-input');
    const resultsContainer = document.getElementById('cmd-palette-results');

    // Prevent background wheel scrolling from bleeding when scrolling inside the palette modal
    if (resultsContainer) {
      resultsContainer.addEventListener('wheel', (e) => {
        const atTop = resultsContainer.scrollTop === 0 && e.deltaY < 0;
        const atBottom = (resultsContainer.scrollHeight - resultsContainer.scrollTop <= resultsContainer.clientHeight + 1) && e.deltaY > 0;
        if (atTop || atBottom) {
          e.preventDefault();
        }
        e.stopPropagation();
      }, { passive: false });
    }

    // Keyboard shortcut listeners (Cmd+K / Ctrl+K / Escape)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.filteredItems.length);
          this.renderResults(true);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % Math.max(1, this.filteredItems.length);
          this.renderResults(true);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelection();
        }
      }
    });

    // Close on backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    // Filter on input change
    if (input) {
      input.addEventListener('input', (e) => {
        this.filterItems(e.target.value);
      });
    }

    // Connect any UI elements that have [data-cmd-palette-trigger]
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-cmd-palette-trigger]')) {
        e.preventDefault();
        this.open();
      }
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

    if (window.lenis && typeof window.lenis.stop === 'function') {
      window.lenis.stop();
    }
    
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

    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }

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
        (item.tech && item.tech.toLowerCase().includes(q))
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults(autoScroll = false) {
    const container = document.getElementById('cmd-palette-results');
    if (!container) return;

    if (this.filteredItems.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-gray-500 font-mono text-xs">
          No live project found matching your search.
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      const bg = isSelected ? 'bg-indigo-600/25 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10' : 'border-white/5 text-gray-300 hover:bg-white/5';

      return `
        <div data-idx="${idx}" class="cmd-item flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${bg} cursor-pointer transition-all duration-100">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm shrink-0 ${isSelected ? 'text-primary' : 'text-gray-400'}">
              <i class="${item.icon}"></i>
            </div>
            <div class="truncate">
              <p class="text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200'}">${item.title}</p>
              <p class="text-[10px] font-mono text-gray-500 truncate">${item.tech}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0 ml-2">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-teal-500/10 text-teal-400 border-teal-500/30">Live App</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-gray-400"></i>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        this.selectedIndex = idx;
        this.executeSelection();
      });
    });

    if (autoScroll) {
      const selectedEl = container.querySelector(`[data-idx="${this.selectedIndex}"]`);
      if (selectedEl && typeof selectedEl.scrollIntoView === 'function') {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  executeSelection() {
    const item = this.filteredItems[this.selectedIndex];
    if (!item) return;

    this.close();

    if (item.url) {
      const urlToOpen = Array.isArray(item.url)
        ? item.url[Math.floor(Math.random() * item.url.length)]
        : item.url;
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
  }
}

export const commandPalette = new CommandPalette();
